from datetime import date

from app.services.holiday_service import is_public_holiday


def test_india_republic_day_is_holiday():
    assert is_public_holiday("IN", date(2026, 1, 26)) == 1


def test_india_regular_day_is_not_holiday():
    assert is_public_holiday("IN", date(2026, 1, 27)) == 0
