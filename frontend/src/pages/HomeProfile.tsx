import { useHomeProfile, useCreateHome } from '../hooks/useHomeProfile'

export default function HomeProfile() {
  const { data: home } = useHomeProfile()
  const createHome = useCreateHome()

  return (
    <main>
      <h1>{home ? 'Your Home Profile' : 'Set Up Your Home'}</h1>
      {/* Form implementation goes here */}
      <p>Home profile form coming soon.</p>
    </main>
  )
}
