'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
  type ReactNode,
} from 'react';
import {type User, onAuthStateChanged, getAuth} from 'firebase/auth';
import {app} from '@/lib/firebase';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import { SohamLoader } from '@/components/soham-loader';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// A wrapper for protected routes
function ProtectedRouteInner({children}: {children: ReactNode}) {
  const {user, loading} = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading || user) {
      return;
    }

    const queryString = searchParams?.toString() || '';
    const nextPath = `${pathname}${queryString ? `?${queryString}` : ''}`;
    router.replace(`/login?next=${encodeURIComponent(nextPath)}`);
  }, [loading, user, router, pathname, searchParams]);

  if (loading) {
    return <SohamLoader variant="overlay" label="Authenticating…" />;
  }

  if (!user) {
    return <SohamLoader variant="overlay" label="Redirecting…" />;
  }

  return <>{children}</>;
}

export function ProtectedRoute({children}: {children: ReactNode}) {
  return (
    <Suspense fallback={<SohamLoader variant="overlay" label="Loading…" />}>
      <ProtectedRouteInner>{children}</ProtectedRouteInner>
    </Suspense>
  );
}
