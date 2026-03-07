import logo from '../assets/seasonal-app-logo.svg'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useHomeProfile } from '../hooks/useHomeProfile'
import { useTaskPlan, useGenerateTaskPlan } from '../hooks/useTasks'
import { useEffect, useState } from 'react'
import type { Season, TaskCategory } from '../types/task'

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  home:      '🏠 Home',
  landscape: '🌿 Landscape',
  inspect:   '🔍 Inspect & Test',
}

const SEASON_LABELS: Record<Season, string> = {
  spring: '🌱 Spring',
  summer: '☀️ Summer',
  fall:   '🍂 Fall',
  winter: '❄️ Winter',
}

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'fall'
  return 'winter'
}

const GENERATING_MESSAGES = [
  "A well-maintained home is a happy home.",
  "Small tasks today prevent big repairs tomorrow.",
  "Your home is your biggest investment — protect it.",
  "Regular maintenance can save thousands in repair costs.",
  "A stitch in time saves nine.",
  "The best time to fix a roof is when the sun is shining.",
  "Home maintenance is self-care for your house.",
  "An ounce of prevention is worth a pound of cure.",
  "Great homes aren't built — they're maintained.",
  "Every season is a chance to get ahead of problems.",
]

function GeneratingOverlay() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % GENERATING_MESSAGES.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center py-16">
      <div className="flex justify-center mb-6">
        <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
      <p className="text-sm font-medium text-gray-500 mb-2">Building your seasonal plan...</p>
      <p
        className="text-base text-gray-700 italic max-w-sm mx-auto transition-opacity duration-400"
        style={{ opacity: visible ? 1 : 0 }}
      >
        "{GENERATING_MESSAGES[index]}"
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { signOut } = useAuth()
  const { data: home, isLoading: homeLoading } = useHomeProfile()
  const [season, setSeason] = useState<Season>(getCurrentSeason)
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
        <img src={logo} alt="Seasonal Home Care" className="h-8" />
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
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Seasonal Plan</h2>
                  <p className="text-sm text-gray-500">{home.region} · Built {home.yearBuilt} · {home.homeType.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={() => generatePlan.mutate(season)}
                  disabled={generatePlan.isPending}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {plan?.tasks.filter(t => t.season === season).length ? 'Regenerate' : 'Generate plan'}
                </button>
              </div>
              <div className="flex gap-2">
                {(['spring', 'summer', 'fall', 'winter'] as Season[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSeason(s)}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition ${
                      season === s
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
                    }`}
                  >
                    {SEASON_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>

            {generatePlan.isPending ? (
              <GeneratingOverlay />
            ) : tasksLoading ? (
              <p className="text-gray-400 text-sm">Loading tasks...</p>
            ) : (() => {
              const seasonTasks = plan?.tasks.filter(t => t.season === season) ?? []
              if (!seasonTasks.length) return (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500 text-sm mb-4">No tasks for {SEASON_LABELS[season]} yet.</p>
                  <button
                    onClick={() => generatePlan.mutate(season)}
                    className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition"
                  >
                    Generate {SEASON_LABELS[season]} plan
                  </button>
                </div>
              )
              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 px-1 pb-1">
                    <span className="text-xs text-gray-400 font-medium">Priority:</span>
                    {([['bg-red-400', 'High'], ['bg-yellow-400', 'Medium'], ['bg-gray-300', 'Low']] as const).map(([color, label]) => (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                  {(['home', 'landscape', 'inspect'] as TaskCategory[]).map(category => {
                    const tasks = seasonTasks.filter(t => t.category === category)
                    if (!tasks.length) return null
                    return (
                      <div key={category} className="bg-white rounded-2xl shadow-sm p-5">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          {CATEGORY_LABELS[category]}
                        </h3>
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
              )
            })()}
          </div>
        )}
      </main>
    </div>
  )
}
