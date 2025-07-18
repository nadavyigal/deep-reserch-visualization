# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Clean build cache and restart
npm run clean-start
```

## Project Architecture

This is a **Next.js 14 App Router** application focused on **data visualization and research tools** with AI-powered content generation. The app combines multiple visualization libraries (Recharts, Mermaid, ReactFlow, AnimeJS) with AI services for creating interactive research documents.

### Core Structure

- **src/app/**: Next.js App Router pages and layouts
  - `page.tsx`: Main authentication demo page
  - `layout.tsx`: Root layout with ClientProviders
  - `api/`: API routes for AI services and authentication
  - `components/`: All React components

- **src/lib/**: Utilities, contexts, and hooks
  - `firebase/`: Firebase configuration with lazy initialization
  - `contexts/`: React contexts for Auth and Deepgram
  - `hooks/`: Custom React hooks

### Key Features & Components

**Authentication System:**
- Firebase Authentication with fallback config for development
- NextAuth.js integration with email/password auth
- `AuthContext.tsx` provides user state management
- Test credentials: `user@example.com` / `password`

**AI Integration:**
- OpenAI API routes for chat, chart generation, flowcharts, animations
- Anthropic API routes for advanced chat functionality
- Replicate API for Stable Diffusion image generation
- Deepgram for real-time audio transcription

**Visualization Libraries:**
- **Recharts**: Chart generation (`ChartGenerator.tsx`, `SimpleChartGenerator.tsx`)
- **Mermaid**: Flowchart rendering (`FlowchartGenerator.tsx`)
- **ReactFlow/Reaflow**: Interactive diagrams (`ReaflowChart.tsx`)
- **AnimeJS**: Custom animations (`AnimationGenerator.tsx`)

**Document Processing:**
- Markdown parsing and rendering with animation containers
- HTML export functionality with embedded animations
- Research document templates and examples

### Configuration Files

**Firebase Setup:**
- Requires environment variables for Firebase config
- Falls back to development config if env vars missing
- Lazy initialization pattern prevents startup errors

**Path Aliases:**
- `@/*` maps to `./src/*` in TypeScript paths

**Styling:**
- Tailwind CSS with custom dark mode support
- Component-specific CSS for ReactFlow and Reaflow

### Development Notes

**API Routes Organization:**
- `/api/openai/`: OpenAI-powered generation endpoints
- `/api/anthropic/`: Anthropic chat functionality  
- `/api/replicate/`: Image generation via Stable Diffusion
- `/api/deepgram/`: Audio transcription services
- `/api/auth/`: NextAuth.js authentication endpoints

**Component Patterns:**
- Client components use `'use client'` directive
- Contexts provide global state (Auth, Deepgram)
- Lazy loading for heavy visualization libraries
- Error boundaries for AI service failures

**Special Considerations:**
- Unicode paths supported in webpack config
- Image optimization disabled for path compatibility
- Source maps disabled in production builds
- Firebase emulator support in development mode

### AI Service Integration

Each AI service has dedicated API routes and client-side components:
- Chart generation uses OpenAI to create Recharts configurations
- Flowchart generation creates Mermaid diagram syntax
- Animation code generation produces AnimeJS snippets
- Image generation uses Replicate's Stable Diffusion models