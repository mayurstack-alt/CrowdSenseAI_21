from app.services.supabase_service import get_supabase_client


def get_location_context(location_id: str):
    supabase = get_supabase_client()

    location_response = (
        supabase
        .table("locations")
        .select("*")
        .eq("location_id", location_id)
        .single()
        .execute()
    )

    location = location_response.data

    if not location:
        return None

    venue_response = (
        supabase
        .table("venues")
        .select("*")
        .eq("location_id", location_id)
        .execute()
    )

    venues = venue_response.data or []

    historical_response = (
        supabase
        .table("historical_data")
        .select("*")
        .eq("location_id", location_id)
        .execute()
    )

    historical_data = historical_response.data or []

    return {
        "location": location,
        "venues": venues,
        "historical_data": historical_data,
    }