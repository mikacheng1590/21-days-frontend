import { createClient } from '@/lib/supabase/server'
import { AuthForm } from '@/components/auth/AuthForm'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect(`/private`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to 21 Days</h1>
      <AuthForm />
    </main>
  )
}
