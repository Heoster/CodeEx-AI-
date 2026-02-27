'use client';

import { useAuth } from '@/hooks/use-auth';
import { getAuth, updateProfile, updateEmail, updatePassword, deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { PageSEO } from '@/components/seo/page-seo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Lock,
  Shield,
  Trash2,
  LogOut,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  Image,
  Video,
  Search,
  Mic,
  Volume2,
  MessageSquare,
  Zap,
  Settings as SettingsIcon,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Settings } from '@/lib/types';

const defaultSettings: Settings = {
  model: 'auto',
  tone: 'helpful',
  technicalLevel: 'intermediate',
  enableSpeech: false,
  voice: 'troy',
};

export default function AccountPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showReauthDialog, setShowReauthDialog] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<'email' | 'password' | 'delete' | null>(null);

  // Settings from localStorage
  const [settings, setSettings] = useLocalStorage<Settings>(
    user?.uid ? `${user.uid}_settings` : 'guest_settings',
    defaultSettings
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const auth = getAuth();

  const features = [
    {
      icon: Sparkles,
      title: 'Multi-Model AI',
      description: 'Access Groq, Google Gemini, Cerebras, and HuggingFace models',
      status: 'active',
    },
    {
      icon: Image,
      title: 'Image Generation',
      description: 'SOHAM pipeline with HuggingFace FLUX.1-schnell',
      status: 'active',
    },
    {
      icon: Video,
      title: 'Video Generation',
      description: 'Google Veo 3.1 for AI video creation',
      status: 'active',
    },
    {
      icon: Search,
      title: 'Web Search',
      description: 'Real-time web search',
      status: 'planned',
    },
    {
      icon: Mic,
      title: 'Speech-to-Text',
      description: 'Groq Whisper V3 Turbo',
      status: 'active',
    },
    {
      icon: Volume2,
      title: 'Text-to-Speech',
      description: 'Groq Orpheus TTS with 6 voices',
      status: 'active',
    },
    {
      icon: MessageSquare,
      title: 'Smart Intent Detection',
      description: 'Automatic routing',
      status: 'active',
    },
    {
      icon: Zap,
      title: 'Memory System',
      description: 'Context-aware conversations',
      status: 'beta',
    }
  ];

  const handleReauthenticate = async () => {
    if (!reauthPassword || !auth.currentUser?.email) {
      toast.error('Please enter your password');
      return false;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, reauthPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      setReauthPassword('');
      setShowReauthDialog(false);
      return true;
    } catch (err: any) {
      toast.error('Incorrect password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: displayName.trim() });
        toast.success('Display name updated');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update display name');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setPendingAction('email');
    setShowReauthDialog(true);
  };

  const executeEmailUpdate = async () => {
    const success = await handleReauthenticate();
    if (!success) return;

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, email.trim());
        toast.success('Email updated. Please verify your new email.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update email');
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setPendingAction('password');
    setShowReauthDialog(true);
  };

  const executePasswordUpdate = async () => {
    const success = await handleReauthenticate();
    if (!success) return;

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Password updated');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSendVerification = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email sent');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setPendingAction('delete');
    setShowReauthDialog(true);
  };

  const executeAccountDeletion = async () => {
    const success = await handleReauthenticate();
    if (!success) return;

    setLoading(true);
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        toast.success('Account deleted');
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
      setPendingAction(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out');
      window.location.href = '/';
    } catch (err: any) {
      toast.error('Failed to sign out');
    }
  };

  const handleDialogAction = () => {
    if (pendingAction === 'email') executeEmailUpdate();
    else if (pendingAction === 'password') executePasswordUpdate();
    else if (pendingAction === 'delete') executeAccountDeletion();
  };

  return (
    <>
      <PageSEO
        title="Account | CODEEX AI"
        description="Manage your CODEEX AI account, settings, and preferences"
        keywords={['account', 'settings', 'profile', 'security']}
        canonical="/account"
      />

      <div className="min-h-screen bg-background">
        <PageHeader
          backLink="/chat"
          backText="Back to Chat"
          title="Account"
        />

        <main className="container mx-auto max-w-6xl px-4 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                  <AvatarFallback className="text-2xl">
                    {user.displayName?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{user.displayName || 'User'}</h2>
                  <p className="text-muted-foreground">{user.email}</p>

                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge variant="outline">
                      Member since {new Date(user.metadata.creationTime!).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="features">
                <Sparkles className="h-4 w-4 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="flex gap-2">
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                      />
                      <Button
                        onClick={handleUpdateDisplayName}
                        disabled={loading || displayName === user.displayName}
                      >
                        Update
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                      <Button
                        onClick={handleUpdateEmail}
                        disabled={loading || email === user.email}
                      >
                        Update
                      </Button>
                    </div>
                    {!user.emailVerified && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                          <span>Your email is not verified</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSendVerification}
                            disabled={loading}
                          >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Verification'}
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">User ID</p>
                      <p className="text-sm font-mono">{user.uid.substring(0, 20)}...</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Account Created</p>
                      <p className="text-sm">{new Date(user.metadata.creationTime!).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Sign In</p>
                      <p className="text-sm">{new Date(user.metadata.lastSignInTime!).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize your visual experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
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
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Voice Settings
                  </CardTitle>
                  <CardDescription>Configure text-to-speech output</CardDescription>
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
                        setSettings({...settings, enableSpeech: checked})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="voice">Voice</Label>
                    <Select
                      value={settings.voice}
                      onValueChange={(value: Settings['voice']) =>
                        setSettings({...settings, voice: value})
                      }
                      disabled={!settings.enableSpeech}
                    >
                      <SelectTrigger id="voice" className="h-11">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="troy">Troy (Balanced)</SelectItem>
                        <SelectItem value="diana">Diana (Professional)</SelectItem>
                        <SelectItem value="hannah">Hannah (Warm)</SelectItem>
                        <SelectItem value="autumn">Autumn (Gentle)</SelectItem>
                        <SelectItem value="austin">Austin (Energetic)</SelectItem>
                        <SelectItem value="daniel">Daniel (Commanding)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Powered by Groq Orpheus TTS
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Preferences</CardTitle>
                  <CardDescription>Customize AI behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Response Tone</Label>
                    <Select
                      value={settings.tone}
                      onValueChange={(value: Settings['tone']) =>
                        setSettings({...settings, tone: value})
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
                        setSettings({...settings, technicalLevel: value})
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

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <feature.icon className="h-8 w-8 text-primary" />
                        <Badge variant={feature.status === 'active' ? 'default' : feature.status === 'beta' ? 'secondary' : 'outline'}>
                          {feature.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <Button
                    onClick={handleUpdatePassword}
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Sign Out</CardTitle>
                  <CardDescription>Sign out of your account on this device</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={handleSignOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Delete Account</CardTitle>
                  <CardDescription>
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Warning: This will permanently delete your account, all chats, and settings.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirmation">
                      Type <span className="font-bold">DELETE</span> to confirm
                    </Label>
                    <Input
                      id="deleteConfirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="Type DELETE"
                    />
                  </div>

                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmation !== 'DELETE'}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account Permanently
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Re-authentication Dialog */}
      <Dialog open={showReauthDialog} onOpenChange={setShowReauthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Password</DialogTitle>
            <DialogDescription>
              For security, please enter your current password to continue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reauthPassword">Current Password</Label>
              <Input
                id="reauthPassword"
                type="password"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                placeholder="Enter your current password"
                onKeyDown={(e) => e.key === 'Enter' && handleDialogAction()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReauthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogAction} disabled={loading || !reauthPassword}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
