import axios from 'axios'

let accessToken: string | null = null

export const setAccessToken = (t: string) => {
  accessToken = t
}
export const getAccessToken = () => accessToken
export const clearTokens = () => {
  accessToken = null
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
