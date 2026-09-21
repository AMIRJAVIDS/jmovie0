import api from './api'

export const sendAIMessage = async ({
  message,
  conversationId = null,
  sessionId = null,
}) => {
  const payload = {
    message,
  }

  if (conversationId) {
    payload.conversation_id = conversationId
  }

  if (sessionId) {
    payload.session_id = sessionId
  }

  const response = await api.post('/ai/chat/', payload)

  return response.data
}