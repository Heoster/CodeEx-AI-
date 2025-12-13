# Development Guidelines

## Code Quality Standards

### Client-Side Directive
- **Always use 'use client' directive** for components with browser APIs, hooks, or interactivity (5/5 files)
- Place directive at the very top of the file before imports
- Example: `'use client';` in SpeechInputComponent.tsx, sidebar.tsx, page.tsx, use-chat-history.ts

### Server-Side Directive
- **Use 'use server' directive** for server actions and API flows (1/5 files)
- Example: `'use server';` in generate-answer-from-context.ts

### Import Organization
- Group imports logically: React/Next.js → Third-party → Local components → Hooks → Utils/Types
- Use absolute imports with `@/` path alias consistently
- Example from sidebar.tsx:
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
```

### TypeScript Patterns
- **Strict typing**: Use TypeScript for all files (.ts, .tsx)
- **Type inference**: Leverage TypeScript's inference where possible
- **Explicit types for exports**: Always type function parameters and return values
- **Zod schemas**: Use Zod for runtime validation and type generation
- Example from generate-answer-from-context.ts:
```typescript
const GenerateAnswerFromContextInputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type GenerateAnswerFromContextInput = z.infer<typeof GenerateAnswerFromContextInputSchema>;
```

### Naming Conventions
- **Components**: PascalCase (e.g., SpeechInputComponent, SidebarProvider)
- **Hooks**: camelCase with 'use' prefix (e.g., useSidebar, useChatHistory)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., SIDEBAR_COOKIE_NAME, SIDEBAR_WIDTH)
- **Functions**: camelCase (e.g., createNewChat, addMessage, toggleSidebar)
- **Types/Interfaces**: PascalCase (e.g., SidebarContext, GenerateAnswerFromContextInput)
- **Files**: kebab-case for utilities, PascalCase for components (e.g., use-chat-history.ts, SpeechInputComponent.tsx)

## React & Next.js Patterns

### Component Structure
- **Functional components with hooks** - No class components (5/5 React files)
- **forwardRef for reusable UI components** - Used extensively in sidebar.tsx
- **Context for shared state** - Example: SidebarContext in sidebar.tsx
- **Custom hooks for logic extraction** - Example: useSidebar, useChatHistory

### Hook Usage Patterns
- **useCallback for memoized functions** - Prevents unnecessary re-renders
- **useMemo for expensive computations** - Example in use-chat-history.ts:
```typescript
const initialChats = useMemo(() => [], []);
const initialMessages = useMemo(() => ({}), []);
```
- **useEffect for side effects** - Lifecycle management, event listeners
- **useState for local state** - Component-specific state
- **useRef for DOM references** - Example: recognitionRef in SpeechInputComponent.tsx

### State Management
- **Local storage for persistence** - Custom useLocalStorage hook
- **Context for component trees** - SidebarContext pattern
- **Derived state from props/state** - Avoid redundant state
- Example from use-chat-history.ts:
```typescript
const activeChat = chats.find(c => c.id === activeChatId);
const activeChatMessages = messages[activeChatId] || [];
```

### Event Handling
- **Arrow functions in JSX** - Inline handlers when needed
- **Named handler functions** - For complex logic
- **Event cleanup in useEffect** - Always return cleanup function
- Example from sidebar.tsx:
```typescript
React.useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [toggleSidebar]);
```

## Styling & UI Patterns

### Tailwind CSS Usage
- **Utility-first approach** - Compose styles with Tailwind classes
- **Responsive design** - Use responsive prefixes (md:, lg:)
- **Custom utilities via cn()** - Merge classes with clsx and tailwind-merge
- Example:
```typescript
className={cn(
  "flex h-full w-full flex-col bg-sidebar",
  "group-data-[variant=floating]:rounded-lg",
  className
)}
```

### Component Variants
- **class-variance-authority (cva)** - Define component variants
- Example from sidebar.tsx:
```typescript
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2...",
  {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { default: "h-8 text-sm", sm: "h-7 text-xs", lg: "h-12 text-sm" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

### Accessibility
- **Semantic HTML** - Use appropriate elements (button, nav, main, header, footer)
- **ARIA attributes** - aria-label, aria-disabled, role attributes
- **Screen reader support** - sr-only class for hidden text
- **Keyboard navigation** - tabIndex, keyboard shortcuts
- Example from sidebar.tsx:
```typescript
<span className="sr-only">Toggle Sidebar</span>
```

## Data Management Patterns

### Local Storage Strategy
- **User-scoped keys** - Prefix with userId for multi-user support
- **Fallback keys** - Handle unauthenticated state
- Example from use-chat-history.ts:
```typescript
const getUserStorageKey = (userId: string, key: string) => `${userId}_${key}`;
const [chats, setChats] = useLocalStorage<Chat[]>(
  userId ? getUserStorageKey(userId, 'chats') : 'fallback_chats',
  initialChats
);
```

### Data Structures
- **Normalized data** - Separate chats and messages by ID
- **Immutable updates** - Use spread operators and array methods
- **Timestamps** - ISO string format for dates
- Example:
```typescript
const newChat: Chat = {
  id: crypto.randomUUID(),
  userId,
  title: 'New Chat',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

### Sorting & Filtering
- **Sort by updatedAt** - Most recent first
- **Defensive programming** - Handle empty arrays, undefined values
- Example:
```typescript
chats.sort((a, b) => 
  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
)
```

## AI Integration Patterns

### Genkit Flow Structure
- **Define schemas with Zod** - Input and output validation
- **Server-side execution** - Use 'use server' directive
- **Error handling** - Catch and transform errors with helpful messages
- Example from generate-answer-from-context.ts:
```typescript
export async function generateAnswerFromContext(
  input: GenerateAnswerFromContextInput
): Promise<GenerateAnswerFromContextOutput> {
  return generateAnswerFromContextFlow(input);
}
```

### System Prompts
- **Dynamic instructions** - Adapt based on tone and technical level
- **Clear role definition** - Define AI personality and capabilities
- **Response guidelines** - Specify formatting, accuracy, conciseness
- Example:
```typescript
const getToneInstructions = (tone: string) => {
  switch (tone) {
    case 'formal': return 'Use professional language...';
    case 'casual': return 'Be friendly and conversational...';
    default: return 'Be warm, approachable, and supportive...';
  }
};
```

### Message History Handling
- **Role mapping** - Convert 'assistant' to 'model' for Google AI
- **Validation** - Ensure first message is from user
- **History trimming** - Remove leading model messages
- Example:
```typescript
let history: MessageData[] = messages.map(msg => ({
  role: msg.role === 'assistant' ? 'model' : 'user',
  content: [{text: msg.content}],
}));
while (history.length > 0 && history[0].role !== 'user') {
  history.shift();
}
```

## Error Handling

### Try-Catch Patterns
- **Wrap async operations** - Always catch errors in async functions
- **Specific error messages** - Provide context-specific error messages
- **Error transformation** - Convert technical errors to user-friendly messages
- Example from generate-answer-from-context.ts:
```typescript
try {
  const response = await ai.generate({...});
  return {answer: response.text};
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  if (errorMessage.includes('API key')) {
    throw new Error('AI service unavailable. Please check your Google AI API key configuration.');
  }
  throw error;
}
```

### Defensive Programming
- **Null checks** - Check for undefined/null before accessing properties
- **Type guards** - Use instanceof and typeof checks
- **Default values** - Provide fallbacks for optional parameters
- Example:
```typescript
if (!userId) return;
const activeChatMessages = messages[activeChatId] || [];
```

## Performance Optimization

### Memoization
- **useMemo for expensive calculations** - Prevent recalculation on every render
- **useCallback for function stability** - Prevent child re-renders
- **React.memo for components** - Memoize component rendering (when needed)

### Lazy Loading
- **Dynamic imports** - Load components on demand
- **Code splitting** - Separate bundles for routes

### Efficient Updates
- **Batch state updates** - Combine multiple setState calls
- **Avoid inline object creation** - Extract to constants or useMemo
- **Conditional rendering** - Use early returns and conditional operators

## Documentation Standards

### JSDoc Comments
- **File-level documentation** - @fileOverview for module purpose
- **Function documentation** - Describe parameters and return values
- Example:
```typescript
/**
 * @fileOverview Enhanced Genkit flow for intelligent conversation with context awareness.
 */
```

### Inline Comments
- **Explain "why" not "what"** - Code should be self-documenting
- **Complex logic** - Add comments for non-obvious implementations
- **TODOs** - Mark future improvements with TODO comments

### Type Documentation
- **Zod descriptions** - Use .describe() for schema fields
- Example:
```typescript
messages: z.array(...).describe('The conversation history.')
```

## Testing Considerations

### Component Testing
- Test user interactions (clicks, inputs)
- Test conditional rendering
- Test error states

### Hook Testing
- Test state updates
- Test side effects
- Test cleanup functions

### Integration Testing
- Test data flow between components
- Test API interactions
- Test authentication flows
