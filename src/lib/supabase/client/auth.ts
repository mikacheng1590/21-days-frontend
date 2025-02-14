import { createClient } from '@/lib/supabase/client/client'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return !user ? null : user
}
