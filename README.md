# 🚀 Gitpad.io

**Turn domains into ideas — and ideas into domains.**

An AI-powered brainstorming tool for founders that generates startup ideas from domain names and domain names from startup ideas.

## ✨ Features

- **🌐 Domain → Ideas**: Enter a domain name and generate 10 creative startup ideas
- **💡 Idea → Domains**: Describe your idea and get 15-20 brandable domain suggestions
- **💾 Save & Organize**: Keep track of your favorite domains and ideas
- **🎨 Beautiful UI**: Glassmorphic design with smooth animations
- **⚡ Fast**: Built on Next.js 15 with App Router

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: OpenAI GPT-4o-mini
- **Database**: Supabase (ready to integrate)
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Add your API keys:

```env
# OpenAI API Key (required)
OPENAI_API_KEY=sk-...

# Supabase (optional - for saving data)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Project Structure

```
gitpad-io/
├── app/
│   ├── api/
│   │   ├── generate-ideas/    # Domain → Ideas endpoint
│   │   └── generate-domains/  # Idea → Domains endpoint
│   ├── page.tsx               # Main application
│   └── layout.tsx
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   └── types.ts              # TypeScript interfaces
├── supabase-schema.sql       # Database schema
└── .env.local.example        # Environment template
```

## 🗄️ Database Setup (Optional)

To persist saved domains and ideas:

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Run the SQL in `supabase-schema.sql` in the SQL Editor
4. Add your Supabase URL and anon key to `.env.local`
5. Implement authentication (Supabase Auth, Clerk, etc.)

## 🎨 Customization

### Update Branding

Edit `app/page.tsx`:
- Change "Gitpad.io" to your domain name
- Customize colors in Tailwind classes
- Adjust the gradient background

### AI Prompts

Modify prompts in:
- `app/api/generate-ideas/route.ts`
- `app/api/generate-domains/route.ts`

### Add Features

Easy extensions:
- Domain availability checking (Namecheap/GoDaddy API)
- Logo generation
- Export to PDF/JSON
- Public sharing links
- User authentication

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

Or use the Vercel dashboard to import your Git repository.

## 📝 License

MIT

## 🤝 Contributing

PRs welcome! Feel free to add features like:
- Domain availability checks
- More AI models (Anthropic, Gemini)
- Chrome extension
- Mobile app
- Community gallery

---

Built with ❤️ by founders, for founders.
