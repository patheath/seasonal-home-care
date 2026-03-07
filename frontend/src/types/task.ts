export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export type TaskCategory = 'home' | 'landscape' | 'inspect'

export type TaskPriority = 'high' | 'medium' | 'low'

export type TaskStatus = 'pending' | 'complete' | 'snoozed'

export interface Task {
  id: string
  homeId: string
  season: Season
  category: TaskCategory
  priority: TaskPriority
  status: TaskStatus
  title: string
  description: string
  estimatedEffort?: string
  isCustom: boolean
  createdAt: string
  completedAt?: string
}

export interface TaskPlan {
  homeId: string
  generatedAt: string
  tasks: Task[]
}
