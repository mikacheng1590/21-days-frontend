import { SupabaseClient } from "@supabase/supabase-js";
import { BaseUserService } from "@/lib/supabase/UserService";
import { createClient } from "@/lib/supabase/server/client";

export class ServerUserService extends BaseUserService<Promise<SupabaseClient>> {
  constructor() {
    super(async () =>
      createClient()
    );
  }
}

export const serverUserService = new ServerUserService();

