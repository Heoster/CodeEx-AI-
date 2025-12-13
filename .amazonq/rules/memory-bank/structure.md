# Project Structure

## Directory Organization

### Root Level
```
CodeEx-AI-ver-2.0-main/
├── src/                    # Source code
├── public/                 # Static assets and PWA files
├── docs/                   # Documentation files
├── .github/workflows/      # CI/CD workflows
├── .amazonq/rules/         # Amazon Q rules and memory bank
└── Configuration files     # Next.js, TypeScript, Tailwind configs
```

### Source Directory (`src/`)

#### `/src/app/` - Next.js App Router Pages
- **Main Pages**: `page.tsx` (landing), `layout.tsx` (root layout), `globals.css`
- **Feature Routes**:
  - `/chat` - Main chat interface
  - `/visual-math` - Visual math problem solver
  - `/pdf-analyzer` - PDF analysis tool
  - `/login` - Authentication pages
  - `/documentation` - Documentation pages
  - `/pricing`, `/about`, `/blog`, `/careers`, `/contact`, `/support`, `/privacy` - Marketing/info pages
- **Server Actions**: `actions.ts` - Server-side operations

#### `/src/components/` - React Components
- **`/chat/`** - Chat-specific components (message display, input, etc.)
- **`/ui/`** - Reusable UI components (buttons, dialogs, sidebar, etc.)
- **Root Components**:
  - `SpeechInputComponent.tsx` - Voice input handling
  - `theme-provider.tsx`, `theme-toggle.tsx` - Theme management
  - `settings-dialog.tsx` - User settings
  - `install-pwa-button.tsx` - PWA installation
  - `app-tour.tsx` - Onboarding tour

#### `/src/hooks/` - Custom React Hooks
- `use-auth.tsx` - Authentication state management
- `use-chat-history.ts` - Chat history persistence
- `use-voice-commands.ts` - Voice command processing
- `use-local-storage.ts` - Local storage utilities
- `use-mobile.tsx` - Mobile detection
- `use-theme.tsx` - Theme management
- `use-toast.ts` - Toast notifications

#### `/src/ai/` - AI Integration Layer
- **`/flows/`** - AI workflow definitions
- `genkit.ts` - Genkit AI configuration
- `dev.ts` - Development AI server

#### `/src/lib/` - Utility Libraries
- `firebase.ts` - Firebase initialization
- `firestore.ts` - Firestore database operations
- `email.ts` - Email service integration (EmailJS)
- `types.ts` - Shared TypeScript types
- `utils.ts` - General utility functions

#### `/src/types/` - TypeScript Declarations
- `speech.d.ts` - Web Speech API type definitions

### Public Directory (`public/`)
- **PWA Files**: `manifest.json`, `sw.js`, `workbox-*.js` - Service worker and PWA configuration
- **Icons**: `/icons/` - App icons for various sizes
- **Images**: Feature images (`eng.png`, `Multi-Chat.png`, `Hist.png`, etc.)

### Documentation (`docs/`)
- `blueprint.md` - Original app design blueprint
- `emailjs-setup.md` - EmailJS configuration guide

## Core Component Relationships

### Authentication Flow
```
use-auth.tsx (hook) → firebase.ts → User State → Protected Routes
```

### Chat System
```
/chat (page) → Chat Components → use-chat-history.ts → Local Storage
                              → AI Flows → Genkit AI
```

### Voice System
```
SpeechInputComponent → use-voice-commands.ts → Chat System
```

### Theme System
```
theme-provider.tsx → use-theme.tsx → next-themes → CSS Variables
```

## Architectural Patterns

### Next.js App Router
- File-based routing with nested layouts
- Server and client components separation (`'use client'` directive)
- Server actions for backend operations

### State Management
- React hooks for local state
- Custom hooks for shared logic
- Local storage for persistence
- Firebase for user data

### Component Architecture
- Radix UI primitives for accessible components
- Shadcn/ui component library pattern
- Composition over inheritance
- Props-based customization

### AI Integration
- Genkit AI framework for AI workflows
- Google AI integration
- Modular flow definitions in `/ai/flows/`

### PWA Architecture
- Next-PWA plugin for service worker generation
- Offline-first capabilities
- Installable app experience
- Background sync support

## Configuration Files
- `next.config.js` - Next.js and PWA configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `components.json` - Shadcn/ui component configuration
- `.eslintrc.json` - ESLint rules
- `postcss.config.mjs` - PostCSS plugins
