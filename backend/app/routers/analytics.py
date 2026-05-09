"""analytics.py — POST /analytics/pageview and GET /analytics/summary."""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Response
from pydantic import BaseModel
from sqlmodel import Session, select, func, text

router = APIRouter(prefix="/analytics", tags=["analytics"])


# ── Request / Response models ──────────────────────────────────────────────────

class PageViewRequest(BaseModel):
    page: str
    referrer: Optional[str] = None


class PageCount(BaseModel):
    page: str
    count: int


class ReferrerCount(BaseModel):
    referrer: str
    count: int


class DayCount(BaseModel):
    date: str
    count: int


class AnalyticsSummary(BaseModel):
    total_views: int
    views_today: int
    views_7d: int
    views_30d: int
    top_pages: list[PageCount]
    top_referrers: list[ReferrerCount]
    views_by_day: list[DayCount]


# ── Helpers ────────────────────────────────────────────────────────────────────

def _check_admin(request: Request) -> None:
    secret = os.getenv("ADMIN_SECRET", "")
    if not secret:
        raise HTTPException(status_code=503, detail="Admin not configured.")
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {secret}":
        raise HTTPException(status_code=401, detail="Unauthorized.")


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/pageview", status_code=204)
def post_pageview(body: PageViewRequest, response: Response) -> None:
    """Store an anonymous page view. No IP stored. Always returns 204."""
    from app.database import get_engine
    from app.models import PageView

    try:
        engine = get_engine()
        with Session(engine) as db:
            db.add(PageView(page=body.page[:100], referrer=body.referrer))
            db.commit()
    except Exception:
        pass  # Fire-and-forget — never fail the client on analytics errors

    response.status_code = 204
    return None


@router.get("/summary", response_model=AnalyticsSummary)
def get_summary(request: Request) -> AnalyticsSummary:
    """Return aggregated analytics. Requires Authorization: Bearer <ADMIN_SECRET>."""
    _check_admin(request)

    from app.database import get_engine
    from app.models import PageView

    try:
        engine = get_engine()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Database unavailable.")

    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    with Session(engine) as db:
        # ── Totals ─────────────────────────────────────────────────────────────
        total_views: int = db.exec(
            select(func.count()).select_from(PageView)
        ).one()

        views_today: int = db.exec(
            select(func.count()).select_from(PageView).where(
                PageView.created_at >= today_start
            )
        ).one()

        views_7d: int = db.exec(
            select(func.count()).select_from(PageView).where(
                PageView.created_at >= seven_days_ago
            )
        ).one()

        views_30d: int = db.exec(
            select(func.count()).select_from(PageView).where(
                PageView.created_at >= thirty_days_ago
            )
        ).one()

        # ── Top pages ──────────────────────────────────────────────────────────
        top_pages_rows = db.exec(
            select(PageView.page, func.count(PageView.id).label("cnt"))
            .group_by(PageView.page)
            .order_by(text("cnt DESC"))
            .limit(10)
        ).all()
        top_pages = [PageCount(page=row[0], count=row[1]) for row in top_pages_rows]

        # ── Top referrers ──────────────────────────────────────────────────────
        top_ref_rows = db.exec(
            select(
                func.coalesce(PageView.referrer, "Direct").label("ref"),
                func.count(PageView.id).label("cnt"),
            )
            .group_by(text("ref"))
            .order_by(text("cnt DESC"))
            .limit(10)
        ).all()
        top_referrers = [ReferrerCount(referrer=row[0], count=row[1]) for row in top_ref_rows]

        # ── Views by day (last 30 days) ────────────────────────────────────────
        day_rows = db.exec(
            select(
                func.date(PageView.created_at).label("day"),
                func.count(PageView.id).label("cnt"),
            )
            .where(PageView.created_at >= thirty_days_ago)
            .group_by(text("day"))
            .order_by(text("day ASC"))
        ).all()
        views_by_day = [
            DayCount(date=str(row[0]), count=row[1]) for row in day_rows
        ]

    return AnalyticsSummary(
        total_views=total_views,
        views_today=views_today,
        views_7d=views_7d,
        views_30d=views_30d,
        top_pages=top_pages,
        top_referrers=top_referrers,
        views_by_day=views_by_day,
    )
