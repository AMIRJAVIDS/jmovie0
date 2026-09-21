from openai import OpenAI
from django.conf import settings


class NVIDIAService:

    def __init__(self):
        if not settings.NVIDIA_API_KEY:
            raise ValueError("NVIDIA_API_KEY is not configured.")

        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=settings.NVIDIA_API_KEY,
        )

        self.model = settings.NVIDIA_MODEL

    def chat(self, messages, tools=None):

        kwargs = {
            "model": self.model,
            "messages": messages,
            "temperature": 1.0,
            "top_p": 0.95,
            "max_tokens": 2048,
            "stream": False,

            # Disable Nemotron reasoning/thinking.
            "extra_body": {
                "chat_template_kwargs": {
                    "enable_thinking": False,
                }
            },
        }

        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = "auto"

        response = self.client.chat.completions.create(**kwargs)

        return response.choices[0].message