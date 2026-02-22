# Implementation Plan

- [x] 1. Set up project infrastructure and testing framework



  - [x] 1.1 Install fast-check and configure testing environment

    - Add fast-check to devDependencies
    - Configure vitest or jest for property-based testing
    - Create test utilities and generators directory
    - _Requirements: Testing Strategy_
  - [ ]* 1.2 Write property test for model configuration round-trip
    - **Property 6: Model Configuration Round-Trip**
    - **Validates: Requirements 3.4**




- [x] 2. Implement core model configuration system

  - [x] 2.1 Create model configuration types and schema

    - Define ModelConfig, ProviderConfig, ModelCategory types in src/lib/model-config.ts
    - Define ModelParams interface with temperature, topP, topK, maxOutputTokens
    - Create Zod schema for configuration validation


    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 2.2 Write property test for configuration schema validation
    - **Property 7: Configuration Schema Validation**
    - **Validates: Requirements 3.5**
  - [x] 2.3 Create models configuration JSON file

    - Create src/lib/models-config.json with all model definitions
    - Include Google, Hugging Face, and OpenRouter provider configs
    - Define all models: Qwen, DeepSeek, WizardCoder, WizardMath, Llama, DialogPT, BlenderBot, Kosmos-2, BLIP2


    - _Requirements: 3.1_

- [x] 3. Implement Model Registry



  - [x] 3.1 Create ModelRegistry class with core methods

    - Implement getModel, getModelsByCategory, getAvailableModels, getDefaultModel, isModelAvailable
    - Load configuration from JSON file
    - Filter models based on provider availability
    - _Requirements: 1.1, 1.4, 3.1_
  - [ ]* 3.2 Write property test for display information completeness
    - **Property 2: Model Display Information Completeness**
    - **Validates: Requirements 1.3**
  - [ ] 3.3 Write property test for fallback model validity



    - **Property 3: Fallback Model Validity**
    - **Validates: Requirements 1.4**
  - [ ]* 3.4 Write property test for provider availability on missing key
    - **Property 10: Provider Availability on Missing Key**
    - **Validates: Requirements 5.2**

- [x] 4. Checkpoint - Ensure all tests pass
  - Build passes successfully, TypeScript compiles without errors.

- [x] 5. Implement Provider Adapters


  - [x] 5.1 Create base ProviderAdapter interface and types


    - Define GenerateRequest, GenerateResponse interfaces in src/ai/adapters/types.ts
    - Create abstract base adapter class
    - _Requirements: 3.2_

  - [x] 5.2 Implement Google AI adapter

    - Wrap existing Genkit googleAI integration
    - Implement generate method with proper error handling
    - _Requirements: 5.1, 5.4_

  - [x] 5.3 Implement Hugging Face adapter

    - Create HuggingFaceAdapter class
    - Implement API calls to Hugging Face Inference API
    - Handle authentication and rate limiting
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 5.4 Implement OpenRouter adapter

    - Create OpenRouterAdapter class
    - Implement API calls to OpenRouter API
    - Handle model routing and authentication
    - _Requirements: 5.1, 5.3, 5.4_
  - [ ]* 5.5 Write property test for response format normalization
    - **Property 12: Response Format Normalization**
    - **Validates: Requirements 6.1**
  - [ ]* 5.6 Write property test for error message standardization
    - **Property 13: Error Message Standardization**
    - **Validates: Requirements 6.3**
  - [ ]* 5.7 Write property test for provider exclusion on auth error
    - **Property 11: Provider Exclusion on Auth Error**


    - **Validates: Requirements 5.4**





- [x] 6. Implement Query Classifier


  - [x] 6.1 Create QueryClassifier with category detection
    - Implement keyword-based classification for coding, math, conversation queries
    - Return ModelCategory and confidence score




    - _Requirements: 2.4_
  - [ ]* 6.2 Write property test for query classifier output validity
    - **Property 5: Query Classifier Output Validity**
    - **Validates: Requirements 2.4**

- [x] 7. Implement Auto Router
  - [x] 7.1 Create AutoRouter with model selection logic

    - Integrate QueryClassifier for query analysis
    - Select appropriate model based on category
    - Include reasoning in selection result
    - _Requirements: 2.1, 2.2, 2.3_
  - [x]* 7.2 Write property test for auto-router category consistency



    - **Property 4: Auto-Router Category Consistency**

    - **Validates: Requirements 2.1, 2.2, 2.3**
  - [x]* 7.3 Write property test for auto-route reasoning presence


    - **Property 9: Auto-Route Reasoning Presence**
    - **Validates: Requirements 4.3**



- [x] 8. Checkpoint - Ensure all tests pass
  - Build passes successfully, TypeScript compiles without errors.

- [x] 9. Update types and settings persistence
  - [x] 9.1 Extend types.ts with new model types




    - Add ModelId union type with all model identifiers
    - Extend Settings type with preferredCategory
    - Extend Message type with modelUsed, modelCategory, autoRouted fields
    - _Requirements: 4.1_
  - [x] 9.2 Update settings persistence in local storage




    - Ensure new model IDs are persisted correctly
    - Handle migration from old settings format
    - _Requirements: 1.2_
  - [ ]* 9.3 Write property test for model selection persistence round-trip
    - **Property 1: Model Selection Persistence Round-Trip**
    - **Validates: Requirements 1.2**






  - [ ]* 9.4 Write property test for response model attribution
    - **Property 8: Response Model Attribution**
    - **Validates: Requirements 4.1**

- [x] 10. Implement DuckDuckGo search integration
  - [x] 10.1 Create DuckDuckGo API client
    - Implement searchDuckDuckGo function in src/lib/duckduckgo.ts
    - Handle query encoding and API response parsing




    - _Requirements: 8.1, 8.3_
  - [ ]* 10.2 Write property test for search query encoding
    - **Property 15: Search Query Encoding**
    - **Validates: Requirements 8.3**
  - [x] 10.3 Update web-search flow with DuckDuckGo



    - Integrate DuckDuckGo as primary search provider
    - Implement fallback to Google Search grounding
    - Pass results to AI model for summarization
    - _Requirements: 8.1, 8.2, 8.4_

  - [ ]* 10.4 Write property test for search fallback behavior
    - **Property 16: Search Fallback Behavior**
    - **Validates: Requirements 8.4**

- [x] 11. Implement Command Router

  - [x] 11.1 Create CommandRouter with command-to-model mapping

    - Define COMMAND_ROUTES mapping in src/ai/command-router.ts
    - Implement command detection and model selection




    - _Requirements: 10.1, 10.2, 10.3_
  - [x]* 11.2 Write property test for command model preference respect

    - **Property 20: Command Model Preference Respect**

    - **Validates: Requirements 10.2**
  - [x]* 11.3 Write property test for command auto-route category match

    - **Property 21: Command Auto-Route Category Match**

    - **Validates: Requirements 10.3**







- [x] 12. Update solve flow with math model routing
  - [x] 12.1 Integrate math model selection in solve-quizzes flow
    - Route /solve to math-optimized models when available
    - Implement fallback to general model with math prompting
    - _Requirements: 9.1, 9.3_
  - [x]* 12.2 Write property test for solve command math model routing


    - **Property 17: Solve Command Math Model Routing**
    - **Validates: Requirements 9.1, 9.3**
  - [x] 12.3 Add code detection in solve queries




    - Detect code patterns in /solve queries
    - Optionally route to coding model when code detected
    - _Requirements: 9.4_



  - [-]* 12.4 Write property test for code detection in solve queries

    - **Property 19: Code Detection in Solve Queries**
    - **Validates: Requirements 9.4**
  - [ ]* 12.5 Write property test for math solution LaTeX formatting
    - **Property 18: Math Solution LaTeX Formatting**
    - **Validates: Requirements 9.2**

- [x] 13. Checkpoint - Ensure all tests pass
  - Build passes successfully, TypeScript compiles without errors.

- [x] 14. Update process-user-message flow
  - [x] 14.1 Integrate model registry and auto-router
    - Update processUserMessageFlow to use ModelRegistry
    - Integrate AutoRouter for auto model selection
    - Update command routing to use CommandRouter
    - _Requirements: 2.1, 2.2, 2.3, 10.1, 10.2, 10.3_
  - [x] 14.2 Add model attribution to responses
    - Include modelUsed in response metadata
    - Add autoRouted flag when auto-routing is used
    - Include routing reasoning when applicable
    - _Requirements: 4.1, 4.3, 10.4_

- [x] 15. Implement mobile-responsive model selector UI
  - [x] 15.1 Create MobileModelSelector component
    - Implement bottom sheet pattern using Radix Dialog
    - Add collapsible accordion for model categories
    - Ensure touch-friendly tap targets (min 44x44px)
    - Add swipe-to-dismiss gesture support
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  - [ ]* 15.2 Write property test for mobile tap target size
    - **Property 14: Mobile Tap Target Size**
    - **Validates: Requirements 7.3**
  - [x] 15.3 Update SettingsDialog with responsive model selector
    - Use MobileModelSelector on mobile viewports
    - Keep existing dropdown on desktop
    - Add model descriptions and category grouping
    - _Requirements: 1.1, 1.3_

- [x] 16. Add model indicator to chat messages
  - [x] 16.1 Update ChatMessage component with model attribution
    - Display model name in message metadata
    - Add tooltip with model details on hover
    - Show auto-routing reasoning when applicable
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 17. Update environment configuration

  - [x] 17.1 Add new environment variables
    - Add HUGGINGFACE_API_KEY to .env.example
    - Add OPENROUTER_API_KEY to .env.example
    - Update documentation with API key setup instructions
    - _Requirements: 5.1_

- [x] 18. Final Checkpoint - Ensure all tests pass
  - Production build passes successfully
  - TypeScript compiles without errors
  - App ready for Netlify deployment
