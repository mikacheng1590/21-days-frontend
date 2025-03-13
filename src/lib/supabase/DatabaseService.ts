import { SupabaseClient, PostgrestError, AuthError } from '@supabase/supabase-js'
import {
  PROJECT_STATUS_ACTIVE,
  TABLE_PROJECTS,
  TABLE_ENTRIES,
  INSERT_ENTRY_WITH_IMAGES_FUNCTION,
  GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION,
  GET_ACTIVE_PROJECT_LATEST_ENTRY_FUNCTION,
  UPDATE_ENTRY_WITH_IMAGES_FUNCTION,
  PROJECT_STATUS_DELETED
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

export class BaseDatabaseService<T extends SupabaseClient | Promise<SupabaseClient>> {
  protected supabaseClientFunc: () => T;
  protected userService: BaseUserService<SupabaseClient | Promise<SupabaseClient>>;

  constructor(
    supabaseClientFunc: () => T,
    userService: BaseUserService<SupabaseClient | Promise<SupabaseClient>>
  ) {
    this.supabaseClientFunc = supabaseClientFunc
    this.userService = userService
  }

  protected async getSupabase(): Promise<T> {
    return await this.supabaseClientFunc();
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

    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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

    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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

    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from(TABLE_PROJECTS)
      .insert(project)
      .select('id')

    return handleResponse({
      data,
      error
    })
  }

  async updateProject(project: ProjectEditView): Promise<Response<UpdateResponse, PostgrestError>> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
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

  async updateProjectStatus(projectIds: number[], status: string = PROJECT_STATUS_DELETED): Promise<Response<UpdateResponse, PostgrestError | AuthError>> {
    const { data: user, error: userError } = await this.userService.getUser()
    if (userError || !user) {
      return handleResponse({
        data: null,
        error: userError
      })
    }
    
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from(TABLE_PROJECTS)
      .update({ status })
      .in('id', projectIds)
      .eq('user_id', user.id)

    return handleResponse({
      data,
      error
    })
  }
} 