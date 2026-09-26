from app.services.supabase_service import supabase


def get_location_context(location_id: str):
    # 1. Get location
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

    # 2. Get all venue profiles for this location
    venue_response = (
        supabase
        .table("venues")
        .select("*")
        .eq("location_id", location_id)
        .execute()
    )

    venues = venue_response.data or []

    # 3. Get all historical records for this location
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
        "historical_data": historical_data
    }