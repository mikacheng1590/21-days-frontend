export type UserSetting = {
  user_id: string
  username: string
  preferred_email: string
}

export type Project = {
  id: number
  title: string
  completed_days: number
  target_days: number
  status: string
  created_at: string
}

export type Entry = {
  id: number
  project_id: number
  description: string
  day: number
  created_at: string
  updated_at: string
}

export type InsertEntryAndUpdateProjectStatusData = {
  entry_id: number
  updated_completed_days: number
  updated_status: string
}

export type ProjectWithLatestEntry = Omit<Project, 'title' | 'completed_days' | 'status' | 'created_at'> & {
  entries: Omit<Entry, 'project_id' | 'description' | 'updated_at'>[]
}

export type LatestEntry = Omit<Entry, 'project_id' | 'description' | 'updated_at'>

export type ProjectWithTargetDays = Omit<Project, 'title' | 'completed_days' | 'status' | 'created_at'>