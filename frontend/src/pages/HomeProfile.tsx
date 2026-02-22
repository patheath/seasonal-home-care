import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHomeProfile, useCreateHome, useUpdateHome } from '../hooks/useHomeProfile'
import type { HomeFeature, HomeProfileFormData } from '../types/home'

const HOME_TYPES = [
  { value: 'single_family', label: 'Single Family' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
] as const

const FEATURES: { value: HomeFeature; label: string }[] = [
  { value: 'pool', label: 'Pool' },
  { value: 'hot_tub', label: 'Hot Tub' },
  { value: 'fireplace', label: 'Fireplace / Chimney' },
  { value: 'deck', label: 'Deck / Patio' },
  { value: 'basement', label: 'Basement' },
  { value: 'crawl_space', label: 'Crawl Space' },
  { value: 'septic', label: 'Septic System' },
  { value: 'well_water', label: 'Well Water' },
  { value: 'irrigation', label: 'Irrigation System' },
  { value: 'solar_panels', label: 'Solar Panels' },
]

const US_REGIONS = [
  'Northeast', 'Mid-Atlantic', 'Southeast', 'Midwest',
  'South', 'Southwest', 'Mountain West', 'Pacific Northwest', 'California',
]

export default function HomeProfile() {
  const navigate = useNavigate()
  const { data: home } = useHomeProfile()
  const createHome = useCreateHome()
  const updateHome = useUpdateHome(home?.id ?? '')

  const [formData, setFormData] = useState<HomeProfileFormData>({
    homeType: home?.homeType ?? 'single_family',
    yearBuilt: home?.yearBuilt ?? new Date().getFullYear() - 20,
    region: home?.region ?? '',
    squareFootage: home?.squareFootage,
    features: home?.features ?? [],
  })
  const [error, setError] = useState('')

  function toggleFeature(feature: HomeFeature) {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      if (home) {
        await updateHome.mutateAsync(formData)
      } else {
        await createHome.mutateAsync(formData)
      }
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const isPending = createHome.isPending || updateHome.isPending

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {home ? 'Update your home profile' : 'Set up your home profile'}
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          This helps us generate a maintenance plan tailored to your specific home.
        </p>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow p-6">

          {/* Home Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Home type</label>
            <div className="grid grid-cols-3 gap-2">
              {HOME_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, homeType: type.value }))}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                    formData.homeType === type.value
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year Built */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year built</label>
            <input
              type="number"
              required
              min={1800}
              max={new Date().getFullYear()}
              value={formData.yearBuilt}
              onChange={e => setFormData(prev => ({ ...prev, yearBuilt: parseInt(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              required
              value={formData.region}
              onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select your region</option>
              {US_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Square Footage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Square footage <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="number"
              min={100}
              value={formData.squareFootage ?? ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                squareFootage: e.target.value ? parseInt(e.target.value) : undefined,
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. 2000"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special features <span className="text-gray-400 font-normal">(select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map(f => (
                <label
                  key={f.value}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition ${
                    formData.features.includes(f.value)
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-green-600"
                    checked={formData.features.includes(f.value)}
                    onChange={() => toggleFeature(f.value)}
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:opacity-50"
          >
            {isPending ? 'Saving...' : home ? 'Save changes' : 'Save & generate my plan'}
          </button>
        </form>
      </div>
    </div>
  )
}
