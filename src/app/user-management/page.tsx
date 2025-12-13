"use client";

import {useAuth} from '@/hooks/use-auth';
import {getAuth, updateProfile, signOut} from 'firebase/auth';
import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import { PageHeader } from '@/components/page-header';

export default function UserManagementPage() {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return <div className="p-4">Please sign in to manage your account.</div>;

  const auth = getAuth();

  const handleChangeDisplayName = async () => {
    const newName = window.prompt('Enter new display name', user.displayName || '');
    if (!newName) return;
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {displayName: newName});
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update display name.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageHeader 
        backLink="/chat" 
        backText="Back to Chat" 
        title="User Management"
      />
      <main className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
          <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-medium">{user.displayName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>

        <div className="flex gap-2">
          <Button onClick={handleChangeDisplayName} disabled={loading}>
            Change display name
          </Button>
          <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
        </div>
        </div>
      </main>
    </div>
  );
}
