import os

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
    )


def get_supabase_client():
    if supabase is None:
        raise RuntimeError("Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
    return supabase