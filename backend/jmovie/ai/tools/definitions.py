LOCAL_MOVIE_SEARCH_TOOL = {
    "type": "function",
    "function": {
        "name": "search_local_movies",
        "description": (
            "Search movies and TV series that already exist in the JMovie database "
            "by title, original title, or IMDb ID."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": (
                        "Movie or TV series title, original title, "
                        "or IMDb ID to search for."
                    ),
                }
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
}

CREATE_MOVIE_REQUEST_TOOL = {
    "type": "function",
    "function": {
        "name": "create_movie_request",
        "description": (
            "Create a request to add a movie or TV series that is not "
            "currently available in the JMovie database."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the movie or TV series.",
                },
                "media_type": {
                    "type": "string",
                    "enum": ["movie", "series"],
                    "description": "Whether the requested item is a movie or TV series.",
                },
                "imdb_id": {
                    "type": ["string", "null"],
                    "description": "IMDb ID if known, otherwise null.",
                },
                "year": {
                    "type": ["integer", "null"],
                    "description": "Release year if known, otherwise null.",
                },
            },
            "required": [
                "title",
                "media_type",
            ],
            "additionalProperties": False,
        },
    },
}



TOOLS = [
    LOCAL_MOVIE_SEARCH_TOOL,
    CREATE_MOVIE_REQUEST_TOOL,
]