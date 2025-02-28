import { createClient } from "@/lib/supabase/server/client"
import { PROJECT_STATUS_ACTIVE, TABLE_PROJECTS, TABLE_ENTRIES } from "@/lib/supabase/constants"
import { getUser } from "@/lib/supabase/server/auth"
import { ProjectWithLatestEntry, ProjectDisplay } from "@/lib/supabase/types"

export const getActiveProjectLatestEntry = async (projectId: number): Promise<ProjectWithLatestEntry | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE_PROJECTS)
    .select(`id, target_days, ${TABLE_ENTRIES}!left(id, day, created_at)`) // left join
    .eq('user_id', user.id)
    .eq('status', PROJECT_STATUS_ACTIVE)
    .eq('id', projectId)
    .order('day', { ascending: false, referencedTable: TABLE_ENTRIES })
    .single()

  return error ? null : data
}

export const getProjectById = async (projectId: number): Promise<ProjectDisplay | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from(TABLE_PROJECTS)
    .select('title, description, status, target_days, completed_days, allow_skipped_days, status, created_at')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single()

  return error ? null : data
}