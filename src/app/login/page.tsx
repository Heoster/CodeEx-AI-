
'use client';

import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getAuth,
} from 'firebase/auth';
import {app, googleProvider} from '@/lib/firebase';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/use-auth';
import {useEffect, useState} from 'react';
import {Skeleton} from '@/components/ui/skeleton';
import {Eye, EyeOff, MessageSquare} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import {useToast} from '@/hooks/use-toast';
import {sendWelcomeEmail} from '@/lib/email';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
);

const getFirebaseAuthErrorMessage = (error: unknown): string => {
  const appCheckDebugSteps = "\n\nThis is often caused by a Firebase App Check configuration issue. Please verify the following:\n1. The reCAPTCHA v3 Site Key in your .env file (NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY) is correct and not a placeholder.\n2. Your domain (e.g., localhost) is whitelisted in your Firebase project: App Check -> Apps.\n3. If App Check enforcement is enabled for Authentication, ensure it's initializing correctly.";

  if (typeof error !== 'object' || error === null) {
    return 'An unknown error occurred. Please try again.';
  }

  const err = error as { code?: string; message?: string };

  // Prioritize App Check related errors as they are common and cryptic.
  if (
    (err.message && err.message.includes('INTERNAL ASSERTION FAILED')) ||
    String(error).includes('INTERNAL ASSERTION FAILED') ||
    err.code === 'auth/firebase-app-check-token-is-invalid' ||
    err.code === 'auth/network-request-failed' 
  ) {
    return `Authentication failed due to a security policy misconfiguration. ${appCheckDebugSteps}`;
  }
  
  if (!err.code) {
    return `An unknown authentication error occurred. ${appCheckDebugSteps}`;
  }
  
  switch (err.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in or use a different email.';
    case 'auth/weak-password':
      return 'Your password is too weak. It must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return ''; // Return an empty string to signify that this should be ignored.
    case 'auth/popup-blocked':
      return 'Pop-up blocked. Trying redirect authentication...';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for authentication. Please go to your Firebase project -> Authentication -> Settings -> Authorized domains, and add your domain.';
    default:
      return `An authentication error occurred. Please try again later. (Error: ${err.code})`;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const {user, loading} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {toast} = useToast();

  const [isNamePromptOpen, setIsNamePromptOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleAuthError = (error: unknown) => {
    console.error('Authentication Error:', error);
    const errorMessage = getFirebaseAuthErrorMessage(error);
    if (errorMessage) {
      setError(errorMessage);
    } else {
      // If the error message is empty, it&apos;s an ignored error (like popup closed)
      setError(null);
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null);
    const auth = getAuth(app);
    try {
      // First, try popup authentication
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if this is a new user
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      if (isNewUser && result.user.email && result.user.displayName) {
        const emailResult = await sendWelcomeEmail(result.user.email, result.user.displayName);
        if (emailResult.success) {
          toast({
            title: 'Welcome to CODEEX AI! 🎉',
            description: 'A welcome email has been sent to your inbox.',
          });
        }
      }
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      
      // If popup is blocked, automatically try redirect
      if (err.code === 'auth/popup-blocked') {
        try {
          setIsRedirecting(true);
          toast({
            title: 'Pop-up blocked',
            description: 'Redirecting to Google sign-in...',
          });
          await signInWithRedirect(auth, googleProvider);
          // Note: signInWithRedirect will redirect the page, so code after this won't execute
        } catch (redirectError: unknown) {
          setIsRedirecting(false);
          handleAuthError(redirectError);
        }
      } else {
        handleAuthError(error);
      }
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Welcome email will be sent after user sets their display name
      toast({
        title: 'Account Created! 🎉',
        description: 'Please enter your name to complete registration.',
      });
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Welcome email is sent on sign up, not sign in
    } catch (error: unknown) {
      handleAuthError(error);
    }
  };

  const handleSaveName = async () => {
    if (!newUserName.trim()) {
      setError('Please enter your name.');
      return;
    }
    const auth = getAuth(app);
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError('An error occurred. Please try logging in again.');
      return;
    }
    setIsSavingName(true);
    setError(null);
    try {
      await updateProfile(currentUser, {displayName: newUserName.trim()});

      // Send welcome email to new user
      if (currentUser.email) {
        const emailResult = await sendWelcomeEmail(currentUser.email, newUserName.trim());
        if (emailResult.success) {
          toast({
            title: 'Welcome to CODEEX AI! 🎉',
            description: 'A welcome email has been sent to your inbox.',
          });
        }
      }

      setIsNamePromptOpen(false);
    } catch (_error) {
      setError('Could not save your name. Please try again.');
    } finally {
      setIsSavingName(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      if (!user.displayName) {
        setIsNamePromptOpen(true);
      }
      // Don't auto-redirect - let user navigate manually or use a button
    }
  }, [user, loading]);

  // Handle redirect result from Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      const auth = getAuth(app);
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // Check if this is a new user
          const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
          if (isNewUser && result.user.email && result.user.displayName) {
            const emailResult = await sendWelcomeEmail(result.user.email, result.user.displayName);
            if (emailResult.success) {
              toast({
                title: 'Welcome to CODEEX AI! 🎉',
                description: 'A welcome email has been sent to your inbox.',
              });
            }
          }
        }
      } catch (error: unknown) {
        handleAuthError(error);
      }
    };

    handleRedirectResult();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton className="h-64 w-full max-w-md" />
      </div>
    );
  }

  // If user is already logged in, show a success message with navigation option
  if (user && user.displayName) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg text-center space-y-4">
          <div className="flex justify-center">
            <Image src="/favicon.ico" alt="CODEEX AI Logo" width={56} height={56} />
          </div>
          <h2 className="text-2xl font-bold">You&apos;re Already Signed In!</h2>
          <p className="text-muted-foreground">
            Welcome back, {user.displayName}!
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => router.push('/chat')} className="btn-gradient w-full">
              Go to Chat
            </Button>
            <Button 
              onClick={() => {
                const auth = getAuth(app);
                auth.signOut();
              }} 
              variant="outline" 
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-6">
        <div className="container mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:gap-8 rounded-lg md:grid-cols-2">
          {/* Left promo panel */}
          <div className="hidden flex-col justify-center gap-6 rounded-lg p-6 md:p-8 md:flex">
            <div>
              <h2 className="text-4xl font-extrabold">
                Welcome back to <span className="gradient-text">CODEEX AI</span>
              </h2>
              <p className="mt-3 max-w-lg text-lg text-muted-foreground">
                Smart assistants, instant code help, and visual problem solving —
                all in one place. Sign in to continue where you left off.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare />
              </div>
              <div>
                <h4 className="font-semibold">Conversational AI</h4>
                <p className="text-sm text-muted-foreground">Context-aware chats & multi-session support</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="infinity-animation" />
            </div>
          </div>

          {/* Right auth card */}
          <div className="mx-auto w-full max-w-md transform rounded-lg border bg-card p-6 md:p-8 shadow-lg">
            <div className="grid gap-2 text-center">
              <div className="mb-2 flex justify-center">
                <Image src="/favicon.ico" alt="CODEEX AI Logo" width={56} height={56} />
              </div>
              <h1 className="text-2xl font-bold">Sign in to your account</h1>
              <p className="text-sm text-muted-foreground">Fast, secure access to your chats and settings</p>
            </div>

            <div className="mt-6 grid gap-4">
              <Button 
                onClick={handleGoogleSignIn} 
                variant="outline" 
                className="w-full py-3"
                disabled={isRedirecting}
              >
                <GoogleIcon className="mr-3 h-5 w-5" />
                {isRedirecting ? 'Redirecting...' : 'Continue with Google'}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={async () => {
                    setError(null);
                    setIsRedirecting(true);
                    const auth = getAuth(app);
                    try {
                      await signInWithRedirect(auth, googleProvider);
                    } catch (error: unknown) {
                      setIsRedirecting(false);
                      handleAuthError(error);
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                  disabled={isRedirecting}
                >
                  Having trouble with pop-ups? Try redirect sign-in
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">Or use your email</span>
                </div>
              </div>

              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="relative grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type={isPasswordVisible ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                    {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>

                {error && <p className="whitespace-pre-wrap text-sm text-destructive">{error}</p>}

                <div className="flex items-center justify-between gap-2">
                  <Button type="submit" className="btn-gradient w-full py-2">Sign In</Button>
                  <Button type="button" variant="outline" className="w-full py-2" onClick={handleEmailSignUp}>Sign Up</Button>
                </div>
              </form>

              <div className="text-center mt-2 text-sm">
                <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot your password?</Link>
              </div>
            </div>

            <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="/privacy" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">CodeEx powered by Heoster.</p>
          </div>
        </div>
      </div>
      <Dialog open={isNamePromptOpen} onOpenChange={setIsNamePromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to CODEEX AI!</DialogTitle>
            <DialogDescription>
              Please enter your name. This will be displayed in your chat
              sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSaveName();
                  }
                }}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveName} disabled={isSavingName}>
              {isSavingName ? 'Saving...' : 'Save and Continue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
