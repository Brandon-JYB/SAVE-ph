"""Supabase client, created lazily so the crop predictor still runs without it."""
import os
from functools import lru_cache

from dotenv import load_dotenv
from fastapi import HTTPException
from supabase import Client, create_client

load_dotenv()


@lru_cache(maxsize=1)
def get_db() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        )
    return create_client(url, key)
