from fastapi import APIRouter, HTTPException

from app.services.supabase_service import supabase
from app.services.location_service import get_location_context

router = APIRouter(
    prefix="/locations",
    tags=["Locations"]
)


@router.get("")
def get_locations():

    response = (
        supabase
        .table("locations")
        .select("*")
        .execute()
    )

    return response.data


@router.get("/{location_id}/context")
def get_location_full_context(location_id: str):

    context = get_location_context(location_id)

    if not context:
        raise HTTPException(
            status_code=404,
            detail="Location not found"
        )

    return context