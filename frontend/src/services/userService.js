import api from './api'

export const getCurrentUser = async () => {
  const response = await api.get('/api/me/')
  return response.data
}
