import { createClient } from "@/lib/supabase/server/client"
import { getUser } from "@/lib/supabase/server/auth"
import { ProjectWithLatestEntry, ProjectPublicView, ProjectSummary } from "@/lib/supabase/types"
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

export const getProjectEntriesByProjectId = async (projectId: number, userId: string): Promise<ProjectPublicView | null> => {
  const db = await getDbService()
  return db.getProjectEntriesByProjectId(projectId, userId)
}

export const getActiveProjectById = async (projectId: number): Promise<ProjectSummary | null> => {
  const db = await getDbService()
  return db.getActiveProjectById(projectId)
}