import { SupabaseClient, User, AuthError, PostgrestError } from "@supabase/supabase-js";
import { Response, handleResponse } from "@/lib/supabase/response";
import { TABLE_USERS_SETTING } from "@/lib/supabase/constants";
import { BaseUserData } from "@/lib/supabase/types";

export class BaseUserService<T extends SupabaseClient | Promise<SupabaseClient>> {
  protected supabaseClientFunc: () => T;

  constructor(supabaseClientFunc: () => T) {
    this.supabaseClientFunc = supabaseClientFunc;
  }

  protected async getSupabase(): Promise<T> {
    return await this.supabaseClientFunc();
  }

  async getUser(): Promise<Response<User | null, AuthError | null>> {
    const supabase = await this.getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();

    return handleResponse({
      data: user,
      error,
    });
  }

  async getSlugByUser(): Promise<Response<User | string | null, AuthError | PostgrestError | null>> {
    const res = await this.getUser()
    const { data: user, success: userSuccess } = res
    if (!userSuccess || !user) {
      return res
    }

    return this.getSlugByUserId(user.id)
  }

  async getSlugByUserId(userId: string): Promise<Response<string | null, PostgrestError | null>> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from(TABLE_USERS_SETTING)
      .select('slug')
      .eq('user_id', userId)
      .single()
    
    return handleResponse({
      data: data?.slug,
      error,
    })
  }

  async getUserSetting(): Promise<Response<User | BaseUserData | null, AuthError |  PostgrestError | null>> {
    const res = await this.getUser()
    const { data: user, success: userSuccess } = res
    if (!userSuccess || !user) {
      return res
    }

    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from(TABLE_USERS_SETTING)
      .select('user_id, username, preferred_email, slug')
      .eq('user_id', user.id)
      .single()

    return handleResponse({
      data,
      error,
    })
  }

  async getUserSettingBySlug(slug: string): Promise<Response<BaseUserData | null, PostgrestError | null>> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from(TABLE_USERS_SETTING)
      .select('user_id, username, preferred_email, slug')
      .eq('slug', slug)
      .single()
    
    return handleResponse({
      data,
      error,
    })
  }

  async insertUserSetting(
    userId: string,
    preferredEmail: string,
    username: string,
    slug: string
  ): Promise<Response<null, PostgrestError>> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from(TABLE_USERS_SETTING)
      .insert([
        {
          user_id: userId,
          preferred_email: preferredEmail,
          username,
          slug
        }
      ])
      
    return handleResponse({
      data,
      error,
    })
  }   

  async updateUserSetting(
    userId: string,
    preferredEmail: string,
    username: string,
  ): Promise<Response<null, PostgrestError>> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from(TABLE_USERS_SETTING)
      .update({
        preferred_email: preferredEmail,
        username,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      
    return handleResponse({
      data,
      error,
    })
  }

  async isPageOwner(pageSlug: string): Promise<boolean> {
    const currentSlug = await this.getSlugByUser()
    const { data: currentSlugData, success: currentSlugSuccess } = currentSlug
    if (!currentSlugSuccess || !currentSlugData) {
      return false
    }

    return currentSlugData === pageSlug
  }
}
