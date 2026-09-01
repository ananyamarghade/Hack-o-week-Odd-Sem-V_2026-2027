"""
Sample data — a small in-memory dataset used when the FastAPI service
runs standalone (no Supabase). It builds LostReport / FoundReport
objects via the OOP models so the analytics engine has real data to
crunch.
"""
from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import List

from .models import (
    ClaimRequest,
    FoundReport,
    Item,
    ItemStatus,
    Location,
    LostReport,
    Student,
    TimelineEvent,
)


def _days_ago(n: int) -> date:
    return date.today() - timedelta(days=n)


def _ts(days_ago: int, hour: int = 10) -> datetime:
    return datetime.combine(_days_ago(days_ago), time(hour=hour))


def sample_students() -> List[Student]:
    return [
        Student("Aarav Sharma", "aarav.s@campus.edu", "CS21-001"),
        Student("Priya Nair", "priya.n@campus.edu", "EC21-014"),
        Student("Rahul Verma", "rahul.v@campus.edu", "ME20-031"),
        Student("Meera Kapoor", "meera.k@campus.edu", "CS22-008"),
        Student("Sneha Rao", "sneha.r@campus.edu", "BT21-022"),
        Student("Karan Mehta", "karan.m@campus.edu", "CE20-045"),
        Student("Devansh Patel", "devansh.p@campus.edu", "EE21-017"),
        Student("Ishaan Gupta", "ishaan.g@campus.edu", "CS23-090"),
        Student("Ananya Iyer", "ananya.i@campus.edu", "CH21-011"),
        Student("Rohit Das", "rohit.d@campus.edu", "ME22-033"),
        Student("Tara Singh", "tara.s@campus.edu", "AR21-006"),
        Student("Nikhil Bose", "nikhil.b@campus.edu", "CS20-077"),
    ]


def sample_lost_reports() -> List[LostReport]:
    students = {s.name: s for s in sample_students()}
    data = [
        ("Blue Student ID Card", "cards", "library", "Main entrance turnstile",
         "Aarav Sharma", 2, 9, 0),
        ("White AirPods Case", "electronics", "labs", "Steps near Block B",
         "Rahul Verma", 3, 17, 500),
        ("Scientific Calculator", "electronics", "library", "Reading Hall 2",
         "Sneha Rao", 1, 11, 100),
        ("USB Flash Drive 64GB", "electronics", "labs", "Lab 204",
         "Devansh Patel", 7, 16, 0),
        ("Keychain with Car Key", "keys", "parking", "Exit gate",
         "Ishaan Gupta", 1, 19, 200),
        ("Black Laptop Charger", "electronics", "labs", "Lab 110",
         "Rohit Das", 2, 14, 0),
        ("Analog Wristwatch", "accessories", "canteen", "Counter area",
         "Nikhil Bose", 4, 12, 0),
    ]
    reports = []
    for title, cat, bldg, detail, name, d, h, reward in data:
        owner = students[name]
        item = Item(title=title, category=cat, description=f"{title} lost near {detail}",
                    image_url=None, location=Location(bldg, bldg, detail), reward=reward or None)
        timeline = [TimelineEvent(_ts(d, h), ItemStatus.LOST, "Reported missing")]
        status = ItemStatus.LOST
        if title == "USB Flash Drive 64GB":
            timeline += [
                TimelineEvent(_ts(5, 9), ItemStatus.FOUND, "Found by a classmate"),
                TimelineEvent(_ts(4, 10), ItemStatus.CLAIMED, "Claim verified"),
                TimelineEvent(_ts(3, 11), ItemStatus.RETURNED, "Returned to owner"),
            ]
            status = ItemStatus.RETURNED
        elif title == "White AirPods Case":
            timeline += [TimelineEvent(_ts(2, 9), ItemStatus.MATCHED, "Possible match at security")]
            status = ItemStatus.MATCHED
        reports.append(LostReport(id=f"lost-{len(reports)+1}", item=item, owner=owner,
                                  event_date=_days_ago(d), event_time=time(h, 0),
                                  timeline=timeline, status=status))
    return reports


def sample_found_reports() -> List[FoundReport]:
    students = {s.name: s for s in sample_students()}
    data = [
        ("Black Leather Wallet", "accessories", "canteen", "Table near window",
         "Priya Nair", 1, 13),
        ("Steel Water Bottle", "containers", "parking", "Bay 12",
         "Meera Kapoor", 4, 8),
        ("Umbrella (Navy)", "apparel", "canteen", "Umbrella stand",
         "Karan Mehta", 2, 15),
        ("Reading Glasses (Round)", "accessories", "library", "Desk near window",
         "Ananya Iyer", 3, 10),
        ("Canvas Tote Bag", "bags", "hostel", "Lobby reception",
         "Tara Singh", 5, 21),
    ]
    reports = []
    for title, cat, bldg, detail, name, d, h in data:
        holder = students[name]
        item = Item(title=title, category=cat, description=f"{title} found at {detail}",
                    image_url=None, location=Location(bldg, bldg, detail), reward=None)
        timeline = [TimelineEvent(_ts(d, h), ItemStatus.FOUND, "Found and reported")]
        status = ItemStatus.FOUND
        if title == "Steel Water Bottle":
            timeline += [TimelineEvent(_ts(2, 9), ItemStatus.CLAIMED, "Owner identified via initials")]
            status = ItemStatus.CLAIMED
        elif title == "Canvas Tote Bag":
            timeline += [TimelineEvent(_ts(3, 10), ItemStatus.CLAIMED, "Claimed by owner")]
            status = ItemStatus.CLAIMED
        reports.append(FoundReport(id=f"found-{len(reports)+1}", item=item, holder=holder,
                                    event_date=_days_ago(d), event_time=time(h, 0),
                                    timeline=timeline, status=status))
    return reports


def sample_claim_requests() -> List[ClaimRequest]:
    students = {s.name: s for s in sample_students()}
    return [
        ClaimRequest(id="claim-1", item_id="found-1",
                     claimer=students["Aarav Sharma"], note="My wallet has a red thread inside."),
        ClaimRequest(id="claim-2", item_id="found-2",
                     claimer=students["Meera Kapoor"], note="Initials MK engraved on the cap."),
    ]
