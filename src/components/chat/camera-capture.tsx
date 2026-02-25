'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X, RotateCw, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  userId: string;
  onImageCaptured: (url: string, path: string) => void;
  onCancel?: () => void;
}

export function CameraCapture({ userId, onImageCaptured, onCancel }: CameraCaptureProps) {
  const [isActive, setIsActive] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera access denied',
        description: 'Please allow camera access to take photos',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setIsCaptured(true);
    stopCamera();
  };

  const retake = () => {
    setIsCaptured(false);
    startCamera();
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    stopCamera();
    setTimeout(() => startCamera(), 100);
  };

  const uploadPhoto = async () => {
    if (!canvasRef.current) return;

    setIsUploading(true);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          0.9
        );
      });

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'camera-photo.jpg');
      formData.append('userId', userId);
      formData.append('autoDelete', 'true');

      // Upload to server
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      toast({
        title: 'Photo uploaded',
        description: 'Your photo is ready to analyze',
      });

      onImageCaptured(data.url, data.path);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    setIsCaptured(false);
    onCancel?.();
  };

  if (!isActive && !isCaptured) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={startCamera}
        className="w-full"
      >
        <Camera className="mr-2 h-4 w-4" />
        Open Camera
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative rounded-lg overflow-hidden border bg-black">
        {/* Video preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-auto ${isCaptured ? 'hidden' : 'block'}`}
        />

        {/* Captured photo */}
        <canvas
          ref={canvasRef}
          className={`w-full h-auto ${isCaptured ? 'block' : 'hidden'}`}
        />

        {/* Camera controls overlay */}
        {isActive && !isCaptured && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={switchCamera}
              className="rounded-full"
            >
              <RotateCw className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={capturePhoto}
              className="rounded-full w-16 h-16 btn-gradient"
            >
              <Camera className="h-6 w-6" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={handleCancel}
              className="rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Captured photo controls */}
      {isCaptured && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={retake}
            disabled={isUploading}
            className="flex-1"
          >
            Retake
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={uploadPhoto}
            disabled={isUploading}
            className="flex-1 btn-gradient"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload & Analyze'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
