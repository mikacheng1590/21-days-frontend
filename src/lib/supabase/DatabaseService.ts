import { SupabaseClient } from '@supabase/supabase-js'
import { PostgrestError } from "@supabase/supabase-js"
import {
  PROJECT_STATUS_ACTIVE,
  TABLE_PROJECTS,
  TABLE_ENTRIES,
  INSERT_ENTRY_WITH_IMAGES_FUNCTION,
  GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION,
  GET_ACTIVE_PROJECT_LATEST_ENTRY_FUNCTION,
  UPDATE_ENTRY_WITH_IMAGES_FUNCTION
} from "@/lib/supabase/constants"
import {
  ProjectWithLatestEntry,
  ProjectPublicView,
  ProjectSummary,
  InsertEntryResult,
  BaseProject,
  ProjectEditView,
  InsertProjectResult,
  UpdateResponse,
  EntryView
} from "@/lib/supabase/types"
import { BaseAuthService } from './AuthService'

export class DatabaseService {
  private supabase: SupabaseClient
  private authService: BaseAuthService
  
  constructor(supabaseClient: SupabaseClient, authService: BaseAuthService) {
    this.supabase = supabaseClient
    this.authService = authService
  }

  async getActiveProjectLatestEntry(
    projectId: number
  ): Promise<ProjectWithLatestEntry | null> {
    const user = await this.authService.getUser()

    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .select(`id, target_days, ${TABLE_ENTRIES}!left(id, day, created_at)`)
      .eq('user_id', user?.id)
      .eq('status', PROJECT_STATUS_ACTIVE)
      .eq('id', projectId)
      .order('day', { ascending: false, referencedTable: TABLE_ENTRIES })
      .single()

    return error ? null : data
  }

  async getProjectEntriesByProjectId(projectId: number, userId: string): Promise<ProjectPublicView | null> {
    const { data, error } = await this.supabase
    .rpc(GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION, {
      current_project_id: projectId,
      current_user_id: userId
    })

    return error ? null : data
  }

  async getActiveProjectById(
    projectId: number
  ): Promise<ProjectSummary | null> {
    const user = await this.authService.getUser()
    if (!user) return null
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .select('id, title, description, target_days, allow_skipped_days')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .eq('status', PROJECT_STATUS_ACTIVE)
      .single()

    return error ? null : data
  }

  async getEntryById(entryId: number): Promise<EntryView | null> {
    const user = await this.authService.getUser()
    if (!user) return null
    const { data, error } = await this.supabase
      .rpc(GET_ACTIVE_PROJECT_LATEST_ENTRY_FUNCTION, {
        current_entry_id: entryId,
        current_user_id: user.id
      })

    return error ? null : data
  }

  async insertEntryAndUpdateProjectStatus(
    projectId: number,
    entry_description: string,
    image_urls: string[],
    today_day: number
  ): Promise<InsertEntryResult | PostgrestError> {
    const { data, error } = await this.supabase
      .rpc(INSERT_ENTRY_WITH_IMAGES_FUNCTION, {
        project_id: projectId,
        entry_description,
        image_urls,
        today_day
      })

    return error ?? data
  }

  async updateEntry(entryId: number, userId: string, description: string, imageUrls: string[], deletedImageUrls: string[]): Promise<boolean | PostgrestError> {
    const { data, error } = await this.supabase
      .rpc(UPDATE_ENTRY_WITH_IMAGES_FUNCTION, {
        current_entry_id: entryId,
        current_user_id: userId,
        new_description: description,
        image_url_array: imageUrls,
        deleted_image_url_array: deletedImageUrls
      })

    return error ?? data
  }

  async insertProject(project: BaseProject): Promise<InsertProjectResult[] | null> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .insert(project)
      .select('id')

    return error ? null : data
  }

  async updateProject(project: ProjectEditView): Promise<UpdateResponse> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .update(project)
      .eq('id', project.id)
      .eq('user_id', project.user_id)
      .eq('status', PROJECT_STATUS_ACTIVE)

    return error ?? data
  }
} 