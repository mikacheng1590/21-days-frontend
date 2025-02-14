import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth/AuthForm'
import { getUsername } from '@/lib/supabase/server/auth'

export default async function Home() {
  const username = await getUsername()
  if (username) {
    redirect(`/${username}/projects`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to 21 Days</h1>
      <AuthForm />
    </main>
  )
}
