import { AuthError, PostgrestError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server/client"
import { ProjectWithLatestEntry, ProjectPublicView, ProjectSummary, EntryView } from "@/lib/supabase/types"
import { DatabaseService } from "@/lib/supabase/DatabaseService"
import { Response } from "@/lib/supabase/response"
import { serverUserService } from "@/lib/supabase/server/user"

let dbService: DatabaseService | null = null

const getDbService = async () => {
  if (!dbService) {
    const supabase = await createClient()
    dbService = new DatabaseService(supabase, serverUserService)
  }
  return dbService
}

export const getActiveProjectLatestEntry = async (projectId: number): Promise<Response<ProjectWithLatestEntry | null, AuthError | PostgrestError>> => {
  const db = await getDbService()
  return db.getActiveProjectLatestEntry(projectId)
}

export const getProjectEntriesByProjectId = async (projectId: number, userId: string): Promise<Response<ProjectPublicView | null, PostgrestError>> => {
  const db = await getDbService()
  return db.getProjectEntriesByProjectId(projectId, userId)
}

export const getActiveProjectById = async (projectId: number): Promise<Response<ProjectSummary | null, AuthError | PostgrestError>> => {
  const db = await getDbService()
  return db.getActiveProjectById(projectId)
}

export const getEntryById = async (entryId: number): Promise<Response<EntryView | null, AuthError | PostgrestError>> => {
  const db = await getDbService()
  return db.getEntryById(entryId)
}