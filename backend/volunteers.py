"""Volunteer registration, feedback and inquiry endpoints, stored in Supabase."""
import re
import secrets
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException, Query, Response
from postgrest.exceptions import APIError
from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

from db import get_db

router = APIRouter()

EMAIL_RE = re.compile(r"^\S+@\S+\.\S+$")
PHONE_RE = re.compile(r"^(\+63|0)?9\d{9}$")
CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"  # no 0/O/1/I/L
CODE_RE = re.compile(rf"^SAVE-[{CODE_ALPHABET}]{{8}}$")
TOPICS = {"general", "requirements", "farms", "safety", "partnership"}


class CamelModel(BaseModel):
    """Accepts the camelCase JSON the React forms send."""
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, str_strip_whitespace=True)


def _check_email(v: str) -> str:
    if not EMAIL_RE.match(v):
        raise ValueError("Enter a valid email address.")
    return v.lower()


class RegistrationIn(CamelModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: str = Field(max_length=254)
    phone: str
    preferred_date: date
    farm_id: UUID
    email_updates: bool = True
    sms_updates: bool = False

    _email = field_validator("email")(_check_email)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        digits = re.sub(r"[\s-]", "", v)
        if not PHONE_RE.match(digits):
            raise ValueError("Enter a valid mobile number, like 0917 123 4567.")
        return "+63" + digits[-10:]  # normalise to +639XXXXXXXXX

    @field_validator("preferred_date")
    @classmethod
    def _future(cls, v: date) -> date:
        if v < datetime.now(ZoneInfo("Asia/Manila")).date():
            raise ValueError("Pick a date that hasn't passed.")
        return v


class ContactPrefsIn(CamelModel):
    email_updates: bool
    sms_updates: bool


class FeedbackIn(CamelModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: str = Field(max_length=254)
    farm_id: UUID
    rating: int = Field(ge=1, le=5)  # the form sends "4"; pydantic coerces it
    comments: str = Field(min_length=1, max_length=2000)
    can_share: bool = False

    _email = field_validator("email")(_check_email)


class InquiryIn(CamelModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: str = Field(max_length=254)
    topic: str = "general"
    message: str = Field(min_length=10, max_length=2000)

    _email = field_validator("email")(_check_email)

    @field_validator("topic")
    @classmethod
    def _topic(cls, v: str) -> str:
        if v not in TOPICS:
            raise ValueError("Unknown topic.")
        return v


def _new_code() -> str:
    return "SAVE-" + "".join(secrets.choice(CODE_ALPHABET) for _ in range(8))


def _db_error(exc: APIError) -> HTTPException:
    print(f"Supabase error: {exc.code} {exc.message}")  # visible in server logs only
    return HTTPException(status_code=500, detail="Something went wrong saving your details. Please try again.")


@router.get("/farms")
def list_farms(date: Optional[date] = Query(None, description="Show spots left for this day")):
    try:
        res = get_db().rpc("farms_with_slots", {"p_date": date.isoformat() if date else None}).execute()
    except APIError as exc:
        raise _db_error(exc)
    return res.data


@router.post("/registrations", status_code=201)
def create_registration(body: RegistrationIn):
    for _ in range(3):  # retry in the (very unlikely) event of a reference-code clash
        code = _new_code()
        try:
            get_db().rpc("register_volunteer", {
                "p_full_name": body.full_name,
                "p_email": body.email,
                "p_phone": body.phone,
                "p_farm_id": str(body.farm_id),
                "p_preferred_date": body.preferred_date.isoformat(),
                "p_email_updates": body.email_updates,
                "p_sms_updates": body.sms_updates,
                "p_reference_code": code,
            }).execute()
            return {"referenceCode": code}
        except APIError as exc:
            if exc.message == "farm_not_found":
                raise HTTPException(404, "That farm isn't available.")
            if exc.message == "farm_full":
                raise HTTPException(409, "That farm is fully booked on that date. Please pick another farm or date.")
            if exc.message == "already_registered":
                raise HTTPException(409, "You're already registered for that farm on that date.")
            if exc.code == "23505" and "reference_code" in (exc.message or ""):
                continue
            raise _db_error(exc)
    raise HTTPException(500, "Couldn't create a reference code. Please try again.")


@router.patch("/registrations/{reference_code}/contact", status_code=204)
def update_contact_prefs(reference_code: str, body: ContactPrefsIn):
    code = reference_code.upper()
    if not CODE_RE.match(code):
        raise HTTPException(404, "Registration not found.")
    try:
        res = (
            get_db().table("registrations")
            .update({"email_updates": body.email_updates, "sms_updates": body.sms_updates})
            .eq("reference_code", code).execute()
        )
    except APIError as exc:
        raise _db_error(exc)
    if not res.data:
        raise HTTPException(404, "Registration not found.")
    return Response(status_code=204)


@router.post("/feedback", status_code=201)
def create_feedback(body: FeedbackIn):
    db = get_db()
    try:
        vol = db.table("volunteers").select("id").eq("email", body.email).limit(1).execute()
        db.table("feedback").insert({
            "volunteer_id": vol.data[0]["id"] if vol.data else None,
            "full_name": body.full_name,
            "email": body.email,
            "farm_id": str(body.farm_id),
            "rating": body.rating,
            "comments": body.comments,
            "can_share": body.can_share,
        }).execute()
    except APIError as exc:
        if exc.code == "23503":  # foreign key: unknown farm
            raise HTTPException(404, "That farm isn't available.")
        raise _db_error(exc)
    return {"ok": True}


@router.post("/inquiries", status_code=201)
def create_inquiry(body: InquiryIn):
    try:
        get_db().table("inquiries").insert({
            "full_name": body.full_name,
            "email": body.email,
            "topic": body.topic,
            "message": body.message,
        }).execute()
    except APIError as exc:
        raise _db_error(exc)
    return {"ok": True}
