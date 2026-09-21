import api from './api'

export const login = async (username, password) => {
  const response = await api.post('/api/token/', {
    username,
    password,
  })
  return response.data
}

export const register = async (formData) => {
  const response = await api.post(
    '/accounts/register/',
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  return response.data
}
