import { useHomeProfile } from '../hooks/useHomeProfile'
import { useTaskPlan } from '../hooks/useTasks'

export default function Dashboard() {
  const { data: home, isLoading: homeLoading } = useHomeProfile()
  const { data: plan, isLoading: tasksLoading } = useTaskPlan(home?.id ?? '')

  if (homeLoading) return <div>Loading...</div>
  if (!home) return <div>Please set up your home profile to get started.</div>

  return (
    <main>
      <h1>Your Seasonal Care Plan</h1>
      {tasksLoading ? (
        <p>Loading your tasks...</p>
      ) : (
        <p>{plan?.tasks.length ?? 0} tasks in your plan</p>
      )}
    </main>
  )
}
