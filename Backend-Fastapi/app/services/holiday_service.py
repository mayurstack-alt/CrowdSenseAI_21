from datetime import date

import holidays


def is_public_holiday(country_code: str, prediction_date: date) -> int:
    """Return 1 when ``prediction_date`` is a public holiday in a country."""
    if not country_code:
        raise ValueError("Could not determine the venue country for holiday lookup.")

    try:
        country_holidays = holidays.country_holidays(
            country_code.upper(), years=prediction_date.year
        )
    except (KeyError, NotImplementedError) as error:
        raise ValueError(
            f"Holiday calendar is unavailable for country '{country_code}'."
        ) from error

    return int(prediction_date in country_holidays)
