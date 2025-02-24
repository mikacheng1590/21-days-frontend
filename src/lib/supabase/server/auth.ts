import { createClient } from '@/lib/supabase/server/client'
import { TABLE_USERS_SETTING } from '@/lib/supabase/constants'

export async function getUsernameByUser(): Promise<string | null> {
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

export async function getUsernameByUserId(userId: string): Promise<string | null> {
  const supabase = await createClient()
  const { data: userData } = await supabase
    .from(TABLE_USERS_SETTING)
    .select('username')
    .eq('user_id', userId)
    .single() 

  return userData?.username
}

export async function getUserSettingByUsername(username: string): Promise<UserSetting | null> {
  const supabase = await createClient()
  const { data: userData } = await supabase
    .from(TABLE_USERS_SETTING)
    .select('user_id, username, preferred_email')
    .eq('username', username)
    .single()

  return userData
}

export async function isPageOwner(pageUsername: string): Promise<boolean> {
  // check if current user is the owner of the page
  const currentUsername = await getUsernameByUser()
  return currentUsername === pageUsername
}