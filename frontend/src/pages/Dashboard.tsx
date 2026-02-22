import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useHomeProfile } from '../hooks/useHomeProfile'
import { useTaskPlan, useGenerateTaskPlan } from '../hooks/useTasks'

export default function Dashboard() {
  const { signOut } = useAuth()
  const { data: home, isLoading: homeLoading } = useHomeProfile()
  const { data: plan, isLoading: tasksLoading } = useTaskPlan(home?.id ?? '')
  const generatePlan = useGenerateTaskPlan(home?.id ?? '')

  if (homeLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Seasonal Home Care</h1>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
            {home ? 'Edit profile' : 'Set up home'}
          </Link>
          <button onClick={signOut} className="text-sm text-gray-400 hover:text-gray-600">
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {!home ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🏡</p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome! Let's set up your home.</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Tell us about your home and we'll generate a personalised seasonal maintenance plan.
            </p>
            <Link
              to="/profile"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition"
            >
              Set up your home profile
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Seasonal Plan</h2>
                <p className="text-sm text-gray-500">{home.region} · Built {home.yearBuilt} · {home.homeType.replace('_', ' ')}</p>
              </div>
              <button
                onClick={() => generatePlan.mutate()}
                disabled={generatePlan.isPending}
                className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {generatePlan.isPending ? 'Generating...' : plan?.tasks.length ? 'Regenerate' : 'Generate plan'}
              </button>
            </div>

            {tasksLoading ? (
              <p className="text-gray-400 text-sm">Loading tasks...</p>
            ) : !plan?.tasks.length ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-sm mb-4">No tasks yet. Generate your plan to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(['spring', 'summer', 'fall', 'winter'] as const).map(season => {
                  const tasks = plan.tasks.filter(t => t.season === season)
                  if (!tasks.length) return null
                  return (
                    <div key={season} className="bg-white rounded-2xl shadow-sm p-5">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 capitalize">{season}</h3>
                      <ul className="space-y-2">
                        {tasks.map(task => (
                          <li key={task.id} className="flex items-start gap-3 text-sm">
                            <span className={`mt-0.5 inline-block w-2 h-2 rounded-full shrink-0 ${
                              task.priority === 'high' ? 'bg-red-400' :
                              task.priority === 'medium' ? 'bg-yellow-400' : 'bg-gray-300'
                            }`} />
                            <div>
                              <p className={`font-medium ${task.status === 'complete' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                {task.title}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5">{task.description}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
