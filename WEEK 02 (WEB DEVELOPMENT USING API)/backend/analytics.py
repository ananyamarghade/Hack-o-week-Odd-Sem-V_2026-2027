from __future__ import annotations

import io
from datetime import timedelta
from typing import Optional

import matplotlib

matplotlib.use("Agg")  
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

from .models import ItemStatus, ItemType, LostReport, FoundReport

#List comprehension
def _event_times(report: LostReport | FoundReport, status: ItemStatus) -> list[datetime]:
    return [e.at for e in report.timeline if e.status == status]

#Dictionary comprehension
def _status_index(timeline: list) -> dict[str, datetime]:
    return {e.status.value: e.at for e in timeline}


class AnalyticsEngine:

    def __init__(self, lost: list[LostReport], found: list[FoundReport]):
        self.lost = lost
        self.found = found
        self._df_lost = self._build_lost_df()
        self._df_found = self._build_found_df()+
        self._merged = self._merge_reports()

    def _build_lost_df(self) -> pd.DataFrame:
        rows = [
            {
                "id": r.id,
                "title": r.item.title,
                "category": r.item.category,
                "building": r.item.location.building_id,
                "status": r.status.value,
                "reward": r.reward or 0,
                "event_date": r.event_date,
                "created_at": r.timeline[0].at if r.timeline else None,
                "returned_at": next(
                    (e.at for e in r.timeline if e.status == ItemStatus.RETURNED), None
                ),
            }
            for r in self.lost
        ]
        df = pd.DataFrame(rows)
        if not df.empty:
            df["event_date"] = pd.to_datetime(df["event_date"], errors="coerce")
            df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
            df["returned_at"] = pd.to_datetime(df["returned_at"], errors="coerce")
            df["reward"] = df["reward"].fillna(0)
        return df

    def _build_found_df(self) -> pd.DataFrame:
        rows = [
            {
                "id": r.id,
                "title": r.item.title,
                "category": r.item.category,
                "building": r.item.location.building_id,
                "status": r.status.value,
                "event_date": r.event_date,
                "created_at": r.timeline[0].at if r.timeline else None,
                "returned_at": next(
                    (e.at for e in r.timeline if e.status == ItemStatus.RETURNED), None
                ),
            }
            for r in self.found
        ]
        df = pd.DataFrame(rows)
        if not df.empty:
            df["event_date"] = pd.to_datetime(df["event_date"], errors="coerce")
            df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
            df["returned_at"] = pd.to_datetime(df["returned_at"], errors="coerce")
        return df

    def _merge_reports(self) -> pd.DataFrame:
        """Merge lost + found tables into one unified report DataFrame."""
        if self._df_lost.empty and self._df_found.empty:
            return pd.DataFrame()
        if self._df_lost.empty:
            return self._df_found.assign(type=ItemType.FOUND.value)
        if self._df_found.empty:
            return self._df_lost.assign(type=ItemType.LOST.value)
        lost = self._df_lost.assign(type=ItemType.LOST.value)
        found = self._df_found.assign(type=ItemType.FOUND.value)
        common = sorted(set(lost.columns) & set(found.columns))
        return pd.concat([lost[common], found[common]], ignore_index=True)

    def recovery_rate(self) -> float:
        if self._merged.empty:
            return 0.0
        statuses = self._merged["status"].to_numpy()
        returned = np.sum(statuses == ItemStatus.RETURNED.value)
        return float(np.round((returned / statuses.size) * 100, 1))

    def average_recovery_days(self) -> Optional[float]:
        df = self._merged
        if df.empty or "returned_at" not in df:
            return None
        mask = df["returned_at"].notna() & df["created_at"].notna()
        if not mask.any():
            return None
        created = df.loc[mask, "created_at"].to_numpy(dtype="datetime64[ns]")
        returned = df.loc[mask, "returned_at"].to_numpy(dtype="datetime64[ns]")
        deltas = (returned - created).astype("timedelta64[D]").astype(np.float64)
        return float(np.round(deltas.mean(), 1))

    def daily_statistics(self, days: int = 14) -> pd.DataFrame:
        if self._merged.empty:
            return pd.DataFrame(columns=["date", "lost", "found"])
        df = self._merged.dropna(subset=["created_at"]).copy()
        df["day"] = df["created_at"].dt.date
        start = pd.Timestamp.utcnow().normalize() - timedelta(days=days - 1)
        window = df[df["created_at"] >= start]
        grouped = (
            window.groupby(["day", "type"]).size().unstack(fill_value=0)
        )
        for col in ("lost", "found"):
            if col not in grouped:
                grouped[col] = 0
        grouped = grouped[["lost", "found"]].reset_index().rename(columns={"day": "date"})
        return grouped

    def category_frequency(self) -> pd.DataFrame:
        """GroupBy category → report count, sorted descending."""
        if self._merged.empty:
            return pd.DataFrame(columns=["category", "count"])
        return (
            self._merged.groupby("category")
            .size()
            .reset_index(name="count")
            .sort_values("count", ascending=False)
        )

    def location_frequency(self) -> pd.DataFrame:
        """GroupBy building → report count, sorted descending."""
        if self._merged.empty:
            return pd.DataFrame(columns=["building", "count"])
        return (
            self._merged.groupby("building")
            .size()
            .reset_index(name="count")
            .sort_values("count", ascending=False)
        )

    def monthly_reports(self) -> pd.DataFrame:
        """GroupBy month → lost/found counts."""
        if self._merged.empty:
            return pd.DataFrame(columns=["month", "lost", "found"])
        df = self._merged.dropna(subset=["created_at"]).copy()
        df["month"] = df["created_at"].dt.to_period("M").astype(str)
        return (
            df.groupby(["month", "type"]).size().unstack(fill_value=0).reset_index()
        )

    def weekly_reports(self) -> pd.DataFrame:
        """GroupBy ISO week → lost/found counts."""
        if self._merged.empty:
            return pd.DataFrame(columns=["week", "lost", "found"])
        df = self._merged.dropna(subset=["created_at"]).copy()
        df["week"] = df["created_at"].dt.to_period("W").astype(str)
        return (
            df.groupby(["week", "type"]).size().unstack(fill_value=0).reset_index()
        )

    def _fig_to_png(self, fig: plt.Figure) -> bytes:
        buf = io.BytesIO()
        fig.tight_layout()
        fig.savefig(buf, format="png", dpi=130)
        plt.close(fig)
        return buf.getvalue()

    def plot_daily_trend(self) -> bytes:
        daily = self.daily_statistics()
        fig, ax = plt.subplots(figsize=(8, 4))
        if daily.empty:
            ax.text(0.5, 0.5, "No data", ha="center", va="center")
        else:
            x = range(len(daily))
            ax.plot(x, daily["lost"], marker="o", label="Lost", color="#f97316")
            ax.plot(x, daily["found"], marker="s", label="Found", color="#3b82f6")
            ax.set_xticks(x)
            ax.set_xticklabels(
                [d.strftime("%b %d") for d in daily["date"]], rotation=45, ha="right"
            )
            ax.set_title("Daily Reports — Last 14 Days")
            ax.set_ylabel("Reports")
            ax.legend()
            ax.grid(alpha=0.3)
        return self._fig_to_png(fig)

    def plot_category_bar(self) -> bytes:
        cats = self.category_frequency()
        fig, ax = plt.subplots(figsize=(8, 4))
        if cats.empty:
            ax.text(0.5, 0.5, "No data", ha="center", va="center")
        else:
            ax.bar(cats["category"], cats["count"], color="#10b981")
            ax.set_title("Most Reported Categories")
            ax.set_ylabel("Reports")
            ax.tick_params(axis="x", rotation=45)
        return self._fig_to_png(fig)

    def plot_status_pie(self) -> bytes:
        if self._merged.empty:
            fig, ax = plt.subplots()
            ax.text(0.5, 0.5, "No data", ha="center", va="center")
            return self._fig_to_png(fig)
        counts = self._merged["status"].value_counts()
        fig, ax = plt.subplots(figsize=(6, 6))
        ax.pie(counts.values, labels=counts.index, autopct="%1.0f%%", startangle=90)
        ax.set_title("Status Distribution")
        return self._fig_to_png(fig)

    def plot_location_heatmap(self) -> bytes:
        if self._merged.empty:
            fig, ax = plt.subplots()
            ax.text(0.5, 0.5, "No data", ha="center", va="center")
            return self._fig_to_png(fig)
        pivot = self._merged.pivot_table(
            index="building", columns="category", aggfunc="size", fill_value=0
        )
        fig, ax = plt.subplots(figsize=(9, 5))
        sns.heatmap(pivot, annot=True, fmt="d", cmap="YlGnBu", ax=ax)
        ax.set_title("Reports by Location × Category")
        ax.set_xlabel("Category")
        ax.set_ylabel("Building")
        return self._fig_to_png(fig)

    def summary(self) -> dict:
        return {
            "total_reports": int(len(self._merged)),
            "total_lost": int(len(self.lost)),
            "total_found": int(len(self.found)),
            "recovery_rate": self.recovery_rate(),
            "average_recovery_days": self.average_recovery_days(),
            "categories": self.category_frequency().to_dict(orient="records"),
            "locations": self.location_frequency().to_dict(orient="records"),
            "daily": self.daily_statistics().to_dict(orient="records"),
            "weekly": self.weekly_reports().to_dict(orient="records"),
            "monthly": self.monthly_reports().to_dict(orient="records"),
        }
