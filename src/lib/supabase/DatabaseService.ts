import { SupabaseClient } from '@supabase/supabase-js'
import { PostgrestError } from "@supabase/supabase-js"
import {
  PROJECT_STATUS_ACTIVE,
  TABLE_PROJECTS,
  TABLE_ENTRIES,
  INSERT_ENTRY_WITH_IMAGES_FUNCTION,
  GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION
} from "@/lib/supabase/constants"
import {
  ProjectWithLatestEntry,
  ProjectPublicView,
  ProjectSummary,
  InsertEntryResult,
  Project,
  BaseProject
} from "@/lib/supabase/types"

export class DatabaseService {
  private supabase: SupabaseClient
  
  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient
  }

  async getActiveProjectLatestEntry(projectId: number, userId: string): Promise<ProjectWithLatestEntry | null> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .select(`id, target_days, ${TABLE_ENTRIES}!left(id, day, created_at)`)
      .eq('user_id', userId)
      .eq('status', PROJECT_STATUS_ACTIVE)
      .eq('id', projectId)
      .order('day', { ascending: false, referencedTable: TABLE_ENTRIES })
      .single()

    return error ? null : data
  }

  async getProjectEntriesByProjectId(projectId: number, userId: string): Promise<ProjectPublicView | null> {
    const { data, error } = await this.supabase.rpc(GET_PROJECT_ENTRIES_BY_PROJECT_ID_FUNCTION, {
      current_project_id: projectId,
      current_user_id: userId
    })

    return error ? null : data
  }

  async getActiveProjectById(projectId: number): Promise<ProjectSummary | null> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .select('id, title, description, target_days, allow_skipped_days')
      .eq('id', projectId)
      .eq('status', PROJECT_STATUS_ACTIVE)
      .single()

    return error ? null : data
  }

  async insertEntryAndUpdateProjectStatus(
    projectId: number,
    entry_description: string,
    image_urls: string[],
    today_day: number
  ): Promise<InsertEntryResult | PostgrestError> {
    const { data, error } = await this.supabase.rpc(INSERT_ENTRY_WITH_IMAGES_FUNCTION, {
      project_id: Number(projectId),
      entry_description,
      image_urls,
      today_day
    })

    return error ?? data
  }

  async insertProject(project: BaseProject): Promise<PostgrestError | null> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .insert([project])

    return error ?? data
  }

  async updateProject(project: Project): Promise<PostgrestError | null> {
    const { data, error } = await this.supabase
      .from(TABLE_PROJECTS)
      .update(project)
      .eq('id', project.id)

    return error ?? data
  }
} 