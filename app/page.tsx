'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Loader2, Save, Link2, Trash2 } from 'lucide-react'
import type { Idea, DomainSuggestion, Mode } from '@/lib/types'
import { INITIAL_DOMAINS } from '@/components/InitialDomains'

export default function Home() {
  const [mode, setMode] = useState<Mode>('domain-to-ideas')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [domains, setDomains] = useState<DomainSuggestion[]>([])
  const [savedDomains, setSavedDomains] = useState<string[]>([])
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([])

  // Load initial domains on mount
  useEffect(() => {
    setSavedDomains(INITIAL_DOMAINS)
  }, [])

  const handleGenerate = async () => {
    if (!input.trim()) return

    setLoading(true)
    setIdeas([])
    setDomains([])

    try {
      if (mode === 'domain-to-ideas') {
        const response = await fetch('/api/generate-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: input }),
        })

        const data = await response.json()
        if (data.ideas) {
          setIdeas(data.ideas)
        }
      } else {
        const response = await fetch('/api/generate-domains', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idea: input }),
        })

        const data = await response.json()
        if (data.domains) {
          setDomains(data.domains)
        }
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveIdea = (idea: Idea) => {
    if (!savedIdeas.find((i) => i.name === idea.name)) {
      setSavedIdeas([...savedIdeas, idea])
    }
  }

  const saveDomain = (domain: string) => {
    if (!savedDomains.includes(domain)) {
      setSavedDomains([...savedDomains, domain])
    }
  }

  const removeIdea = (ideaName: string) => {
    setSavedIdeas(savedIdeas.filter((i) => i.name !== ideaName))
  }

  const removeDomain = (domain: string) => {
    setSavedDomains(savedDomains.filter((d) => d !== domain))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" size={48} />
            Gitpad.io
          </h1>
          <p className="text-xl text-purple-200">
            Turn domains into ideas — and ideas into domains.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Saved Domains */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                🌐 My Domains
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedDomains.length === 0 ? (
                  <p className="text-sm text-purple-200/60">No saved domains yet</p>
                ) : (
                  savedDomains.map((domain) => (
                    <div
                      key={domain}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-2 text-sm"
                    >
                      <span className="text-purple-100 truncate">{domain}</span>
                      <button
                        onClick={() => removeDomain(domain)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Saved Ideas */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                💡 My Ideas
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedIdeas.length === 0 ? (
                  <p className="text-sm text-purple-200/60">No saved ideas yet</p>
                ) : (
                  savedIdeas.map((idea) => (
                    <div
                      key={idea.name}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-2"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-purple-100 truncate">
                          {idea.name}
                        </p>
                        <p className="text-xs text-purple-200/60 truncate">
                          {idea.category}
                        </p>
                      </div>
                      <button
                        onClick={() => removeIdea(idea.name)}
                        className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Main Generator */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              {/* Mode Toggle */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => {
                    setMode('domain-to-ideas')
                    setIdeas([])
                    setDomains([])
                  }}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    mode === 'domain-to-ideas'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  🌐 Domain → Ideas
                </button>
                <button
                  onClick={() => {
                    setMode('idea-to-domains')
                    setIdeas([])
                    setDomains([])
                  }}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    mode === 'idea-to-domains'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  💡 Idea → Domains
                </button>
              </div>

              {/* Input Section */}
              <div className="mb-8">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder={
                      mode === 'domain-to-ideas'
                        ? 'Enter a domain name (e.g., gitpad.io)'
                        : 'Describe your startup idea...'
                    }
                    className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !input.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              <AnimatePresence mode="wait">
                {mode === 'domain-to-ideas' && ideas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      💡 {ideas.length} Startup Ideas
                    </h2>
                    {ideas.map((idea, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1">
                              {index + 1}. {idea.name}
                            </h3>
                            <p className="text-purple-300 font-medium">{idea.tagline}</p>
                          </div>
                          <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm">
                            {idea.category}
                          </span>
                        </div>
                        <p className="text-purple-100/80 mb-4">{idea.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {idea.keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="px-2 py-1 bg-white/10 text-purple-200 rounded text-xs"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => saveIdea(idea)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                          >
                            <Save size={16} />
                            Save
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {mode === 'idea-to-domains' && domains.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      🌐 {domains.length} Domain Suggestions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domains.map((domain, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white truncate">
                              {domain.domain}
                            </h3>
                            <span className="px-2 py-1 bg-blue-600/30 text-blue-200 rounded text-xs font-mono">
                              {domain.extension}
                            </span>
                          </div>
                          {domain.score && (
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex-1 bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                  style={{ width: `${domain.score * 10}%` }}
                                />
                              </div>
                              <span className="text-purple-200 text-sm font-medium">
                                {domain.score}/10
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => saveDomain(domain.domain)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                          >
                            <Save size={16} />
                            Save Domain
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
