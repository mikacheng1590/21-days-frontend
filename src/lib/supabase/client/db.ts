import { PostgrestError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client/client"
import { PROJECT_STATUS_ACTIVE, TABLE_PROJECTS, TABLE_ENTRIES, INSERT_ENTRY_WITH_IMAGES_FUNCTION } from "@/lib/supabase/constants"
import { getUser } from "@/lib/supabase/client/auth"
import { InsertEntryAndUpdateProjectStatusData, ProjectWithLatestEntry } from "@/lib/supabase/types"

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

export const insertEntryAndUpdateProjectStatus = async (projectId: number, entry_description: string, image_urls: string[], today_day: number): Promise<InsertEntryAndUpdateProjectStatusData | PostgrestError> => {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc(INSERT_ENTRY_WITH_IMAGES_FUNCTION, {
    project_id: Number(projectId),
    entry_description,
    image_urls,
    today_day
  })

  return error ?? data
}
