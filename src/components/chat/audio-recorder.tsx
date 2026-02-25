'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onTranscribed: (text: string) => void;
  onCancel?: () => void;
}

export function AudioRecorder({ onTranscribed, onCancel }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        await processRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: 'Recording started',
        description: 'Speak clearly into your microphone',
      });
    } catch (error) {
      console.error('Recording error:', error);
      toast({
        title: 'Recording failed',
        description: 'Please allow microphone access',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);

    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      // Create form data
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('language', 'en');

      // Send to transcription API
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Transcription failed');
      }

      toast({
        title: 'Transcription complete',
        description: 'Your audio has been converted to text',
      });

      onTranscribed(data.text);
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: 'Transcription failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      chunksRef.current = [];
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {!isRecording && !isProcessing && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startRecording}
          className="w-full"
        >
          <Mic className="mr-2 h-4 w-4" />
          Start Recording
        </Button>
      )}

      {isRecording && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
            <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                stopRecording();
                onCancel?.();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            
            <Button
              type="button"
              size="sm"
              onClick={stopRecording}
              className="flex-1 btn-gradient"
            >
              <Square className="mr-2 h-4 w-4" />
              Stop & Transcribe
            </Button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center gap-3 p-4 border rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Transcribing audio...</span>
        </div>
      )}
    </div>
  );
}
