import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/auth/LogoutButton'

export default async function PrivatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  console.log(user)
  
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Private Page for {user?.email}</h1>
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}