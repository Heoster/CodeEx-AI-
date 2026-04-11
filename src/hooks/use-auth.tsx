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
import { Skeleton } from '@/components/ui/skeleton';

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
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
        <Skeleton className="h-12 w-[220px]" />
        <Skeleton className="h-4 w-[180px]" />
      </div>
    );
  }

  return <>{children}</>;
}

export function ProtectedRoute({children}: {children: ReactNode}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      }
    >
      <ProtectedRouteInner>{children}</ProtectedRouteInner>
    </Suspense>
  );
}
