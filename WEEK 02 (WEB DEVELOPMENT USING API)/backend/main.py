from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from .analytics import AnalyticsEngine
from .models import ClaimRequest
from .sample_data import (
    sample_claim_requests,
    sample_found_reports,
    sample_lost_reports,
)

app = FastAPI(title="FindIt@Campus API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for demo; Supabase is used by the frontend directly.
_lost_reports = sample_lost_reports()
_found_reports = sample_found_reports()
_claims: list[ClaimRequest] = sample_claim_requests()


def engine() -> AnalyticsEngine:
    return AnalyticsEngine(_lost_reports, _found_reports)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "FindIt@Campus API"}


@app.get("/api/summary")
def summary() -> dict:
    return engine().summary()


@app.get("/api/reports")
def reports() -> dict:
    return {
        "lost": [r.__dict__ for r in _lost_reports],
        "found": [r.__dict__ for r in _found_reports],
    }


@app.get("/api/charts/daily")
def chart_daily() -> Response:
    return Response(engine().plot_daily_trend(), media_type="image/png")


@app.get("/api/charts/category")
def chart_category() -> Response:
    return Response(engine().plot_category_bar(), media_type="image/png")


@app.get("/api/charts/status")
def chart_status() -> Response:
    return Response(engine().plot_status_pie(), media_type="image/png")


@app.get("/api/charts/heatmap")
def chart_heatmap() -> Response:
    return Response(engine().plot_location_heatmap(), media_type="image/png")


@app.post("/api/claims")
def create_claim(claim: ClaimRequest) -> JSONResponse:
    _claims.append(claim)
    return JSONResponse({"status": "created", "id": claim.id})
