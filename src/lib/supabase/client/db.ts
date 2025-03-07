import { PostgrestError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client/client"
import { getUser } from "@/lib/supabase/client/auth"
import { InsertEntryResult, ProjectWithLatestEntry, BaseProject, Project } from "@/lib/supabase/types"
import { DatabaseService } from "@/lib/supabase/DatabaseService"

let dbService: DatabaseService | null = null

const getDbService = async () => {
  if (!dbService) {
    const supabase = await createClient()
    dbService = new DatabaseService(supabase)
  }
  return dbService
}

export const getActiveProjectLatestEntry = async (projectId: number): Promise<ProjectWithLatestEntry | null> => {
  const user = await getUser()
  if (!user) return null
  
  const db = await getDbService()
  return db.getActiveProjectLatestEntry(projectId, user.id)
}

export const insertEntryAndUpdateProjectStatus = async (projectId: number, entry_description: string, image_urls: string[], today_day: number): Promise<InsertEntryResult | PostgrestError> => {
  const db = await getDbService()
  return db.insertEntryAndUpdateProjectStatus(projectId, entry_description, image_urls, today_day)
}

export const insertProject = async (project: BaseProject): Promise<PostgrestError | null> => {
  const db = await getDbService()
  return db.insertProject(project)
}

export const updateProject = async (project: Project): Promise<PostgrestError | null> => {
  const db = await getDbService()
  return db.updateProject(project)
}