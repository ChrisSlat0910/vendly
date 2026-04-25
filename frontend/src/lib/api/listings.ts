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
  browse: async (paramsObj?: { keyword?: string; condition?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams()
    if (paramsObj?.keyword) params.set('keyword', paramsObj.keyword)
    if (paramsObj?.condition) params.set('condition', paramsObj.condition)
    if (paramsObj?.category) params.set('category', paramsObj.category)
    params.set('page', String(paramsObj?.page || 0))
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
