'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { clientUserService } from '@/lib/supabase/client/user'

export function LogoutButton() {
  const router = useRouter()
  
  const handleLogout = async () => {
    await clientUserService.signOut()
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