import { api } from './client'
import type { HomeProfile, HomeProfileFormData } from '../types/home'

export const homesApi = {
  getMyHome: () => api.get<HomeProfile>('/homes/me'),

  createHome: (data: HomeProfileFormData) =>
    api.post<HomeProfile>('/homes', data),

  updateHome: (id: string, data: HomeProfileFormData) =>
    api.put<HomeProfile>(`/homes/${id}`, data),
}
