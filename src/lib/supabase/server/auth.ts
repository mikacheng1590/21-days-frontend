import { createClient } from '@/lib/supabase/server/client'
import { TABLE_USERS_SETTING } from '@/lib/supabase/constants'
import { BaseUserData } from '@/lib/supabase/types'

export const getUser = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return !user ? null : user
}

export const getUsernameByUser = async (): Promise<string | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: userData } = await supabase
    .from(TABLE_USERS_SETTING)
    .select('username')
    .eq('user_id', user.id)
    .single()

  return userData?.username
}

export const getUsernameByUserId = async (userId: string): Promise<string | null> => {
  const supabase = await createClient()
  const { data: userData } = await supabase
    .from(TABLE_USERS_SETTING)
    .select('username')
    .eq('user_id', userId)
    .single() 

  return userData?.username
}

export const getUserSettingByUsername = async (username: string): Promise<BaseUserData | null> => {
  const supabase = await createClient()
  const { data: userData } = await supabase
    .from(TABLE_USERS_SETTING)
    .select('user_id, username, preferred_email')
    .eq('username', username)
    .single()

  return userData
}

export const isPageOwner = async (pageUsername: string): Promise<boolean> => {
  // check if current user is the owner of the page
  const currentUsername = await getUsernameByUser()
  return currentUsername === pageUsername
}