import { SupabaseClient, User, AuthError } from "@supabase/supabase-js";
import { Response, handleResponse } from "@/lib/supabase/response";
import { TABLE_USERS_SETTING } from "@/lib/supabase/constants";
import { BaseUserData } from "@/lib/supabase/types";

export class BaseUserService<T extends SupabaseClient | Promise<SupabaseClient>> {
  protected supabaseClientFunc: () => T;

  constructor(supabaseClientFunc: () => T) {
    this.supabaseClientFunc = supabaseClientFunc;
  }

  protected getSupabase(): T {
    return this.supabaseClientFunc();
  }

  async getUser(): Promise<Response<User | null, AuthError | null>> {
    const supabase = await this.getSupabase(); // Works for both sync & async clients
    const { data: { user }, error } = await supabase.auth.getUser();

    return handleResponse({
      data: user,
      error,
    });
  }

  async getSlugByUser(): Promise<string | null> {
    const { data: user, success: userSuccess } = await this.getUser()
    if (!userSuccess || !user) {
      return null
    }

    return this.getSlugByUserId(user.id)
  }

  async getSlugByUserId(userId: string): Promise<string | null> {
    const supabase = await this.getSupabase()
    const response = await supabase
      .from(TABLE_USERS_SETTING)
      .select('slug')
      .eq('user_id', userId)
      .single()
    
    return response.data?.slug
  }

  async getUserSettingBySlug(slug: string): Promise<BaseUserData | null> {
    const supabase = await this.getSupabase()
    const response = await supabase
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
