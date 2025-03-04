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

export type BaseEntry = {
  project_id: number
  description: string
  day: number
}

export type BaseEntryImage = {
  entry_id: number
  image_url: string
}

export type UserSetting = BaseUserData & BaseModel

export type Project = BaseProject & BaseModel

export type Entry = BaseModel & BaseEntry

export type EntryImage = BaseModel & BaseEntryImage

export type ProjectTable = Pick<Project, 'id' | 'title' | 'completed_days' | 'target_days' | 'status' | 'created_at'>

export type InsertEntryResult = {
  entry_id: number
  updated_completed_days: number
  updated_status: string
}

export type ProjectWithLatestEntry = Pick<Project, 'id' | 'target_days'> & {
  entries: Pick<Entry, 'id' | 'day' | 'created_at'>[]
}

export type ProjectView = Omit<Project, 'id' | 'user_id' | 'updated_at'> & {
  entries: (Pick<Entry, 'id' | 'day' | 'description' | 'created_at'> & {
    images: Pick<EntryImage, 'id' | 'image_url'>[]
  })[]
}