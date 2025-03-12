import { AuthError, PostgrestError } from "@supabase/supabase-js" 
import { createClient } from "@/lib/supabase/client/client"
import { InsertEntryResult, ProjectWithLatestEntry, BaseProject, ProjectEditView, UpdateResponse, InsertProjectResult } from "@/lib/supabase/types"
import { DatabaseService } from "@/lib/supabase/DatabaseService"
import { Response } from "@/lib/supabase/response"
import { clientUserService } from "@/lib/supabase/client/user"

let dbService: DatabaseService | null = null

const getDbService = async () => {
  if (!dbService) {
    const supabase = await createClient()
    dbService = new DatabaseService(supabase, clientUserService)
  }
  return dbService
}

export const getActiveProjectLatestEntry = async (projectId: number): Promise<Response<ProjectWithLatestEntry | null, AuthError | PostgrestError>> => {
  const db = await getDbService()
  return db.getActiveProjectLatestEntry(projectId)
}

export const insertEntryAndUpdateProjectStatus = async (projectId: number, entry_description: string, image_urls: string[], today_day: number): Promise<Response<InsertEntryResult | PostgrestError, PostgrestError>> => {
  const db = await getDbService()
  return db.insertEntryAndUpdateProjectStatus(projectId, entry_description, image_urls, today_day)
}

export const updateEntry = async (entryId: number, userId: string, description: string, imageUrls: string[], deletedImageUrls: string[]): Promise<Response<boolean | PostgrestError, PostgrestError>> => {
  const db = await getDbService()
  return db.updateEntry(entryId, userId, description, imageUrls, deletedImageUrls)
}

export const insertProject = async (project: BaseProject): Promise<Response<InsertProjectResult[] | null, PostgrestError>> => {
  const db = await getDbService()
  return db.insertProject(project)
}

export const updateProject = async (project: ProjectEditView): Promise<Response<UpdateResponse, PostgrestError>> => {
  const db = await getDbService()
  return db.updateProject(project)
}