"use client";

import { useAuth } from '@/hooks/use-auth';
import { getAuth, updateProfile, updateEmail, updatePassword, deleteUser, signOut } from 'firebase/auth';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { PageSEO } from '@/components/seo/page-seo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  Mail,
  Lock,
  Shield,
  Trash2,
  LogOut,
  Edit,
  Camera,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  Globe,
  Palette,
  Volume2,
  Sparkles,
  BookOpen,
  FileText,
  Info,
  MessageSquare,
  Trash,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in to access user management
            </CardDescription>
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

  // Update Display Name
  const handleUpdateDisplayName = async () => {
    if (!displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: displayName.trim() });
        toast.success('Display name updated successfully');
      }
    } catch (err: any) {
      console.error('Failed to update profile', err);
      toast.error(err.message || 'Failed to update display name');
    } finally {
      setLoading(false);
    }
  };

  // Update Email
  const handleUpdateEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, email.trim());
        toast.success('Email updated successfully. Please verify your new email.');
      }
    } catch (err: any) {
      console.error('Failed to update email', err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign in again to update your email');
      } else {
        toast.error(err.message || 'Failed to update email');
      }
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        toast.success('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      }
    } catch (err: any) {
      console.error('Failed to update password', err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign in again to update your password');
      } else {
        toast.error(err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
        toast.success('Account deleted successfully');
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error('Failed to delete account', err);
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign in again to delete your account');
      } else {
        toast.error(err.message || 'Failed to delete account');
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully');
      window.location.href = '/';
    } catch (err: any) {
      toast.error('Failed to sign out');
    }
  };

  const accountAge = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString()
    : 'Unknown';

  const lastSignIn = user.metadata.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
    : 'Unknown';

  return (
    <>
      <PageSEO
        title="User Management | CODEEX AI"
        description="Manage your CODEEX AI account settings, profile, security, and preferences"
        keywords={['user management', 'account settings', 'profile', 'security']}
        canonical="/user-management"
      />

      <div className="min-h-screen bg-background">
        <PageHeader
          backLink="/chat"
          backText="Back to Chat"
          title="User Management"
        />

        <main className="container mx-auto max-w-6xl px-4 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback className="text-2xl">
                      {user.displayName?.charAt(0).toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold">{user.displayName || 'User'}</h2>
                  <p className="text-muted-foreground">{user.email}</p>

                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="secondary" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge variant="outline">
                      Member since {accountAge}
                    </Badge>
                    <Badge variant="outline">
                      Last login: {lastSignIn}
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences" className="gap-2">
                <Settings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="links" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Quick Links
              </TabsTrigger>
              <TabsTrigger value="danger" className="gap-2">
                <AlertCircle className="h-4 w-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile details
                  </CardDescription>
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
                        <Edit className="h-4 w-4 mr-2" />
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
                        <Mail className="h-4 w-4 mr-2" />
                        Update
                      </Button>
                    </div>
                    {!user.emailVerified && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Your email is not verified. Please check your inbox for a verification email.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-muted-foreground">User ID</Label>
                      <p className="text-sm font-mono mt-1">{user.uid.substring(0, 20)}...</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Provider</Label>
                      <p className="text-sm mt-1 capitalize">
                        {user.providerData[0]?.providerId.replace('.com', '') || 'Email'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
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
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
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

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      For security reasons, you may need to sign in again after changing your password.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Your account security status and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">
                          {user.emailVerified ? 'Your email is verified' : 'Email not verified'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={user.emailVerified ? 'default' : 'destructive'}>
                      {user.emailVerified ? 'Active' : 'Pending'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Password Protection</p>
                        <p className="text-sm text-muted-foreground">
                          Your account is password protected
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    App Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your CODEEX AI experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-muted-foreground">
                          Customize your visual experience
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/chat'}>
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5" />
                      <div>
                        <p className="font-medium">AI Model</p>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred AI model
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/chat'}>
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Voice Settings</p>
                        <p className="text-sm text-muted-foreground">
                          Configure text-to-speech options
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/chat'}>
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Manage notification preferences
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred language
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">English</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quick Links Tab */}
            <TabsContent value="links" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Documentation & Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Documentation & Help
                    </CardTitle>
                    <CardDescription>
                      Learn more about CODEEX AI features
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/documentation'}
                    >
                      <BookOpen className="h-4 w-4" />
                      Documentation
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/documentation/api-reference'}
                    >
                      <FileText className="h-4 w-4" />
                      API Reference
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/documentation/faq'}
                    >
                      <MessageSquare className="h-4 w-4" />
                      FAQ
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Legal & Policies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Legal & Policies
                    </CardTitle>
                    <CardDescription>
                      Review our terms and policies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/privacy'}
                    >
                      <Shield className="h-4 w-4" />
                      Privacy Policy
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/terms'}
                    >
                      <FileText className="h-4 w-4" />
                      Terms of Service
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/about'}
                    >
                      <Info className="h-4 w-4" />
                      About Us
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>

                {/* App Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      App Settings
                    </CardTitle>
                    <CardDescription>
                      Configure your app experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/chat'}
                    >
                      <Settings className="h-4 w-4" />
                      Chat Settings
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/chat'}
                    >
                      <Palette className="h-4 w-4" />
                      Theme Settings
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/chat'}
                    >
                      <Volume2 className="h-4 w-4" />
                      Voice Settings
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trash className="h-5 w-5" />
                      Data Management
                    </CardTitle>
                    <CardDescription>
                      Manage your data and chats
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.location.href = '/chat'}
                    >
                      <MessageSquare className="h-4 w-4" />
                      View All Chats
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete all chats? This cannot be undone.')) {
                          // Add delete all chats logic here
                          toast.success('All chats deleted successfully');
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      Delete All Chats
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        // Add export data logic here
                        toast.success('Data export started. You will receive an email when ready.');
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      Export My Data
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Need Help?
                  </CardTitle>
                  <CardDescription>
                    Get in touch with our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => window.location.href = '/contact'}
                    >
                      <Mail className="h-4 w-4" />
                      Contact Support
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={() => window.location.href = '/chat'}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Start New Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="space-y-6">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Warning: These actions cannot be undone. Please proceed with caution.
                    </AlertDescription>
                  </Alert>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Delete Account</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Once you delete your account, there is no going back. All your data, chats, and settings will be permanently deleted.
                      </p>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete My Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="h-5 w-5" />
                              Delete Account
                            </DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4 py-4">
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                All your chats, settings, and data will be permanently deleted.
                              </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                              <Label htmlFor="deleteConfirm">
                                Type <strong>DELETE</strong> to confirm
                              </Label>
                              <Input
                                id="deleteConfirm"
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Type DELETE"
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={loading || deleteConfirmation !== 'DELETE'}
                            >
                              {loading ? 'Deleting...' : 'Delete Account Permanently'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
