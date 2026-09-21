from uuid import uuid4

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import AIConversation, AIMessage
from .services.agent import JMovieAgent


class AIChatView(APIView):

    def post(self, request):

        message = request.data.get("message", "").strip()
        conversation_id = request.data.get("conversation_id")
        session_id = request.data.get("session_id")

        if not message:
            return Response(
                {
                    "detail": "Message is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # --------------------------------
            # Determine authentication state
            # --------------------------------

            is_authenticated = (
                request.user
                and request.user.is_authenticated
            )

            # --------------------------------
            # Existing conversation
            # --------------------------------

            if conversation_id:

                try:
                    conversation = AIConversation.objects.get(
                        id=conversation_id
                    )
                except AIConversation.DoesNotExist:
                    return Response(
                        {
                            "detail": "Conversation not found."
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )

                # ----------------------------
                # Check ownership
                # ----------------------------

                if is_authenticated:

                    if conversation.user_id != request.user.id:
                        return Response(
                            {
                                "detail": (
                                    "You do not have access "
                                    "to this conversation."
                                )
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )

                else:

                    if (
                        not session_id
                        or conversation.session_id != session_id
                    ):
                        return Response(
                            {
                                "detail": (
                                    "You do not have access "
                                    "to this conversation."
                                )
                            },
                            status=status.HTTP_403_FORBIDDEN,
                        )

            # --------------------------------
            # New conversation
            # --------------------------------

            else:

                if is_authenticated:

                    conversation = AIConversation.objects.create(
                        user=request.user,
                    )

                else:

                    session_id = session_id or str(uuid4())

                    conversation = AIConversation.objects.create(
                        session_id=session_id,
                    )

            # --------------------------------
            # Load conversation history
            # --------------------------------

            history_messages = conversation.messages.filter(
                role__in=["user", "assistant"]
            ).order_by("created_at")

            history = [
                {
                    "role": msg.role,
                    "content": msg.content,
                }
                for msg in history_messages
            ]

            # --------------------------------
            # Save user message
            # --------------------------------

            AIMessage.objects.create(
                conversation=conversation,
                role="user",
                content=message,
            )

            # --------------------------------
            # Run AI Agent
            # --------------------------------

            agent = JMovieAgent()

            result = agent.run(
                user_message=message,
                history=history,
            )

            # --------------------------------
            # Normalize agent result
            # --------------------------------

            if isinstance(result, str):

                response_data = {
                    "type": "text",
                    "message": result,
                    "items": [],
                    "request": None,
                }

            else:

                response_data = {
                    "type": result.get("type", "text"),
                    "message": result.get("message", ""),
                    "items": result.get("items", []),
                    "request": result.get("request"),
                }

            # --------------------------------
            # Save assistant message
            # --------------------------------

            AIMessage.objects.create(
                conversation=conversation,
                role="assistant",
                content=response_data["message"],
            )

            # --------------------------------
            # Response
            # --------------------------------

            return Response(
                {
                    "conversation_id": conversation.id,
                    "session_id": conversation.session_id,
                    **response_data,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as exc:
            return Response(
                {
                    "detail": "AI service is currently unavailable.",
                    "error": str(exc),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
