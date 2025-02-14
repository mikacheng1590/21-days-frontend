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
      variant="outline" 
      onClick={handleLogout}
    >
      Sign Out
    </Button>
  )
} 