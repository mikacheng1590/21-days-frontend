import { createClient } from '@/lib/supabase/server/client'
import { TABLE_USERS_SETTING } from '@/lib/supabase/constants'

export async function getUsername() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData } = await supabase
    .from(TABLE_USERS_SETTING)
    .select('username')
    .eq('user_id', user.id)
    .single()

  return userData?.username
}

export async function isPageOwner(pageUsername: string) {
  const username = await getUsername()
    
  return username === pageUsername
}