import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { homesApi } from '../api/homes'
import type { HomeProfileFormData } from '../types/home'

export function useHomeProfile() {
  return useQuery({
    queryKey: ['home', 'me'],
    queryFn: () => homesApi.getMyHome(),
  })
}

export function useCreateHome() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: HomeProfileFormData) => homesApi.createHome(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['home'] }),
  })
}

export function useUpdateHome(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: HomeProfileFormData) => homesApi.updateHome(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['home'] }),
  })
}
