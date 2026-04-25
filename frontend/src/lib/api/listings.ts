import apiClient from './client'

export interface CreateListingRequest {
  title: string
  description: string
  price: number
  condition: string
  location: string
  allowCod: boolean
  allowOffers: boolean
}

export const listingsApi = {
  browse: async (keyword?: string, page = 0) => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    params.set('page', String(page))
    params.set('size', '20')
    const res = await apiClient.get(`/listings?${params}`)
    return res.data.data
  },

  getById: async (id: string) => {
    const res = await apiClient.get(`/listings/${id}`)
    return res.data.data
  },

  create: async (data: CreateListingRequest) => {
    const res = await apiClient.post('/listings', data)
    return res.data.data
  },

  update: async (id: string, data: Partial<CreateListingRequest> & { status?: string }) => {
    const res = await apiClient.put(`/listings/${id}`, data)
    return res.data.data
  },

  myListings: async () => {
    const res = await apiClient.get('/listings/my')
    return res.data.data
  },

  delete: async (id: string) => {
    await apiClient.delete(`/listings/${id}`)
  },
}
