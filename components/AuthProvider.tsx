"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getMe, login, register, loginWithGoogle, logout, getSubscriptionStatus } from "@/lib/api";
import FeedbackModal from "./FeedbackModal";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  provider: string;
  plan: "free" | "monthly" | "yearly";
  is_premium: boolean;
  premium_until: string | null;
  created_at: string | null;
  last_login_at: string | null;
  total_payments: number;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  // Modal control
  openLogin: () => void;
  openUpgrade: () => void;
  showLoginModal: boolean;
  showUpgradeModal: boolean;
  setShowLoginModal: (v: boolean) => void;
  setShowUpgradeModal: (v: boolean) => void;
  loginMessage: { title: string; subtitle: string } | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ title: string; subtitle: string } | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const me = await getMe();
      if (me) {
        // Also fetch latest subscription status
        const sub = await getSubscriptionStatus();
        setUser({ ...me, is_premium: sub?.is_premium ?? me.is_premium });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  // This lets any tool page trigger login/upgrade modals without importing useAuth
  useEffect(() => {
    const onOpenLogin = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.title) {
        setLoginMessage(customEvent.detail);
      } else {
        setLoginMessage(null);
      }
      setShowLoginModal(true);
    };
    const onOpenUpgrade = () => setShowUpgradeModal(true);
    const onOpenFeedback = () => setShowFeedbackModal(true);
    window.addEventListener("eatbit:open-login", onOpenLogin);
    window.addEventListener("eatbit:open-upgrade", onOpenUpgrade);
    window.addEventListener("eatbit:ask-feedback", onOpenFeedback);
    return () => {
      window.removeEventListener("eatbit:open-login", onOpenLogin);
      window.removeEventListener("eatbit:open-upgrade", onOpenUpgrade);
      window.removeEventListener("eatbit:ask-feedback", onOpenFeedback);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await login(email, password);
    await refreshUser();
  };

  const signUp = async (name: string, email: string, password: string) => {
    await register(name, email, password);
    await refreshUser();
  };

  const signInWithGoogle = async (idToken: string) => {
    await loginWithGoogle(idToken);
    await refreshUser();
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isPremium: user?.is_premium ?? false,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshUser,
        openLogin: () => setShowLoginModal(true),
        openUpgrade: () => setShowUpgradeModal(true),
        showLoginModal,
        showUpgradeModal,
        setShowLoginModal,
        setShowUpgradeModal,
        loginMessage,
      }}
    >
      {children}
      {showFeedbackModal && (
        <FeedbackModal onClose={() => setShowFeedbackModal(false)} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
