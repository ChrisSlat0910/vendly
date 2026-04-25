import apiClient, { setAccessToken } from './client'

export interface RegisterRequest {
  username: string
  email: string
  password: string
  displayName: string
}

export interface LoginRequest {
  email: string
  password: string
}

export const authApi = {
  register: async (data: RegisterRequest) => {
    const res = await apiClient.post('/auth/register', data)
    return res.data
  },

  login: async (data: LoginRequest) => {
    const res = await apiClient.post('/auth/login', data, { withCredentials: true })
    setAccessToken(res.data.data.accessToken)
    return res.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout', {}, { withCredentials: true })
    window.location.href = '/'
  },
}
