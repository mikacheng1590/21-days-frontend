import { createClient } from "@/lib/supabase/server/client"
import { PROJECT_STATUS_ACTIVE, TABLE_PROJECTS, TABLE_ENTRIES, TABLE_ENTRIES_IMAGES, GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION } from "@/lib/supabase/constants"
import { getUser } from "@/lib/supabase/server/auth"
import { ProjectWithLatestEntry, ProjectView } from "@/lib/supabase/types"

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

export const getProjectEntriesByProjectId = async (projectId: number): Promise<ProjectView[] | null> => {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc(GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION, {
    current_project_id: projectId,
    current_user_id: user.id
  })

  return error ? null : data
}