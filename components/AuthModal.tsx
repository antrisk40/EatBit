"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "@/components/AuthProvider";
import { useGoogleLogin } from "@react-oauth/google";
import { resendVerification } from "@/lib/api";

type Tab = "login" | "register";
type ModalState = "form" | "check-email";

export default function AuthModal() {
  const { showLoginModal, setShowLoginModal, signIn, signUp, signInWithGoogle, refreshUser } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [modalState, setModalState] = useState<ModalState>("form");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredPassword, setRegisteredPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);
  const [error, setError] = useState("");

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setGoogleLoading(true);
      setError("");
      try {
        await signInWithGoogle(codeResponse.code);
        setShowLoginModal(false);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Google sign-in failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError("Google sign-in was cancelled or failed. Please try again.");
    },
  });

  if (!showLoginModal) return null;

  const reset = () => { setName(""); setEmail(""); setPassword(""); setOtp(""); setError(""); setModalState("form"); setResendSent(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (tab === "login") {
        await signIn(email, password);
        setShowLoginModal(false);
        reset();
      } else {
        await signUp(name, email, password);
        // signUp now returns { message, email } — show check-email state
        setRegisteredEmail(email);
        setRegisteredPassword(password);
        setModalState("check-email");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      // If unverified, show helpful message with option to resend
      if (msg.includes("verify your email")) {
        setRegisteredEmail(email);
        setRegisteredPassword(password);
        setError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerification(registeredEmail, registeredPassword);
      setResendSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => { setShowLoginModal(false); reset(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

            {/* Close */}
            <button
              onClick={() => { setShowLoginModal(false); reset(); }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <FaTimes />
            </button>

            {/* ── Check Email State ─────────────────────────────────── */}
            {modalState === "check-email" ? (
              <div className="p-8 relative z-10 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <FaEnvelope className="text-green-400 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Verify your email</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-semibold text-foreground mb-4">{registeredEmail}</p>


                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setError("");
                  try {
                    const { verifyOtp } = await import("@/lib/api");
                    await verifyOtp(registeredEmail, otp);
                    await refreshUser();
                    setShowLoginModal(false);
                    reset();
                  } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : "Invalid or expired code");
                  } finally { setLoading(false); }
                }} className="mb-6 space-y-4">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </button>
                </form>

                {resendSent ? (
                  <p className="flex items-center justify-center gap-2 text-green-400 text-sm font-semibold">
                    <FaCheckCircle /> Code resent! Check your inbox or spam.
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-60"
                  >
                    <FaPaperPlane className="text-xs" />
                    {resendLoading ? "Sending..." : "Resend code"}
                  </button>
                )}
                {error && <p className="text-red-400 text-xs mt-3">{error}</p>}

                <button
                  onClick={() => { setModalState("form"); setTab("login"); reset(); }}
                  className="mt-4 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              /* ── Login / Register Form ─────────────────────────── */
              <div className="p-8 relative z-10">
                <h2 className="text-2xl font-bold text-center mb-1 text-foreground">
                  {tab === "login" ? "Welcome back" : "Create account"}
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {tab === "login" ? "Sign in to download and save your work" : "Free account — start downloading instantly"}
                </p>

                {/* Tabs */}
                <div className="flex bg-muted rounded-lg p-1 mb-6">
                  {(["login", "register"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); reset(); }}
                      className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                        tab === t ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "login" ? "Sign In" : "Sign Up"}
                    </button>
                  ))}
                </div>

                {/* Google OAuth */}
                <button
                  onClick={() => googleLogin()}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <svg className="animate-spin w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <FaGoogle className="text-red-400" />
                  )}
                  {googleLoading ? "Signing in…" : "Continue with Google"}
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {tab === "register" && (
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Password (min 8 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-10 py-3 bg-muted border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPass ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {error && (
                    <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg py-2 px-3">
                      <p>{error}</p>
                      {/* Resend link if unverified error */}
                      {error.includes("verify your email") && registeredEmail && (
                        <button
                          type="button"
                          onClick={async () => {
                            setResendLoading(true);
                            try {
                              await resendVerification(registeredEmail, registeredPassword || password);
                              setRegisteredPassword(password);
                              setModalState("check-email");
                            } catch { /* ignore */ } finally { setResendLoading(false); }
                          }}
                          className="mt-1 text-orange-400 underline hover:no-underline"
                        >
                          {resendLoading ? "Sending…" : "Resend verification email →"}
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


