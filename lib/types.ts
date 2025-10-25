export interface Idea {
  name: string
  tagline: string
  description: string
  category: string
  keywords: string[]
}

export interface DomainSuggestion {
  domain: string
  extension: string
  available?: boolean
  score?: number
}

export type Mode = 'domain-to-ideas' | 'idea-to-domains'
