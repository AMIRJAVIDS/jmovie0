from ai.models import MovieRequest


def create_movie_request(
    title: str,
    media_type: str,
    imdb_id: str | None = None,
    year: int | None = None,
):
    """
    Create a request to add a movie or TV series to JMovie.
    """

    title = title.strip()

    if not title:
        return {
            "success": False,
            "error": "Title is required.",
        }

    if media_type not in {"movie", "series"}:
        return {
            "success": False,
            "error": "media_type must be 'movie' or 'series'.",
        }

    # جلوگیری از ثبت درخواست تکراری در حالت pending
    existing_request = MovieRequest.objects.filter(
        title__iexact=title,
        media_type=media_type,
        status="pending",
    ).first()

    if existing_request:
        return {
            "success": True,
            "created": False,
            "request_id": existing_request.id,
            "message": "A pending request for this title already exists.",
        }

    request = MovieRequest.objects.create(
        title=title,
        media_type=media_type,
        imdb_id=imdb_id,
        year=year,
    )

    return {
        "success": True,
        "created": True,
        "request_id": request.id,
        "title": request.title,
        "media_type": request.media_type,
        "status": request.status,
    }