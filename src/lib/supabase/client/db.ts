import { SupabaseClient } from "@supabase/supabase-js" 
import { createClient } from "@/lib/supabase/client/client"
import { BaseDatabaseService } from "@/lib/supabase/DatabaseService"
import { clientUserService } from "@/lib/supabase/client/user"

export class ClientDbService extends BaseDatabaseService<SupabaseClient> {
  constructor() {
    super(() => createClient(), clientUserService)
  }
}

export const clientDbService = new ClientDbService()