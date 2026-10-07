/**
 * EatBit API client — auth, premium plans, download gating
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://api.eatbit.in";

export type PlanType = "free" | "monthly" | "yearly" | "pro_monthly" | "pro_yearly";

export interface PlanOption {
  plan: PlanType;
  label: string;
  price_inr: number;
  duration_days: number;
  badge: string | null;
}

export interface PaymentRecord {
  order_id: string;
  payment_id: string;
  plan: PlanType;
  amount_inr: number;
  duration_days: number;
  paid_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  provider: string;
  plan: PlanType;
  is_premium: boolean;
  premium_until: string | null;
  created_at: string | null;
  last_login_at: string | null;
  total_payments: number;
  payment_history: PaymentRecord[];
}

export interface SubscriptionStatus {
  plan: PlanType;
  is_premium: boolean;
  premium_until: string | null;
  days_remaining: number | null;
  available_plans: PlanOption[];
}

// ── Token storage ─────────────────────────────────────────────────────────────

const KEYS = { access: "eb_access_token", refresh: "eb_refresh_token" };

export const tokenStore = {
  getAccess: () =>
    typeof window !== "undefined" ? localStorage.getItem(KEYS.access) : null,
  getRefresh: () =>
    typeof window !== "undefined" ? localStorage.getItem(KEYS.refresh) : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem(KEYS.access, access);
    localStorage.setItem(KEYS.refresh, refresh);
  },
  clear: () => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
  },
};

const getAnonId = () => {
  if (typeof window === "undefined") return "unknown";
  let id = localStorage.getItem("eb_anon_id");
  if (!id) {
    id = "anon_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("eb_anon_id", id);
  }
  return id;
};

// ── Base fetch with auto-refresh ──────────────────────────────────────────────

async function apiFetch(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<Response> {
  const token = tokenStore.getAccess();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Anonymous-Id": getAnonId(),
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch(path, options, false);
    tokenStore.clear();
    
    // Dispatch a custom event so the React AuthContext can show the login modal
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth_unauthorized"));
    }
  }
  return res;
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    tokenStore.set(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(
  name: string, email: string, password: string, phone?: string
) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Registration failed");
  // Backend now returns { message, email, email_sent } — no token until verified
  return data as { message: string; email: string; email_sent: boolean };
}

export async function verifyOtp(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "OTP verification failed");
  tokenStore.set(data.access_token, data.refresh_token);
  return data;
}

export async function resendVerification(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to resend verification");
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Login failed");
  tokenStore.set(data.access_token, data.refresh_token);
  return data;
}

export async function loginWithGoogle(idToken: string) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: idToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Google login failed");
  tokenStore.set(data.access_token, data.refresh_token);
  return data;
}

export function logout() { tokenStore.clear(); }

export async function getMe(): Promise<User | null> {
  const res = await apiFetch("/auth/me");
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfile(updates: { name?: string; phone?: string }) {
  const res = await apiFetch("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Update failed");
  return data as User;
}

// ── Plans & Subscription ──────────────────────────────────────────────────────

/** Fetches available plans (no auth required) */
export async function getAvailablePlans(): Promise<PlanOption[]> {
  const res = await fetch(`${API_BASE}/payments/plans`);
  if (!res.ok) return [];
  return res.json();
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus | null> {
  const res = await apiFetch("/payments/status");
  if (!res.ok) return null;
  return res.json();
}

/**
 * Creates a Razorpay order for the chosen plan.
 * @param plan "monthly" | "yearly"
 */
export async function createPremiumOrder(plan: PlanType) {
  const res = await apiFetch("/payments/create-order", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Failed to create order");
  return data; // { order_id, amount, currency, plan, razorpay_key_id }
}

export async function verifyPremiumPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: PlanType;
}): Promise<SubscriptionStatus> {
  const res = await apiFetch("/payments/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail ?? "Payment verification failed");
  return data;
}


// ── Limits (works for anonymous + logged in) ──────────────────────────────────

export interface UsageLimits {
  tier: "anonymous" | "free" | "pro";
  ads: boolean;
  downloads: { used: number; limit: number; remaining: number; unlimited: boolean };
  bulk:      { used: number; limit: number; remaining: number; unlimited: boolean };
}

export async function checkLimits(): Promise<UsageLimits> {
  // Works without auth — anonymous tracked by IP server-side
  const res = await apiFetch("/tools/limits");
  if (!res.ok) {
    // Fallback: assume anonymous with 1 download
    return {
      tier: "anonymous", ads: true,
      downloads: { used: 0, limit: 1, remaining: 1, unlimited: false },
      bulk:      { used: 0, limit: 0, remaining: 0, unlimited: false },
    };
  }
  return res.json();
}

export type DownloadResult =
  | { allowed: true;  limits: UsageLimits }
  | { allowed: false; code: "signup_required" | "upgrade_required"; message: string; limits: UsageLimits };

export async function submitFeedback(payload: { rating: number; message?: string; tool?: string }, file?: File) {
  let body: any;
  let headers: any = {};
  
  if (file && payload.rating <= 2) {
    body = new FormData();
    body.append("rating", payload.rating.toString());
    if (payload.message) body.append("message", payload.message);
    if (payload.tool) body.append("tool", payload.tool);
    body.append("media_file", file);
    // When using FormData, let the browser set the Content-Type with the boundary
    headers = { "Content-Type": undefined };
  } else {
    body = JSON.stringify(payload);
    headers = { "Content-Type": "application/json" };
  }
  
  const token = tokenStore.getAccess();
  const reqHeaders: any = {
    "X-Anonymous-Id": getAnonId(),
    ...headers
  };
  if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
  if (reqHeaders["Content-Type"] === undefined) {
    delete reqHeaders["Content-Type"];
  }

  const res = await fetch(`${API_BASE}/tools/feedback`, {
    method: "POST",
    headers: reqHeaders,
    body,
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}

export interface TrackUsagePayload {
  tool: string;
  file_name: string;
  file_type: "image" | "video" | "other";
  file_size_bytes?: number;
  processing_ms?: number;
  output_format?: string;
  session_id?: string;
}

export async function trackUsage(payload: TrackUsagePayload) {
  try {
    await apiFetch("/tools/track-usage", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Failed to track usage", e);
  }
}

export async function recordDownload(): Promise<DownloadResult> {
  const res = await apiFetch("/tools/record-download", { method: "POST" });
  if (res.ok) {
    const data = await res.json();
    return { allowed: true, limits: data.limits };
  }
  const err = await res.json().catch(() => ({}));
  const detail = err.detail ?? {};
  return {
    allowed: false,
    code: detail.code ?? "upgrade_required",
    message: detail.message ?? "Download limit reached",
    limits: detail.limits,
  };
}

export type BulkResult =
  | { allowed: true;  limits: UsageLimits }
  | { allowed: false; code: "login_required" | "daily_bulk_limit" | "upgrade_required"; message: string };

export async function checkBulkAccess(): Promise<BulkResult> {
  if (!tokenStore.getAccess()) {
    return { allowed: false, code: "login_required", message: "Sign up free for 1 bulk operation/day" };
  }
  const res = await apiFetch("/tools/bulk/access");
  if (res.ok) {
    const data = await res.json();
    return { allowed: true, limits: data.limits };
  }
  if (res.status === 401) {
    return { allowed: false, code: "login_required", message: "Sign up free for 1 bulk operation/day" };
  }
  const err = await res.json().catch(() => ({}));
  const detail = err.detail ?? {};
  const code = detail.code === "daily_bulk_limit" ? "daily_bulk_limit" : "upgrade_required";
  return { allowed: false, code, message: detail.message ?? "Upgrade to EatBit Pro for bulk processing" };
}

// ── Trigger file download in browser ─────────────────────────────────────────

export function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Ask for feedback after download if eligible
  setTimeout(triggerFeedback, 1500);
}

export function triggerFeedback() {
  if (typeof window === "undefined") return;
  const status = localStorage.getItem("eb_feedback");
  if (status === "submitted") return;
  
  const now = Date.now();
  if (status) {
    const lastAsked = parseInt(status, 10);
    // Ask again only after 3 days
    if (now - lastAsked < 3 * 24 * 60 * 60 * 1000) return;
  }
  
  // Set last asked to now
  localStorage.setItem("eb_feedback", now.toString());
  window.dispatchEvent(new Event("eatbit:ask-feedback"));
}

