'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceCommands } from '@/hooks/use-voice-commands';

const SpeechInputComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const { processVoiceCommand } = useVoiceCommands();

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.error("Web Speech API is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      console.log('Voice recognition started.');
    };

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      setIsListening(false);
      console.log('Voice recognition finished. Transcript:', currentTranscript);

      processVoiceCommand(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended.');
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, [processVoiceCommand]);

  const startListening = () => {
    recognitionRef.current?.start();
  };



  const stopListening = () => {
    recognitionRef.current?.stop();
  };
  

  return (
    <div className="flex flex-col items-center p-4">
      <Button onClick={isListening ? stopListening : startListening} disabled={!recognitionRef.current}>
        {isListening ? 'Stop Listening' : 'Start Voice Input'}
      </Button>
      {transcript && (
        <p className="mt-4 text-lg">
          Recognized Text: <strong>{transcript}</strong>
        </p>
      )}
      {isListening && <p className="mt-2 text-sm text-gray-500">Listening for commands...</p>}
    </div>
  );
};

export default SpeechInputComponent;
