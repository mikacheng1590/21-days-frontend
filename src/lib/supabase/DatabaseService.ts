import { SupabaseClient, PostgrestError, AuthError } from '@supabase/supabase-js'
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
import { BaseUserService } from "@/lib/supabase/UserService"
import { handleResponse, Response } from "@/lib/supabase/response"

export class DatabaseService {
  private supabase: SupabaseClient
  protected userService: BaseUserService<SupabaseClient | Promise<SupabaseClient>>;

  constructor(
    supabaseClient: SupabaseClient,
    userService: BaseUserService<SupabaseClient | Promise<SupabaseClient>>
  ) {
    this.supabase = supabaseClient
    this.userService = userService
  }

  async getActiveProjectLatestEntry(
    projectId: number
  ): Promise<Response<ProjectWithLatestEntry | null, AuthError | PostgrestError>> {
    const { data: user, error: userError } = await this.userService.getUser()
    if (userError || !user) {
      return handleResponse({
        data: null,
        error: userError
      })
    }

    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .select(`id, target_days, ${TABLE_ENTRIES}!left(id, day, created_at)`)
      .eq('user_id', user?.id)
      .eq('status', PROJECT_STATUS_ACTIVE)
      .eq('id', projectId)
      .order('day', { ascending: false, referencedTable: TABLE_ENTRIES })
      .single()

    return handleResponse({
      data,
      error
    })
  }

  async getProjectEntriesByProjectId(projectId: number, userId: string): Promise<Response<ProjectPublicView | null, PostgrestError>> {
    const { data, error } = await this.supabase
    .rpc(GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION, {
      current_project_id: projectId,
      current_user_id: userId
    })

    return handleResponse({
      data,
      error
    })
  }

  async getActiveProjectById(
    projectId: number
  ): Promise<Response<ProjectSummary | null, AuthError | PostgrestError>> {
    const { data: user, error: userError } = await this.userService.getUser()
    if (userError || !user) {
      return handleResponse({
        data: null,
        error: userError
      })
    }
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .select('id, title, description, target_days, allow_skipped_days')
      .eq('id', projectId)
      .eq('user_id', user.id)
      .eq('status', PROJECT_STATUS_ACTIVE)
      .single()

    return handleResponse({
      data,
      error
    })
  }

  async getEntryById(
    entryId: number
  ): Promise<Response<EntryView | null, AuthError | PostgrestError>> {
    const { data: user, error: userError } = await this.userService.getUser()
    if (userError || !user) {
      return handleResponse({
        data: null,
        error: userError
      })
    }
    const { data, error } = await this.supabase
      .rpc(GET_ACTIVE_PROJECT_LATEST_ENTRY_FUNCTION, {
        current_entry_id: entryId,
        current_user_id: user.id
      })

    return handleResponse({
      data,
      error
    })
  }

  async insertEntryAndUpdateProjectStatus(
    projectId: number,
    entry_description: string,
    image_urls: string[],
    today_day: number
  ): Promise<Response<InsertEntryResult | PostgrestError, PostgrestError>> {
    const { data, error } = await this.supabase
      .rpc(INSERT_ENTRY_WITH_IMAGES_FUNCTION, {
        project_id: projectId,
        entry_description,
        image_urls,
        today_day
      })

    return handleResponse({
      data,
      error
    })
  }

  async updateEntry(entryId: number, userId: string, description: string, imageUrls: string[], deletedImageUrls: string[]): Promise<Response<boolean | PostgrestError, PostgrestError>> {
    const { data, error } = await this.supabase
      .rpc(UPDATE_ENTRY_WITH_IMAGES_FUNCTION, {
        current_entry_id: entryId,
        current_user_id: userId,
        new_description: description,
        image_url_array: imageUrls,
        deleted_image_url_array: deletedImageUrls
      })

    return handleResponse({
      data,
      error
    })
  }

  async insertProject(project: BaseProject): Promise<Response<InsertProjectResult[] | null, PostgrestError>> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .insert(project)
      .select('id')

    return handleResponse({
      data,
      error
    })
  }

  async updateProject(project: ProjectEditView): Promise<Response<UpdateResponse, PostgrestError>> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .update(project)
      .eq('id', project.id)
      .eq('user_id', project.user_id)
      .eq('status', PROJECT_STATUS_ACTIVE)

    return handleResponse({
      data,
      error
    })
  }
} 