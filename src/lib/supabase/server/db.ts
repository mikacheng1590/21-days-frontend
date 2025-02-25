import { createClient } from "@/lib/supabase/server/client"
import { PROJECT_STATUS_ACTIVE, TABLE_PROJECTS } from "@/lib/supabase/constants"
import { getUser } from "@/lib/supabase/server/auth"

export const isUserHaveProject = async (projectId: number): Promise<boolean> => {
  const user = await getUser()
  if (!user) return false

  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE_PROJECTS)
    .select("id")
    .eq("user_id", user.id)
    .eq("id", projectId)
    .eq("status", PROJECT_STATUS_ACTIVE)
    .single()

  return error ? false : !!data
}