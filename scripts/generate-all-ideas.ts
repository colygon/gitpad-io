import * as fs from 'fs'
import * as path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

// Load environment from .env.local if present, otherwise .env
const localEnv = path.join(process.cwd(), '.env.local')
const defaultEnv = path.join(process.cwd(), '.env')
if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv })
} else if (fs.existsSync(defaultEnv)) {
  dotenv.config({ path: defaultEnv })
}

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || ''
const anthropic = new Anthropic({ apiKey: CLAUDE_API_KEY })

const DOMAINS = [
  'mem.gg',
  'reportme.io',
  'buymecoffee.io',
  'buildon.io',
  'burrata.io',
  'brainsync.io',
  'gitpad.io',
  'magicoder.io',
  'scolar.io',
  'onlydegens.io',
  'safemode.gg',
  'robotico.io',
  'incident.ly',
  'neolithic.org',
  'webproxy.to',
  'faucet.to',
  'eventsy.io',
  'agentic-summit.com',
  'buildweek.co',
  'campzubra.com',
  'build-week.com',
  'buildweek.chat',
  'goldenticketsf.com',
  'schoolofskates.com',
  'churchofbit.org',
  'agenthack.ai',
  'dabl.chat',
  'elogy.ai',
  'lowenberg.org',
  'vampiredayclub.com',
  'lowenberg.com',
  'dablclub.org',
  'actionitem.app',
  'actionitem.xyz',
  'agave.camp',
  'agave.chat',
  'agave.dance',
  'agavelounge.camp',
  'akash.chat',
  'akash.co',
  'akash.social',
  'bagofdicks.space',
  'bob.chat',
  'burningman.chat',
  'campsilverspur.com',
  'caterpillar.chat',
  'colin.chat',
  'colinslist.org',
  'colinslist.xyz',
  'collin.chat',
  'collinslist.org',
  'collinslist.xyz',
  'colo.ooo',
  'colo.stream',
  'consensys.chat',
  'crazy4crypto.xyz',
  'crazyaboutcrypto.xyz',
  'crazyforcrypto.xyz',
  'cryptomondays.xyz',
  'cryptorodeo.xyz',
  'cryptozenzone.com',
  'dabl.camp',
  'denver.chat',
  'disco.money',
  'discobot.art',
  'discobot.co',
  'emotionalsupportanimal.party',
  'emotionalsupportanimals.party',
  'ethdenver.chat',
  'eventsea.co',
  'eventsea.io',
  'eventsea.org',
  'eventsea.xyz',
  'eventsy.xyz',
  'far.camp',
  'farcamp.xyz',
  'fireside.finance',
  'funcommittee.xyz',
  'fungiblefriday.com',
  'fungiblefriday.xyz',
  'fungiblefridays.com',
  'futuristcongress.com',
  'galleriaboheme.com',
  'glitter.chat',
  'glitterranch.xyz',
  'goldenspurresort.com',
  'goldenspurretreat.com',
  'hackqamp.com',
  'hadronq.com',
  'hadronquoridor.com',
  'hashtagrandom.com',
  'hashtagrandom.xyz',
  'horsinaround.rsvp',
  'hosteltakeover.xyz',
  'houseofmoon.io',
  'ixio.com',
  'liquiditypoolparty.com',
  'mamacelium.com',
  'mercenaries.network',
  'mercenary.network',
  'mobilecoin.exchange',
  'mobilecolin.com',
  'moby.money',
  'moby.tips',
  'mofi.app',
  'mofi.cash',
  'mofiapp.com',
  'party.pizza',
  'probablynothing.blog',
  'probablynothing.chat',
  'probablynothing.community',
  'probablynothing.party',
  'probablynothing.team',
  'probnothing.art',
  'safari.cash',
  'safari.social',
  'seal.cash',
  'seel.money',
  'sexwithsockpuppets.com',
  'sfblockchainweek.org',
  'sfblockchainweek.xyz',
  'shack.chat',
  'silverspur.co',
  'silverspur.xyz',
  'someonespecial.xyz',
  'southbysecret.com',
  'standup.finance',
  'sxsecret.com',
  'tacobot.co',
  'talesfromthecrypto.xyz',
  'theyosemiteclub.com',
  'unconference.app',
  'wassup.dog',
  'wasup.dog',
  'web3rodeo.com',
  'web3temple.com',
  'welcometobabyland.com',
  'wtfweb3.org',
  'yosemitespring.com',
  'yosemitespur.com',
  'zocamp.xyz',
  'zucamp.com',
  'zucamp.xyz',
  'zusemite.com',
]

async function generateIdeasForDomain(domain: string) {
  console.log(`Generating ideas for ${domain}...`)

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-latest',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Generate 10 unique and creative AI-powered startup ideas for the domain "${domain}". Each idea should have:
- name: catchy product name
- tagline: one-line description
- description: 2-3 sentence explanation
- category: (e.g., "AI Tools", "SaaS", "Developer Tools", "Social", "Finance", etc.)
- keywords: array of 3-5 relevant tags

Return as a JSON array of objects. ONLY return the JSON array, no other text or markdown formatting. Start directly with [ and end with ].`,
      },
    ],
  })

  const content = message.content[0].type === 'text' ? message.content[0].text : ''
  
  if (!content) {
    throw new Error('No content in response')
  }

  // Remove markdown code blocks if present
  const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim()
  const ideas = JSON.parse(cleanContent)
  return ideas
}

async function main() {
  if (!CLAUDE_API_KEY) {
    console.error('Error: CLAUDE_API_KEY environment variable is not set')
    process.exit(1)
  }

  console.log('Starting generation for 146 domains...')

  const allIdeas: Record<string, any[]> = {}
  
  for (let i = 0; i < DOMAINS.length; i++) {
    const domain = DOMAINS[i]
    try {
      const ideas = await generateIdeasForDomain(domain)
      allIdeas[domain] = ideas
      console.log(`✓ Generated ${ideas.length} ideas for ${domain} (${i + 1}/${DOMAINS.length})`)
      
      // Wait 1 second between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`✗ Failed to generate ideas for ${domain}:`, error)
      allIdeas[domain] = []
    }
  }

  // Save to file
  const outputPath = path.join(process.cwd(), 'public', 'pregenerated-ideas.json')
  fs.writeFileSync(outputPath, JSON.stringify(allIdeas, null, 2))
  
  console.log(`\n✓ Successfully generated ideas for ${Object.keys(allIdeas).length} domains`)
  console.log(`✓ Saved to ${outputPath}`)
}

main()
