import { createClient } from '@/lib/supabase/client/client'

export const getUser = async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return !user ? null : user
}
