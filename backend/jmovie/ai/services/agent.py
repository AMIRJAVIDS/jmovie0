import json

from .openrouter import OpenRouterService
# from .nvidia import NVIDIAService
from ai.tools.definitions import TOOLS
from ai.tools.movie_search import search_local_movies
from ai.tools.movie_request import create_movie_request

from .tool_formatter import format_local_search_result


class JMovieAgent:

    def __init__(self):
        self.ai = OpenRouterService()  # OpenRouter
        # self.ai = NVIDIAService()  # NVIDIA

    def run(self, user_message: str, history=None):

        if history is None:
            history = []

        messages = [
            {
                "role": "system",
                "content": (
                    "You are the AI assistant of JMovie, a movie and TV series website.\n\n"

                    "IMPORTANT RULES:\n\n"

                    "1. LOCAL JMOVIE DATABASE:\n"
                    "If the user asks whether a specific movie or TV series "
                    "exists in JMovie, you MUST use the search_local_movies tool.\n"
                    "Examples include:\n"
                    "- 'Is Breaking Bad available in JMovie?'\n"
                    "- 'آیا Interstellar در JMovie هست؟'\n"
                    "- 'این سریال رو دارید؟'\n"
                    "- 'آیا فیلم با IMDb ID tt0816692 موجود است؟'\n\n"

                    "2. NEVER GUESS AVAILABILITY:\n"
                    "Never guess whether a movie or TV series exists in JMovie.\n"
                    "Availability claims MUST be based only on the result returned "
                    "by search_local_movies.\n\n"

                    "3. GENERAL RECOMMENDATIONS:\n"
                    "If the user asks for movie or TV series recommendations, "
                    "suggestions, or asks what they should watch, you DO NOT need "
                    "to search the JMovie database.\n"
                    "You may provide general recommendations based on the user's "
                    "requested genre, style, mood, or other criteria.\n"
                    "Examples include:\n"
                    "- 'یک سریال جنایی جدید پیشنهاد بده'\n"
                    "- 'چند سریال جذاب معرفی کن'\n"
                    "- 'یه سریال شبیه Mindhunter میخوام'\n"
                    "- 'What should I watch tonight?'\n\n"

                    "IMPORTANT: A general recommendation does NOT mean that the "
                    "title exists in JMovie. Do not claim that a recommended title "
                    "is available in JMovie unless you verify it using "
                    "search_local_movies.\n\n"

                    "4. DATABASE INFORMATION:\n"
                    "When describing an item found in JMovie, only mention "
                    "information returned by the database tool.\n"
                    "Do not invent movies, series, IMDb IDs, JMovie IDs, slugs, "
                    "URLs, ratings, years, or other database information.\n\n"

                    "5. NO UNRELATED CONTENT:\n"
                    "Do not add unrelated movies or series unless the user asks "
                    "for recommendations.\n\n"

                    "6. JMOVIE DATABASE SOURCE OF TRUTH:\n"
                    "The JMovie database is the source of truth ONLY for whether "
                    "an item exists in JMovie and for database-specific information.\n"
                    "It is NOT the only source for general movie or TV recommendations.\n\n"

                    "7. MOVIE REQUESTS:\n"
                    "If a movie or TV series is not found in JMovie, do not "
                    "automatically create a request.\n"
                    "Ask the user whether they want to request adding it.\n\n"

                    "8. REQUEST CONFIRMATION:\n"
                    "Only call create_movie_request after the user explicitly "
                    "confirms that they want to request the title.\n\n"

                    "9. REQUEST RESULT:\n"
                    "If create_movie_request succeeds, tell the user that their "
                    "request has been registered.\n\n"

                    "10. LANGUAGE:\n"
                    "Respond in the same language as the user whenever possible. "
                    "If the user speaks Persian, respond in Persian.\n"
                ),
            }
        ]

        messages.extend(history)

        messages.append(
            {
                "role": "user",
                "content": user_message,
            }
        )

        response = self.ai.chat(
            messages=messages,
            tools=TOOLS,
        )

        # --------------------------------------------------
        # 1. Model answered directly
        # --------------------------------------------------

        if not response.tool_calls:
            return response.content

        # --------------------------------------------------
        # 2. Model requested a tool
        # --------------------------------------------------

        messages.append(response)

        for tool_call in response.tool_calls:

            tool_name = tool_call.function.name

            arguments = json.loads(
                tool_call.function.arguments
            )

            if tool_name == "search_local_movies":

                raw_result = search_local_movies(
                    arguments["query"]
                )

                return format_local_search_result(
                    raw_result
                )

            elif tool_name == "create_movie_request":
                result = create_movie_request(
                    title=arguments["title"],
                    media_type=arguments["media_type"],
                    imdb_id=arguments.get("imdb_id"),
                    year=arguments.get("year"),
                )

            else:
                result = {
                    "error": f"Unknown tool: {tool_name}"
                }

            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(
                        result,
                        ensure_ascii=False,
                    ),
                }
            )

        # --------------------------------------------------
        # 3. Send tool result back to the model
        # --------------------------------------------------

        final_response = self.ai.chat(
            messages=messages,
        )

        return final_response.content