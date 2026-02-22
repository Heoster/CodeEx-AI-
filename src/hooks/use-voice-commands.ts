'use client';

import { useCallback, useRef } from 'react';

// Define the shape of a command
interface VoiceCommand {
  command: string | RegExp; // The phrase to listen for, or a regex pattern
  action: string; // A unique identifier for the action
  handler: (...args: any[]) => void; // The function to execute
}

// Dummy functions for actions - you'd replace these with your actual app logic
const openSettings = () => {
  console.log("Action: Opening settings dialog...");
  // Example: router.push('/settings') or open a modal
  alert("Opening settings!");
};

const goBack = () => {
  console.log("Action: Navigating back...");
  // Example: router.back()
  alert("Going back!");
};

const submitForm = () => {
  console.log("Action: Submitting the current form...");
  // Example: document.querySelector('form').submit()
  alert("Submitting form!");
};

const clearInput = () => {
  console.log("Action: Clearing input...");
  alert("Clearing input!");
};

// Define your list of commands
const voiceCommands: VoiceCommand[] = [
  { command: "open settings", action: "openSettings", handler: openSettings },
  { command: "go back", action: "goBack", handler: goBack },
  { command: "submit form", action: "submitForm", handler: submitForm },
  { command: "clear input", action: "clearInput", handler: clearInput },
  // More advanced: using a RegExp for partial matches or variations
  { command: /^(open|show|display) (my )?profile$/, action: "openProfile", handler: () => alert("Opening profile!") },
];

export const useVoiceCommands = () => {
  // Use ref to track processing state and prevent race conditions
  const isProcessingRef = useRef(false);
  
  const processVoiceCommand = useCallback(async (transcript: string) => {
    // Prevent race conditions - don't process if already processing
    if (isProcessingRef.current) {
      console.warn('Voice command already processing, ignoring duplicate request');
      return null;
    }
    
    // Validate input
    if (!transcript || transcript.trim().length === 0) {
      console.warn('Empty transcript received, ignoring');
      return null;
    }
    
    isProcessingRef.current = true;
    
    try {
      const lowerCaseTranscript = transcript.toLowerCase().trim();
      console.log("Processing transcript:", lowerCaseTranscript);

      for (const cmd of voiceCommands) {
        if (typeof cmd.command === 'string') {
          if (lowerCaseTranscript.includes(cmd.command)) {
            console.log(`Command recognized: "${cmd.command}"`);
            
            // Handle async commands safely
            await Promise.resolve(cmd.handler());
            
            return cmd.action; // Return the action name if a command is found
          }
        } else if (cmd.command instanceof RegExp) {
          if (cmd.command.test(lowerCaseTranscript)) {
            console.log(`Regex command recognized: "${cmd.command}"`);
            
            // Handle async commands safely
            await Promise.resolve(cmd.handler());
            
            return cmd.action; // Return the action name if a command is found
          }
        }
      }
      
      console.log("No command recognized for:", lowerCaseTranscript);
      return null; // No command found
    } catch (error) {
      console.error('Error processing voice command:', error);
      return null;
    } finally {
      // Always reset processing state
      isProcessingRef.current = false;
    }
  }, []);

  return { 
    processVoiceCommand, 
    voiceCommands,
    isProcessing: () => isProcessingRef.current,
  };
};
