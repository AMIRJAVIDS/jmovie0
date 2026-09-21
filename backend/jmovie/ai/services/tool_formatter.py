def format_local_search_result(result):
    movies = result.get("movies", [])
    series = result.get("series", [])

    items = [
        {
            **movie,
            "media_type": "movie",
        }
        for movie in movies
    ]

    items.extend(
        {
            **item,
            "media_type": "series",
        }
        for item in series
    )

    if not items:
        return {
            "type": "not_found",
            "message": "این مورد در JMovie پیدا نشد.",
            "items": [],
            "request": None,
        }

    return {
        "type": "media_results",
        "message": "موارد زیر در JMovie پیدا شدند:",
        "items": items,
        "request": None,
    }