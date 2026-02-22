import { api } from './client'
import type { Task, TaskPlan, Season } from '../types/task'

export const tasksApi = {
  getTaskPlan: (homeId: string) =>
    api.get<TaskPlan>(`/homes/${homeId}/tasks`),

  generateTaskPlan: (homeId: string) =>
    api.post<TaskPlan>(`/homes/${homeId}/tasks/generate`, {}),

  updateTaskStatus: (taskId: string, status: Task['status']) =>
    api.put<Task>(`/tasks/${taskId}`, { status }),

  getTasksBySeason: (homeId: string, season: Season) =>
    api.get<Task[]>(`/homes/${homeId}/tasks?season=${season}`),
}
