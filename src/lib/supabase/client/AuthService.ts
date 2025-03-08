import { BaseAuthService } from '../AuthService'
import { createClient } from './client'
import { SupabaseClient } from '@supabase/supabase-js'

export class ClientAuthService extends BaseAuthService {
  private static instance: ClientAuthService | null = null
  private static initializationPromise: Promise<ClientAuthService> | null = null

  private constructor(client: SupabaseClient) {
    super(client)
  }

  static async getInstance(): Promise<ClientAuthService> {
    if (!this.initializationPromise) {
      this.initializationPromise = (async () => {
        if (!this.instance) {
          const client = await createClient()
          this.instance = new ClientAuthService(client)
        }
        return this.instance!
      })()
    }
    return this.initializationPromise
  }

  // Add any client-specific auth methods here
  async signOut() {
    return this.supabase.auth.signOut()
  }
} 