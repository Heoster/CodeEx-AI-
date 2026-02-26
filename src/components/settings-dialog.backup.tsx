'use client';

import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import type {ReactNode} from 'react';
import type {Settings, Model} from '@/lib/types';
import {ModelSelector} from './model-selector';
import {MobileModelSelector} from './mobile-model-selector';
import {useIsMobile} from '@/hooks/use-mobile';
import {Switch} from '@/components/ui/switch';
import {Separator} from '@/components/ui/separator';
import {useTheme} from 'next-themes';
import Link from 'next/link';
import {useState} from 'react';
import {ChevronDown} from 'lucide-react';

interface SettingsDialogProps {
  children: ReactNode;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsDialog({
  children,
  settings,
  onSettingsChange,
}: SettingsDialogProps) {
  const {theme, setTheme} = useTheme();
  const isMobile = useIsMobile();
  const [isMobileModelSelectorOpen, setIsMobileModelSelectorOpen] = useState(false);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the AI&apos;s output and appearance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h3 className="text-sm font-medium">Content</h3>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right">
              AI Model
            </Label>
            <div className="col-span-3">
              {isMobile ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsMobileModelSelectorOpen(true)}
                  >
                    <span>{settings.model === 'auto' ? 'Auto (Smart Routing)' : settings.model}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <MobileModelSelector
                    value={settings.model}
                    onValueChange={(value) =>
                      onSettingsChange({...settings, model: value as 'auto' | Model})
                    }
                    isOpen={isMobileModelSelectorOpen}
                    onClose={() => setIsMobileModelSelectorOpen(false)}
                  />
                </>
              ) : (
                <ModelSelector
                  value={settings.model}
                  onValueChange={(value: 'auto' | Model) =>
                    onSettingsChange({...settings, model: value})
                  }
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tone" className="text-right">
              Tone
            </Label>
            <Select
              value={settings.tone}
              onValueChange={(value: Settings['tone']) =>
                onSettingsChange({...settings, tone: value})
              }
            >
              <SelectTrigger id="tone" className="col-span-3">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helpful">Helpful</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technical" className="text-right">
              Technical Level
            </Label>
            <Select
              value={settings.technicalLevel}
              onValueChange={(value: Settings['technicalLevel']) =>
                onSettingsChange({
                  ...settings,
                  technicalLevel: value,
                })
              }
            >
              <SelectTrigger id="technical" className="col-span-3">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <h3 className="text-sm font-medium">Appearance & Accessibility</h3>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme" className="col-span-3">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speech" className="text-right">
              Speech Output
            </Label>
            <Switch
              id="speech"
              checked={settings.enableSpeech}
              onCheckedChange={checked =>
                onSettingsChange({...settings, enableSpeech: checked})
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              Voice
            </Label>
            <Select
              value={settings.voice}
              onValueChange={(value: Settings['voice']) =>
                onSettingsChange({...settings, voice: value})
              }
              disabled={!settings.enableSpeech}
            >
              <SelectTrigger id="voice" className="col-span-3">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Algenib">Algenib (Female)</SelectItem>
                <SelectItem value="Achernar">Achernar (Female)</SelectItem>
                <SelectItem value="Enceladus">Enceladus (Male)</SelectItem>
                <SelectItem value="Heka">Heka (Male)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="space-y-4 pt-4">
          <div className="space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              For support or inquiries, please email us at{' '}
              <a
                href="mailto:codeex@email.com"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                codeex@email.com
              </a>
              .
            </p>
            <p className="text-sm text-muted-foreground">
              Read our{' '}
              <Link
                href="/privacy"
                className="font-medium text-primary underline-offset-4 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
