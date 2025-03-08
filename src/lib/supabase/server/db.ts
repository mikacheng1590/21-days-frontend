import { createClient } from "@/lib/supabase/server/client"
import { ProjectWithLatestEntry, ProjectPublicView, ProjectSummary, EntryView } from "@/lib/supabase/types"
import { DatabaseService } from "@/lib/supabase/DatabaseService"
import { ServerAuthService } from "@/lib/supabase/server/AuthService"
let dbService: DatabaseService | null = null

const getDbService = async () => {
  if (!dbService) {
    const supabase = await createClient()
    const authService = await ServerAuthService.getInstance()
    dbService = new DatabaseService(supabase, authService)
  }
  return dbService
}

export const getActiveProjectLatestEntry = async (projectId: number): Promise<ProjectWithLatestEntry | null> => {
  const db = await getDbService()
  return db.getActiveProjectLatestEntry(projectId)
}

export const getProjectEntriesByProjectId = async (projectId: number, userId: string): Promise<ProjectPublicView | null> => {
  const db = await getDbService()
  return db.getProjectEntriesByProjectId(projectId, userId)
}

export const getActiveProjectById = async (projectId: number, userId: string): Promise<ProjectSummary | null> => {
  const db = await getDbService()
  return db.getActiveProjectById(projectId, userId)
}

export const getEntryById = async (entryId: number, userId: string): Promise<EntryView | null> => {
  const db = await getDbService()
  return db.getEntryById(entryId, userId)
}