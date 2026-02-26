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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Label} from '@/components/ui/label';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import type {ReactNode} from 'react';
import type {Settings, Model} from '@/lib/types';
import {ModelSelector} from './model-selector';
import {MobileModelSelector} from './mobile-model-selector';
import {useIsMobile} from '@/hooks/use-mobile';
import {Switch} from '@/components/ui/switch';
import {useTheme} from 'next-themes';
import Link from 'next/link';
import {useState} from 'react';
import {ChevronDown, Sparkles, Palette, Volume2, Info} from 'lucide-react';

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
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            Customize your AI experience and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Info className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Model</CardTitle>
                <CardDescription>
                  Choose which AI model to use for responses
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                      onValueChange={(value) => {
                        console.log('[Settings] Model changed to:', value);
                        onSettingsChange({...settings, model: value as 'auto' | Model});
                      }}
                      isOpen={isMobileModelSelectorOpen}
                      onClose={() => setIsMobileModelSelectorOpen(false)}
                    />
                  </>
                ) : (
                  <ModelSelector
                    value={settings.model}
                    onValueChange={(value: 'auto' | Model) => {
                      console.log('[Settings] Model changed to:', value);
                      onSettingsChange({...settings, model: value});
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Style</CardTitle>
                <CardDescription>
                  Adjust how the AI communicates with you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="technical">Technical Level</Label>
                  <Select
                    value={settings.technicalLevel}
                    onValueChange={(value: Settings['technicalLevel']) =>
                      onSettingsChange({
                        ...settings,
                        technicalLevel: value,
                      })
                    }
                  >
                    <SelectTrigger id="technical" className="h-11">
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

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Theme</CardTitle>
                <CardDescription>
                  Choose your preferred color scheme
                </CardDescription>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Speech Settings
                </CardTitle>
                <CardDescription>
                  Configure text-to-speech output
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="speech">Enable Speech Output</Label>
                    <p className="text-sm text-muted-foreground">
                      Hear AI responses read aloud
                    </p>
                  </div>
                  <Switch
                    id="speech"
                    checked={settings.enableSpeech}
                    onCheckedChange={checked =>
                      onSettingsChange({...settings, enableSpeech: checked})
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice">Voice</Label>
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
                      <SelectItem value="Algenib">Algenib (Female)</SelectItem>
                      <SelectItem value="Achernar">Achernar (Female)</SelectItem>
                      <SelectItem value="Enceladus">Enceladus (Male)</SelectItem>
                      <SelectItem value="Heka">Heka (Male)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support</CardTitle>
                <CardDescription>
                  Get help and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">
                    For support or inquiries, please email us at:
                  </p>
                  <a
                    href="mailto:codeex@email.com"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  >
                    codeex@email.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal</CardTitle>
                <CardDescription>
                  Privacy and terms information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/privacy"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About CODEEX AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CodeEx powered by Heoster. An intelligent AI assistant designed to help you with coding, problem-solving, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
