import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks'
import type { Season, Task } from '../types/task'

export function useTaskPlan(homeId: string) {
  return useQuery({
    queryKey: ['tasks', homeId],
    queryFn: () => tasksApi.getTaskPlan(homeId),
    enabled: !!homeId,
  })
}

export function useGenerateTaskPlan(homeId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => tasksApi.generateTaskPlan(homeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', homeId] }),
  })
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Task['status'] }) =>
      tasksApi.updateTaskStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })
}

export function useTasksBySeason(homeId: string, season: Season) {
  return useQuery({
    queryKey: ['tasks', homeId, season],
    queryFn: () => tasksApi.getTasksBySeason(homeId, season),
    enabled: !!homeId,
  })
}
