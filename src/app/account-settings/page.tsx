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
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function AccountSettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showReauthDialog, setShowReauthDialog] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<'email' | 'password' | 'delete' | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access account settings</CardDescription>
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
        title="Account Settings | CODEEX AI"
        description="Manage your CODEEX AI account settings, security, and preferences"
        keywords={['account settings', 'security', 'profile']}
        canonical="/account-settings"
      />

      <div className="min-h-screen bg-background">
        <PageHeader
          backLink="/user-management"
          backText="Back to User Management"
          title="Account Settings"
        />

        <main className="container mx-auto max-w-4xl px-4 py-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="danger">
                <AlertCircle className="h-4 w-4 mr-2" />
                Danger Zone
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
                </CardContent>
              </Card>
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

              <Card>
                <CardHeader>
                  <CardTitle>Email Verification</CardTitle>
                  <CardDescription>Verify your email for account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {user.emailVerified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Verified
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              Not Verified
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {!user.emailVerified && (
                      <Button
                        variant="outline"
                        onClick={handleSendVerification}
                        disabled={loading}
                      >
                        Send Verification
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="space-y-6">
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
