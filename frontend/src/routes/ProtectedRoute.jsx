import { Navigate } from 'react-router-dom'
import { getAccessToken } from '../utils/token'

function ProtectedRoute({ children }) {
  const token = getAccessToken()
  return token ? children : <Navigate to="/login" />
}

export default ProtectedRoute
