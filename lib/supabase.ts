import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SavedDomain {
  id: string
  domain: string
  created_at: string
  user_id?: string
}

export interface SavedIdea {
  id: string
  name: string
  tagline: string
  description: string
  category: string
  keywords: string[]
  linked_domain?: string
  created_at: string
  user_id?: string
}
