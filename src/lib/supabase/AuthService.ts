import { SupabaseClient, User } from '@supabase/supabase-js'
import { TABLE_USERS_SETTING } from '@/lib/supabase/constants'
import { BaseUserData } from '@/lib/supabase/types'

export abstract class BaseAuthService {
  protected supabase: SupabaseClient

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient
  }

  async getUser(): Promise<User | null> {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    return !user ? null : user
  }

  async getSlugByUser(): Promise<string | null> {
    const user = await this.getUser()
    if (!user) {
      return null
    }

    return this.getSlugByUserId(user.id)
  }

  async getSlugByUserId(userId: string): Promise<string | null> {
    const response = await this.supabase
      .from(TABLE_USERS_SETTING)
      .select('slug')
      .eq('user_id', userId)
      .single()
    
    return response.data?.slug
  }

  async getUserSettingBySlug(slug: string): Promise<BaseUserData | null> {
    const response = await this.supabase
      .from(TABLE_USERS_SETTING)
      .select('user_id, username, preferred_email, slug')
      .eq('slug', slug)
      .single()
    
    return response.data
  }

  async isPageOwner(pageSlug: string): Promise<boolean> {
    const currentSlug = await this.getSlugByUser()
    return currentSlug === pageSlug
  }
} 