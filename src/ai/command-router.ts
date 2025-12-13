/**
 * Command Router
 * Routes special commands (/solve, /search, /summarize) to appropriate models
 */

import type { ModelCategory, ModelConfig } from '@/lib/model-config';
import { getModelRegistry } from '@/lib/model-registry';
import { containsCode } from './query-classifier';

/**
 * Command types supported by the router
 */
export type CommandType = 'solve' | 'search' | 'summarize' | 'general';

/**
 * Command route configuration
 */
export interface CommandRoute {
  command: CommandType;
  preferredCategory: ModelCategory;
  fallbackCategory: ModelCategory;
}

/**
 * Result of command routing
 */
export interface CommandRouteResult {
  command: CommandType;
  content: string;
  model: ModelConfig;
  reasoning: string;
  codeDetected?: boolean;
}

/**
 * Command routes mapping
 */
export const COMMAND_ROUTES: Record<string, CommandRoute> = {
  '/solve': {
    command: 'solve',
    preferredCategory: 'math',
    fallbackCategory: 'general',
  },
  '/search': {
    command: 'search',
    preferredCategory: 'general',
    fallbackCategory: 'general',
  },
  '/summarize': {
    command: 'summarize',
    preferredCategory: 'general',
    fallbackCategory: 'general',
  },
};

/**
 * Detect command from message
 */
export function detectCommand(message: string): { command: CommandType; content: string } | null {
  // Validate input
  if (!message || typeof message !== 'string') {
    console.warn('Invalid message passed to detectCommand');
    return null;
  }
  
  const trimmed = message.trim();
  
  // Reject empty messages
  if (trimmed.length === 0) {
    console.warn('Empty message passed to detectCommand');
    return null;
  }
  
  for (const [prefix, route] of Object.entries(COMMAND_ROUTES)) {
    if (trimmed.startsWith(prefix + ' ')) {
      const content = trimmed.substring(prefix.length + 1).trim();
      
      // Validate content is not empty
      if (!content || content.length === 0) {
        console.warn(`Command ${prefix} detected but content is empty`);
        return null;
      }
      
      return {
        command: route.command,
        content,
      };
    }
  }
  
  return null;
}

/**
 * Command Router class
 */
export class CommandRouter {
  private registry = getModelRegistry();
  
  /**
   * Route a command to the appropriate model
   */
  routeCommand(
    message: string,
    userModelSetting: string,
    isAutoMode: boolean
  ): CommandRouteResult | null {
    const detected = detectCommand(message);
    
    if (!detected) {
      return null;
    }
    
    const { command, content } = detected;
    const route = COMMAND_ROUTES[`/${command}`];
    
    // If not in auto mode, respect user's model preference
    if (!isAutoMode && userModelSetting !== 'auto') {
      const userModel = this.registry.getModel(userModelSetting);
      if (userModel && this.registry.isModelAvailable(userModelSetting)) {
        return {
          command,
          content,
          model: userModel,
          reasoning: `Using user-selected model: ${userModel.name}`,
        };
      }
    }
    
    // Auto-route based on command type
    return this.autoRouteCommand(command, content, route);
  }
  
  /**
   * Auto-route a command to the best model
   */
  private autoRouteCommand(
    command: CommandType,
    content: string,
    route: CommandRoute
  ): CommandRouteResult {
    // Special handling for /solve with code
    if (command === 'solve') {
      const hasCode = containsCode(content);
      
      if (hasCode) {
        // Route to coding model instead
        const codingModels = this.registry.getModelsByCategory('coding');
        if (codingModels.length > 0) {
          return {
            command,
            content,
            model: codingModels[0],
            reasoning: 'Code detected in solve query. Using coding-optimized model.',
            codeDetected: true,
          };
        }
      }
    }
    
    // Try preferred category
    const preferredModels = this.registry.getModelsByCategory(route.preferredCategory);
    if (preferredModels.length > 0) {
      return {
        command,
        content,
        model: preferredModels[0],
        reasoning: `Using ${route.preferredCategory}-optimized model for /${command} command.`,
      };
    }
    
    // Try fallback category
    const fallbackModels = this.registry.getModelsByCategory(route.fallbackCategory);
    if (fallbackModels.length > 0) {
      return {
        command,
        content,
        model: fallbackModels[0],
        reasoning: `No ${route.preferredCategory} models available. Using ${route.fallbackCategory} model.`,
      };
    }
    
    // Ultimate fallback
    const defaultModel = this.registry.getDefaultModel();
    return {
      command,
      content,
      model: defaultModel,
      reasoning: `Using default model: ${defaultModel.name}`,
    };
  }
  
  /**
   * Get the preferred category for a command
   */
  getPreferredCategory(command: CommandType): ModelCategory {
    const route = COMMAND_ROUTES[`/${command}`];
    return route?.preferredCategory || 'general';
  }
}

// Singleton instance
let routerInstance: CommandRouter | null = null;

export function getCommandRouter(): CommandRouter {
  if (!routerInstance) {
    routerInstance = new CommandRouter();
  }
  return routerInstance;
}

/**
 * Reset the router (useful for testing)
 */
export function resetCommandRouter(): void {
  routerInstance = null;
}
