import { BaseAuthService } from '../AuthService'
import { createClient } from './client'
import { SupabaseClient } from '@supabase/supabase-js'

export class ServerAuthService extends BaseAuthService {
  private static instance: ServerAuthService | null = null
  private static initializationPromise: Promise<ServerAuthService> | null = null

  private constructor(client: SupabaseClient) {
    super(client)
  }

  static async getInstance(): Promise<ServerAuthService> {
    if (!this.initializationPromise) {
      this.initializationPromise = (async () => {
        if (!this.instance) {
          const client = await createClient()
          this.instance = new ServerAuthService(client)
        }
        return this.instance!
      })()
    }
    return this.initializationPromise
  }

  // Add any server-specific auth methods here
} 