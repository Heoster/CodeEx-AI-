'use client';

import type {ReactNode} from 'react';
import {useState} from 'react';
import Link from 'next/link';
import {getAuth, signOut} from 'firebase/auth';
import {useTheme} from 'next-themes';
import {useAuth} from '@/hooks/use-auth';
import {useIsMobile} from '@/hooks/use-mobile';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {ModelSelector} from './model-selector';
import {MobileModelSelector} from './mobile-model-selector';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Separator} from '@/components/ui/separator';
import {Switch} from '@/components/ui/switch';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import type {Settings, Model} from '@/lib/types';
import {
  ChevronDown,
  LogOut,
  Monitor,
  Palette,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  UserCircle2,
  Volume2,
} from 'lucide-react';

interface SettingsDialogProps {
  children?: ReactNode;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface QuickSettingsPopoverProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onOpenFullSettings: () => void;
}

function VoiceSettingsCard({
  settings,
  onSettingsChange,
}: {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Voice
        </CardTitle>
        <CardDescription>Control speech output and voice selection.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div className="space-y-1">
            <Label htmlFor="speech-enabled">Enable speech output</Label>
            <p className="text-sm text-muted-foreground">Read assistant replies aloud after each response.</p>
          </div>
          <Switch
            id="speech-enabled"
            checked={settings.enableSpeech}
            onCheckedChange={(checked) => onSettingsChange({...settings, enableSpeech: checked})}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="voice">Voice preset</Label>
          <Select
            value={settings.voice}
            onValueChange={(value: Settings['voice']) =>
              onSettingsChange({...settings, voice: value})
            }
            disabled={!settings.enableSpeech}
          >
            <SelectTrigger id="voice" className="h-11">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="troy">Troy</SelectItem>
              <SelectItem value="diana">Diana</SelectItem>
              <SelectItem value="hannah">Hannah</SelectItem>
              <SelectItem value="autumn">Autumn</SelectItem>
              <SelectItem value="austin">Austin</SelectItem>
              <SelectItem value="daniel">Daniel</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Groq Orpheus TTS voice selection.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickSettingsPopover({
  settings,
  onSettingsChange,
  onOpenFullSettings,
}: QuickSettingsPopoverProps) {
  const {theme, setTheme} = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="sr-only">Quick settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-4">
        <div className="space-y-1">
          <h3 className="font-semibold">Quick Settings</h3>
          <p className="text-sm text-muted-foreground">Adjust the most-used chat controls without leaving the conversation.</p>
        </div>
        <Separator />

        <div className="space-y-2">
          <Label htmlFor="quick-theme">Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="quick-theme" className="h-10">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quick-tone">Tone</Label>
          <Select
            value={settings.tone}
            onValueChange={(value: Settings['tone']) =>
              onSettingsChange({...settings, tone: value})
            }
          >
            <SelectTrigger id="quick-tone" className="h-10">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="helpful">Helpful</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-xl border p-3">
          <div className="space-y-0.5">
            <p className="text-sm font-medium">Speech output</p>
            <p className="text-xs text-muted-foreground">Enable assistant voice replies.</p>
          </div>
          <Switch
            checked={settings.enableSpeech}
            onCheckedChange={(checked) => onSettingsChange({...settings, enableSpeech: checked})}
          />
        </div>

        <div className="rounded-xl border p-3 text-sm">
          <p className="font-medium">Current model</p>
          <p className="mt-1 text-muted-foreground">
            {settings.model === 'auto' ? 'Auto smart routing' : settings.model}
          </p>
        </div>

        <Button onClick={onOpenFullSettings} className="w-full gap-2">
          <Settings2 className="h-4 w-4" />
          Open Settings
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export function SettingsDialog({
  children,
  settings,
  onSettingsChange,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const {theme, setTheme} = useTheme();
  const isMobile = useIsMobile();
  const {user} = useAuth();
  const [isMobileModelSelectorOpen, setIsMobileModelSelectorOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(getAuth());
    onOpenChange?.(false);
  };

  const content = (
    <DialogContent className="sm:max-w-[760px] max-h-[88vh] overflow-y-auto">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-2xl">Settings</DialogTitle>
        <DialogDescription>
          One place for AI behavior, voice, appearance, and user account controls.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai" className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Volume2 className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Look
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-2">
            <UserCircle2 className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="mt-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model selection</CardTitle>
              <CardDescription>Choose a model manually or stay on auto-routing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMobile ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-11"
                    onClick={() => setIsMobileModelSelectorOpen(true)}
                  >
                    <span className="truncate">
                      {settings.model === 'auto' ? 'Auto (Smart Routing)' : settings.model}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2 shrink-0" />
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response behavior</CardTitle>
              <CardDescription>Shape how SOHAM responds to your questions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={settings.tone}
                  onValueChange={(value: Settings['tone']) =>
                    onSettingsChange({...settings, tone: value})
                  }
                >
                  <SelectTrigger id="tone" className="h-11">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="helpful">Helpful</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technical-level">Technical level</Label>
                <Select
                  value={settings.technicalLevel}
                  onValueChange={(value: Settings['technicalLevel']) =>
                    onSettingsChange({...settings, technicalLevel: value})
                  }
                >
                  <SelectTrigger id="technical-level" className="h-11">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="mt-5">
          <VoiceSettingsCard settings={settings} onSettingsChange={onSettingsChange} />
        </TabsContent>

        <TabsContent value="appearance" className="mt-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Theme
              </CardTitle>
              <CardDescription>Choose the color mode that fits your device and workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme" className="h-11">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-5 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User profile</CardTitle>
              <CardDescription>Manage your session and account-related actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="flex items-center gap-3 rounded-2xl border p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.displayName || 'SOHAM User'}</p>
                    <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Sign in to access account actions.</p>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <Link href="/account" className="w-full">
                  <Button variant="outline" className="w-full">Open Account Page</Button>
                </Link>
                <Link href="/account-settings" className="w-full">
                  <Button variant="outline" className="w-full">Open Advanced Settings</Button>
                </Link>
                <Link href="/privacy" className="w-full" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">Privacy Policy</Button>
                </Link>
                <a href="mailto:codeex@email.com" className="w-full">
                  <Button variant="outline" className="w-full">Contact Support</Button>
                </a>
              </div>

              {user && (
                <Button variant="destructive" className="w-full gap-2" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      {content}
    </Dialog>
  );
}
