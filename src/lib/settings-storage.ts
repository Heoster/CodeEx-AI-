/**
 * Settings Storage
 * Handles persistence of user settings to local storage with migration support
 */

import type { Settings, ModelId } from './types';

const SETTINGS_KEY = 'codeex-settings';
const SETTINGS_VERSION = 2; // Increment when schema changes

interface StoredSettings extends Settings {
  _version?: number;
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  model: 'auto',
  preferredCategory: undefined,
  tone: 'helpful',
  technicalLevel: 'intermediate',
  enableSpeech: false,
  voice: 'troy', // Updated to Orpheus voice
};

// Valid model IDs for validation (from models-config.json)
// Valid model IDs are derived from models-config.json so the client only permits configured (free) models
import modelsConfigData from './models-config.json';
const VALID_MODEL_IDS: Set<string> = new Set([
  'auto',
  ...modelsConfigData.models.filter((m: any) => m.enabled).map((m: any) => m.id),
]);

// Old model IDs that need migration (if any legacy IDs exist)
// No migrations from paid models — if a user had an old paid model id, reset to auto
const MODEL_MIGRATIONS: Record<string, ModelId> = {
  // Add any legacy model ID migrations here if needed
  // Example: 'old-model-id': 'microsoft-dialoGPT-medium',
};

/**
 * Migrate old settings to new format
 */
function migrateSettings(stored: StoredSettings): Settings {
  const version = stored._version || 1;
  
  // Start with stored values
  let settings: Settings = { ...DEFAULT_SETTINGS, ...stored };
  
  // Migration from version 1 to 2
  if (version < 2) {
    // Migrate old model IDs
    if (settings.model !== 'auto') {
      const migratedModel = MODEL_MIGRATIONS[settings.model];
      if (migratedModel) {
        settings.model = migratedModel;
      } else if (!VALID_MODEL_IDS.has(settings.model)) {
        // Unknown model, reset to auto
        settings.model = 'auto';
      }
    }
    
    // Ensure preferredCategory exists
    if (!settings.preferredCategory) {
      settings.preferredCategory = undefined;
    }
  }
  
  return settings;
}

/**
 * Validate settings object
 */
function validateSettings(settings: unknown): settings is Settings {
  if (!settings || typeof settings !== 'object') return false;
  
  const s = settings as Record<string, unknown>;
  
  // Validate model
  if (typeof s.model !== 'string' || !VALID_MODEL_IDS.has(s.model)) {
    return false;
  }
  
  // Validate tone
  if (!['helpful', 'formal', 'casual'].includes(s.tone as string)) {
    return false;
  }
  
  // Validate technicalLevel
  if (!['beginner', 'intermediate', 'expert'].includes(s.technicalLevel as string)) {
    return false;
  }
  
  // Validate enableSpeech
  if (typeof s.enableSpeech !== 'boolean') {
    return false;
  }
  
  // Validate voice - Orpheus voices
  if (!['troy', 'diana', 'hannah', 'autumn', 'austin', 'daniel'].includes(s.voice as string)) {
    return false;
  }
  
  return true;
}

/**
 * Load settings from local storage
 */
export function loadSettings(): Settings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }
    
    const parsed = JSON.parse(stored) as StoredSettings;
    const migrated = migrateSettings(parsed);
    
    if (validateSettings(migrated)) {
      return migrated;
    }
    
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to local storage
 */
export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    const toStore: StoredSettings = {
      ...settings,
      _version: SETTINGS_VERSION,
    };
    
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(toStore));
  } catch (error) {
    console.warn('Failed to save settings:', error);
  }
}

/**
 * Clear settings from local storage
 */
export function clearSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.warn('Failed to clear settings:', error);
  }
}

/**
 * Check if a model ID is valid
 */
export function isValidModelId(modelId: string): modelId is 'auto' | ModelId {
  return VALID_MODEL_IDS.has(modelId);
}
