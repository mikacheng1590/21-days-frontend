import { SupabaseClient } from "@supabase/supabase-js";
import { BaseUserService } from "@/lib/supabase/UserService";
import { createClient } from "@/lib/supabase/client/client";

export class ClientUserService extends BaseUserService<SupabaseClient> {
  constructor() {
    super(() =>
      createClient()
    );
  }

  async signOut() {
    const supabase = await this.getSupabase()
    return supabase.auth.signOut()
  }
}

export const clientUserService = new ClientUserService();
