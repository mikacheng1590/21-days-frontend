import { SupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server/client"
import { BaseDatabaseService } from "@/lib/supabase/DatabaseService"
import { serverUserService } from "@/lib/supabase/server/user"

export class ServerDbService extends BaseDatabaseService<Promise<SupabaseClient>> {
  constructor() {
    super(async () => createClient(), serverUserService)
  }
}

export const serverDbService = new ServerDbService()