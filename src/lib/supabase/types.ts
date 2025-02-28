type BaseModel = {
  id: number
  created_at: string
  updated_at: string
}

export type BaseUserData = {
  user_id: string
  username: string
  preferred_email: string
}

export type BaseProject = {
  user_id: string
  title: string
  description: string
  completed_days: number
  target_days: number
  allow_skipped_days: number
  status: string
}

export type UserSetting = BaseUserData & BaseModel

export type Project = BaseProject & BaseModel

export type Entry = BaseModel & {
  project_id: number
  description: string
  day: number
}

export type ProjectTable = Pick<Project, 'id' | 'title' | 'completed_days' | 'target_days' | 'status' | 'created_at'>

export type InsertEntryResult = {
  entry_id: number
  updated_completed_days: number
  updated_status: string
}

export type ProjectWithLatestEntry = Pick<Project, 'id' | 'target_days'> & {
  entries: Pick<Entry, 'id' | 'day' | 'created_at'>[]
}

export type ProjectDisplay = Omit<Project, 'id' | 'user_id' | 'updated_at'>