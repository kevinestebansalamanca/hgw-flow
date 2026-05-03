import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Ctx = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

const LOCKOUT_KEY = "hgw_login_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => checkAdmin(sess.user.id), 0);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) checkAdmin(session.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const checkAdmin = async (uid: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    setIsAdmin(!!data?.some((r) => r.role === "super_admin" || r.role === "admin"));
  };

  const signIn = async (email: string, password: string) => {
    // Rate limiting
    const raw = localStorage.getItem(LOCKOUT_KEY);
    const state = raw ? JSON.parse(raw) : { count: 0, until: 0 };
    if (state.until && state.until > Date.now()) {
      const mins = Math.ceil((state.until - Date.now()) / 60000);
      return { error: `Demasiados intentos. Intenta de nuevo en ${mins} min.` };
    }

    // Bootstrap admin on first sign-in attempt with the seed email
    try {
      await supabase.functions.invoke("bootstrap-admin");
    } catch {}

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const next = { count: state.count + 1, until: 0 };
      if (next.count >= MAX_ATTEMPTS) next.until = Date.now() + LOCKOUT_MS;
      localStorage.setItem(LOCKOUT_KEY, JSON.stringify(next));
      return { error: error.message };
    }
    localStorage.removeItem(LOCKOUT_KEY);
    return {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
