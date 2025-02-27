'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client/client'

export function LogoutButton() {
  const router = useRouter()
  
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button 
      variant="neutral" 
      onClick={handleLogout}
      aria-label="Sign out"
    >
      Sign Out
    </Button>
  )
} 