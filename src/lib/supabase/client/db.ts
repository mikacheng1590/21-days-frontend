import { PostgrestError } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client/client"
import { InsertEntryResult, ProjectWithLatestEntry, BaseProject, ProjectEditView, UpdateResponse, InsertProjectResult } from "@/lib/supabase/types"
import { DatabaseService } from "@/lib/supabase/DatabaseService"
import { ClientAuthService } from '../client/AuthService'

let dbService: DatabaseService | null = null

const getDbService = async () => {
  if (!dbService) {
    const supabase = await createClient()
    const authService = await ClientAuthService.getInstance()
    dbService = new DatabaseService(supabase, authService)
  }
  return dbService
}

export const getActiveProjectLatestEntry = async (projectId: number): Promise<ProjectWithLatestEntry | null> => {
  const db = await getDbService()
  return db.getActiveProjectLatestEntry(projectId)
}

export const insertEntryAndUpdateProjectStatus = async (projectId: number, entry_description: string, image_urls: string[], today_day: number): Promise<InsertEntryResult | PostgrestError> => {
  const db = await getDbService()
  return db.insertEntryAndUpdateProjectStatus(projectId, entry_description, image_urls, today_day)
}

export const updateEntry = async (entryId: number, userId: string, description: string, imageUrls: string[], deletedImageUrls: string[]) => {
  const db = await getDbService()
  return db.updateEntry(entryId, userId, description, imageUrls, deletedImageUrls)
}

export const insertProject = async (project: BaseProject): Promise<InsertProjectResult[] | null> => {
  const db = await getDbService()
  return db.insertProject(project)
}

export const updateProject = async (project: ProjectEditView): Promise<UpdateResponse> => {
  const db = await getDbService()
  return db.updateProject(project)
}