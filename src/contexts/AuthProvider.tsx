import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getProfile } from '../api/userApi';
import type { Profile } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  reloadProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true, reloadProfile: async () => {} });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const reloadProfile = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    reloadProfile();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      reloadProfile();
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  // Redirect nếu chưa đăng nhập và không ở trang login/register
  useEffect(() => {
    if (!loading && !user && !['/login', '/register'].includes(location.pathname)) {
      navigate('/login');
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, reloadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export function useAuth() { return useContext(AuthContext); }
