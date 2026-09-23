"""
Domain models — Object-Oriented Programming.

These classes model the real-world entities of the lost-and-found
platform. They are intentionally simple value objects; the heavy
analytics work lives in backend/analytics.py.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, time
from enum import Enum
from typing import Optional


class ItemType(str, Enum):
    LOST = "lost"
    FOUND = "found"


class ItemStatus(str, Enum):
    LOST = "lost"
    FOUND = "found"
    MATCHED = "matched"
    CLAIMED = "claimed"
    RETURNED = "returned"
    CLOSED = "closed"


@dataclass
class Student:
    """A campus student who can report or claim items."""
    name: str
    contact: str
    roll_no: Optional[str] = None

    def display(self) -> str:
        return f"{self.name} ({self.contact})"


@dataclass
class Location:
    """A campus building where an item was lost or found."""
    building_id: str
    label: str
    detail: Optional[str] = None

    def full_label(self) -> str:
        return f"{self.label} · {self.detail}" if self.detail else self.label


@dataclass
class Item:
    """A physical belonging that was lost or found."""
    title: str
    category: str
    description: Optional[str]
    image_url: Optional[str]
    location: Location
    reward: Optional[float] = None

    def summary(self) -> str:
        return f"{self.title} ({self.category}) @ {self.location.full_label()}"


@dataclass
class TimelineEvent:
    at: datetime
    status: ItemStatus
    note: str


@dataclass
class LostReport:
    """A report filed by a student who lost an item."""
    id: str
    item: Item
    owner: Student
    event_date: date
    event_time: Optional[time]
    timeline: list[TimelineEvent] = field(default_factory=list)
    status: ItemStatus = ItemStatus.LOST

    def add_event(self, note: str, status: ItemStatus | None = None) -> None:
        self.timeline.append(
            TimelineEvent(at=datetime.now(), status=status or self.status, note=note)
        )


@dataclass
class FoundReport:
    """A report filed by a student who found someone else's item."""
    id: str
    item: Item
    holder: Student
    event_date: date
    event_time: Optional[time]
    timeline: list[TimelineEvent] = field(default_factory=list)
    status: ItemStatus = ItemStatus.FOUND

    def add_event(self, note: str, status: ItemStatus | None = None) -> None:
        self.timeline.append(
            TimelineEvent(at=datetime.now(), status=status or self.status, note=note)
        )


@dataclass
class ClaimRequest:
    """A request from a student claiming a found item belongs to them."""
    id: str
    item_id: str
    claimer: Student
    note: Optional[str]
    status: str = "pending"  # pending | approved | rejected

    def approve(self) -> None:
        self.status = "approved"

    def reject(self) -> None:
        self.status = "rejected"
