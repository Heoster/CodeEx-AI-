# Technology Stack

## Core Technologies

### Framework & Runtime
- **Next.js 14.2.30** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5.2.2** - Type-safe JavaScript
- **Node.js 20.5.7** - Runtime environment

### AI & Machine Learning
- **Genkit 1.12.0** - AI application framework
- **@genkit-ai/ai** - Core AI functionality
- **Hugging Face Inference API** - Free AI model integration
- **Web Speech API** - Browser-based speech recognition and synthesis

### Authentication & Database
- **Firebase 10.7.1** - Backend services
  - Firebase Authentication (email/password, Google sign-in)
  - Firestore database for user data
  - Firebase hosting support

### UI Framework & Components
- **Tailwind CSS 3.3.3** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Dialog, Dropdown, Popover, Tooltip, Tabs, Accordion, etc.
- **Lucide React 0.294.0** - Icon library
- **next-themes 0.2.1** - Theme management (light/dark mode)
- **class-variance-authority** - Component variant management
- **tailwind-merge** - Tailwind class merging utility
- **tailwindcss-animate** - Animation utilities

### Form & Validation
- **react-hook-form 7.48.2** - Form state management
- **@hookform/resolvers 3.9.0** - Form validation resolvers
- **zod 3.22.4** - Schema validation

### Content Rendering
- **react-markdown 9.0.1** - Markdown rendering
- **remark-gfm 4.0.0** - GitHub Flavored Markdown support
- **react-katex 3.0.1** - Mathematical equation rendering
- **katex 0.16.10** - LaTeX math rendering engine

### PWA & Service Workers
- **@ducanh2912/next-pwa 10.2.7** - Progressive Web App support
- **Workbox** - Service worker libraries for caching and offline support

### Additional Libraries
- **emailjs-com 3.2.0** - Email service integration
- **embla-carousel-react 8.6.0** - Carousel component
- **recharts 3.5.1** - Charting library
- **react-day-picker 8.8.2** - Date picker component

## Development Tools

### Code Quality
- **ESLint 8.48.0** - JavaScript/TypeScript linting
  - eslint-config-next
  - eslint-config-prettier
  - eslint-plugin-react
  - @typescript-eslint/eslint-plugin
- **Prettier 3.0.3** - Code formatting
  - prettier-plugin-tailwindcss
  - @ianvs/prettier-plugin-sort-imports

### Build Tools
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.15** - CSS vendor prefixing
- **@tailwindcss/typography** - Prose styling

### Type Definitions
- @types/react, @types/react-dom, @types/node
- @types/katex, @types/react-katex
- @types/wav

## Development Commands

### Primary Commands
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # TypeScript type checking
```

### AI Development
```bash
npm run genkit:dev       # Start Genkit development server
npm run genkit:watch     # Start Genkit with file watching
```

## Configuration Files

### TypeScript Configuration (`tsconfig.json`)
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` maps to `./src/*`
- **JSX**: Preserve (handled by Next.js)

### Next.js Configuration
- PWA support with offline capabilities
- Image optimization
- App Router enabled
- Custom webpack configuration for PWA

### Tailwind Configuration
- Custom color schemes for light/dark themes
- Typography plugin
- Animation utilities
- Custom component styles

### ESLint Configuration
- Next.js recommended rules
- React best practices
- TypeScript-specific rules
- Prettier integration

## Browser APIs Used
- **Web Speech API** - Speech recognition and synthesis
- **Service Worker API** - PWA offline support
- **Local Storage API** - Chat history persistence
- **Media Queries API** - Responsive design and theme detection
- **Notification API** - PWA notifications (potential)

## Deployment Targets
- **Netlify** - Primary deployment (netlify.toml configured)
- **Firebase Hosting** - Alternative deployment (apphosting.yaml)
- **Vercel** - Compatible with Next.js defaults

## Version Requirements
- Node.js 20.x or higher
- npm or yarn package manager
- Modern browser with ES2017+ support
- Web Speech API support for voice features
