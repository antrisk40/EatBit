# 📊 EatBit — GA4 Event Tracking Reference

> **Measurement ID:** `G-TRB57BHFJF`  
> **Implementation:** Custom event layer on top of GA4 (`gtag`) — no GTM required.  
> **Primary source files:**
> - [`lib/analytics.ts`](./lib/analytics.ts) — all tracking helpers & hooks
> - [`lib/downloadWithGate.ts`](./lib/downloadWithGate.ts) — gated download + `file_download` event
> - [`components/GaTracker.tsx`](./components/GaTracker.tsx) — global tracker (scroll depth, engagement, click delegation)
> - [`components/AuthModal.tsx`](./components/AuthModal.tsx) — login funnel tracking
> - [`components/UpgradeModal.tsx`](./components/UpgradeModal.tsx) — payment / upgrade funnel tracking

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Global Events (Every Page)](#global-events-every-page)
3. [Authentication Funnel](#authentication-funnel)
4. [Payment / Upgrade Funnel](#payment--upgrade-funnel)
5. [Tool Processing Funnel](#tool-processing-funnel)
6. [Download Funnel](#download-funnel)
7. [Engagement & Interaction Events](#engagement--interaction-events)
8. [Gate & Limit Events](#gate--limit-events)
9. [Plans Page](#plans-page)
10. [Custom Dimensions Reference](#custom-dimensions-reference)
11. [How to Add Tracking to a New Page](#how-to-add-tracking-to-a-new-page)
12. [GA4 Recommended Reports](#ga4-recommended-reports)

---

## Architecture Overview

```
User Action
    │
    ├─► data-ga-event attribute  ──►  GaTracker (global click listener)
    │                                      └─► trackClick() / trackEvent()
    │
    ├─► React handler             ──►  trackEvent() / trackDownload() / trackPopupView()
    │
    └─► GaTracker hooks           ──►  useScrollDepthTracker()
                                       useEngagementTimeTracker()
                                       useProcessDownloadFunnel()
```

All events are sent via `window.gtag("event", name, params)` with a shared
`pageContext()` payload automatically merged in:

| Auto-merged param | Description |
|---|---|
| `page_path` | Current pathname |
| `page_location` | Full URL |
| `page_title` | `document.title` |
| `tool` | Last path segment (e.g. `gemini-watermark-remover`) |

---

## Global Events (Every Page)

These fire automatically on **every page** via `GaTracker` (rendered in `app/layout.tsx`).

### `page_view`

Fires on every SPA navigation (route change). Initial page load is handled by `gtag('config', ...)` in `layout.tsx`.

| Parameter | Type | Example |
|---|---|---|
| `page_path` | string | `/tools/gemini-watermark-remover` |
| `page_location` | string | `https://eatbit.in/tools/...` |
| `page_title` | string | `Gemini Watermark Remover — EatBit` |

---

### `scroll`

Fires at **25 / 50 / 75 / 90 / 100%** scroll depth. Uses the same parameter name as GA4's built-in scroll event so reports are unified under `percent_scrolled`.

| Parameter | Type | Example |
|---|---|---|
| `percent_scrolled` | number | `50` |

> **Source:** `useScrollDepthTracker()` in `lib/analytics.ts`

---

### `user_engagement`

Fires when the tab becomes hidden (`visibilitychange`) or the page is unloaded (`pagehide`). Provides accurate engaged time for SPAs where GA4's auto-collection can be inaccurate.

| Parameter | Type | Example |
|---|---|---|
| `engagement_time_msec` | number | `42300` |

> **Source:** `useEngagementTimeTracker()` in `lib/analytics.ts`

---

### `click`

Fires on any element with `data-ga-event="click"`. Handled globally by `GaTracker`.

| Parameter | Type | Example |
|---|---|---|
| `event_category` | string | `engagement` |
| `event_label` | string | `download_zip`, `whatsapp`, `lead_banner_quote` |

**All instrumented `data-ga-label` values:**

| Label | Location |
|---|---|
| `whatsapp` | Floating WhatsApp button (global) |
| `upload_box` | File drop zone click |
| `remove_file` | Per-file remove button |
| `clear_queue` | Clear all queue button |
| `download_file` | Per-file download button |
| `download_zip` | "Download All as ZIP" button |
| `give_feedback` | Feedback button after processing |
| `faq` | FAQ accordion item |
| `lead_banner_quote` | "Get a Free Quote" inline banner |
| `lead_banner_whatsapp` | "Chat on WhatsApp" inline banner |
| `cta_try_tool` | "Try the Tool" bottom CTA |
| `cta_contact` | "Get in Touch" bottom CTA |
| `auth_tab_sign_in` | Sign In tab in Auth modal |
| `auth_tab_sign_up` | Sign Up tab in Auth modal |
| `auth_google` | "Continue with Google" button |
| `upgrade_pay` | "Get Plan" button (logged-in user) |
| `upgrade_sign_in` | "Sign in to Upgrade" (anon user) |
| `plans_cta_simple_wordpress_site` | Plans page card CTA |
| `plans_cta_e-commerce_+_admin` | Plans page card CTA |
| `plans_cta_custom_software` | Plans page card CTA |

---

## Authentication Funnel

> **Source:** `components/AuthModal.tsx`

### Funnel stages

```
popup_view (login)
    │
    ├── click auth_google / auth_tab_sign_in / auth_tab_sign_up
    │
    ├── [success] ──► popup_convert (login) ──► login / sign_up
    │
    └── [dismiss]  ──► popup_dismiss (login)
                        └── if gated: funnel_drop + eatbit:gate-skip
```

---

### `popup_view`

Fires immediately when the login modal opens.

| Parameter | Value |
|---|---|
| `popup_name` | `"login"` |

---

### `popup_dismiss`

Fires when the user closes the login modal without completing login.

| Parameter | Type | Example |
|---|---|---|
| `popup_name` | string | `"login"` |
| `time_to_dismiss_ms` | number | `1800` |
| `skip_stage` | string | `"just_after_popup"` \| `"later"` \| `"unknown"` |
| `gated` | boolean | `true` if dismissed after hitting a limit gate |

> `skip_stage = "just_after_popup"` when dismissed within **3 seconds**, `"later"` otherwise.

---

### `popup_convert`

Fires when the user successfully logs in or registers.

| Parameter | Type | Example |
|---|---|---|
| `popup_name` | string | `"login"` |
| `method` | string | `"google"` \| `"email"` \| `"otp"` |
| `time_to_convert_ms` | number | `12500` |

---

### `login`

Standard GA4 recommended event.

| Parameter | Type | Example |
|---|---|---|
| `method` | string | `"google"` \| `"email"` \| `"otp"` |

---

### `sign_up`

Standard GA4 recommended event.

| Parameter | Type | Example |
|---|---|---|
| `method` | string | `"email"` |

---

### `login_fail` / `sign_up_fail`

| Parameter | Type | Example |
|---|---|---|
| `method` | string | `"google"` \| `"email"` |

---

## Payment / Upgrade Funnel

> **Source:** `components/UpgradeModal.tsx`

### Funnel stages

```
popup_view (upgrade)
    │
    ├── select_item  (plan toggle)
    │
    ├── click upgrade_pay
    │       │
    │       ├── add_to_cart
    │       ├── begin_checkout
    │       ├── popup_view (razorpay)
    │       │
    │       ├── [success] ──► purchase ──► popup_convert (upgrade)
    │       ├── [cancel]  ──► payment_cancelled ──► popup_dismiss (razorpay)
    │       │                   └── if gated: funnel_drop
    │       └── [error]   ──► payment_failed
    │
    └── [modal dismiss] ──► popup_dismiss (upgrade)
                              └── if gated: funnel_drop
```

---

### `popup_view` (upgrade)

| Parameter | Value |
|---|---|
| `popup_name` | `"upgrade"` |

---

### `select_item`

Fires when user toggles between Monthly / Yearly plan.

| Parameter | Type | Example |
|---|---|---|
| `item_list_name` | string | `"upgrade_plans"` |
| `items[0].item_id` | string | `"pro_monthly"` \| `"pro_yearly"` |
| `items[0].item_name` | string | `"Monthly"` \| `"Yearly"` |

---

### `add_to_cart`

Standard GA4 ecommerce event. Fires when Razorpay order is created.

| Parameter | Type | Example |
|---|---|---|
| `currency` | string | `"INR"` |
| `value` | number | `49` |
| `items[0].item_id` | string | `"pro_monthly"` |

---

### `begin_checkout`

Fires at the same time as `add_to_cart` (before Razorpay modal opens).

> Same parameters as `add_to_cart`.

---

### `purchase` ⭐

Standard GA4 ecommerce event. Fires **only after payment verified** on the backend.

| Parameter | Type | Example |
|---|---|---|
| `transaction_id` | string | `"pay_AbCdEf1234"` (Razorpay payment ID) |
| `currency` | string | `"INR"` |
| `value` | number | `49` |
| `items[0].item_id` | string | `"pro_monthly"` |

---

### `payment_cancelled`

Fires when user closes Razorpay modal without paying.

| Parameter | Type | Example |
|---|---|---|
| `plan` | string | `"pro_monthly"` |

---

### `payment_failed`

Fires on Razorpay error or backend verification failure.

| Parameter | Type | Example |
|---|---|---|
| `plan` | string | `"pro_monthly"` |
| `stage` | string | `"verify"` (backend failure) |
| `message` | string | error message text |

---

## Tool Processing Funnel

> **Source:** GWR pages (`gemini-watermark-remover`, `bulk-gemini-watermark-remover`)

### Funnel stages

```
tool_upload
    │
    ├── [limit hit] ──► limit_hit (action: upload)
    │
    └── tool_process_start
            │
            ├── [limit hit] ──► limit_hit (action: process)
            ├── [success]   ──► tool_process_complete
            └── [failure]   ──► tool_process_fail
```

---

### `tool_upload`

Fires when files are added to the queue after limit check passes.

| Parameter | Type | Example |
|---|---|---|
| `file_count` | number | `3` |
| `file_kinds` | string | `"image,image,video"` |

---

### `tool_paste`

Fires when user pastes an image via Ctrl+V.

| Parameter | Type | Example |
|---|---|---|
| `file_count` | number | `1` |

---

### `tool_process_start`

Fires just before processing begins for each file.

| Parameter | Type | Example |
|---|---|---|
| `file_kind` | string | `"image"` \| `"video"` |
| `file_size_bytes` | number | `2048000` |

---

### `tool_process_complete`

| Parameter | Type | Example |
|---|---|---|
| `file_kind` | string | `"image"` \| `"video"` |

---

### `tool_process_fail`

| Parameter | Type | Example |
|---|---|---|
| `file_kind` | string | `"image"` \| `"video"` |

---

## Download Funnel

> **Source:** `lib/downloadWithGate.ts`, `lib/analytics.ts`

### Funnel stages

```
[file processed — status: done]
    │
    ├── user clicks download
    │        ├── [allowed]  ──► file_download
    │        └── [blocked]  ──► limit_hit (action: download)
    │                            └── popup_view (login / upgrade)
    │
    └── user never downloads ──► download_skip
             (reason: leave_page / navigate_away / remove_file / clear_queue / popup_dismiss)
```

---

### `file_download` ⭐

Fires after every successful download.

| Parameter | Type | Example |
|---|---|---|
| `file_name` | string | `"watermark-removed-photo.webp"` |
| `download_type` | string | `"single"` \| `"bulk_zip"` |
| `file_kind` | string | `"image"` \| `"video"` \| `undefined` (zip) |
| `file_count` | number | `5` (zip only) |

---

### `download_skip`

Fires when a processed file is **never downloaded**.

| Parameter | Type | Example |
|---|---|---|
| `skip_reason` | string | `"leave_page"` \| `"navigate_away"` \| `"popup_dismiss"` \| `"remove_file"` \| `"clear_queue"` |
| `file_kind` | string | `"image"` \| `"video"` |
| `skip_stage` | string | `"before_download"` \| `"just_after_popup"` \| `"later"` |

> **Key insight:** `skip_reason: "popup_dismiss"` + `skip_stage: "just_after_popup"` means the user hit the login/upgrade gate, dismissed it within 3 seconds, and left without downloading.

---

## Engagement & Interaction Events

### `click` — FAQ interaction

Fires when a user expands or collapses an FAQ item.

| Parameter | Type | Example |
|---|---|---|
| `event_label` | string | `"faq"` |
| `faq_index` | number | `2` |

---

## Gate & Limit Events

### `limit_hit`

Fires whenever the user is blocked by a free tier or login gate.

| Parameter | Type | Example |
|---|---|---|
| `gate` | string | `"login"` \| `"upgrade"` |
| `action` | string | `"upload"` \| `"process"` \| `"download"` |

---

### `funnel_drop`

Fires when a gated user (within 60s of hitting a limit) dismisses the login or upgrade popup.

| Parameter | Type | Example |
|---|---|---|
| `drop_stage` | string | `"just_after_popup"` \| `"later"` |
| `popup_name` | string | `"login"` \| `"upgrade"` \| `"razorpay"` |
| `drop_reason` | string | `"gate_popup_dismiss"` |

---

## Plans Page

> **Source:** `app/plans/page.tsx`

### `plan_cta_click`

Fires when a user clicks the CTA button on a pricing plan card.

| Parameter | Type | Example |
|---|---|---|
| `plan_title` | string | `"E-Commerce + Admin"` |
| `plan_price` | string | `"25,000"` \| `"Contact Us"` |

---

## Custom Dimensions Reference

Register these in **GA4 → Admin → Custom Definitions → Custom Dimensions**.

| Dimension Name | Parameter | Scope | Description |
|---|---|---|---|
| Tool | `tool` | Event | Which tool page the event occurred on |
| File Kind | `file_kind` | Event | `image` or `video` |
| Download Type | `download_type` | Event | `single`, `bulk_zip` |
| Skip Reason | `skip_reason` | Event | Why a download was skipped |
| Skip Stage | `skip_stage` | Event | `just_after_popup`, `later`, `before_download` |
| Popup Name | `popup_name` | Event | `login`, `upgrade`, `razorpay` |
| Gate | `gate` | Event | `login` or `upgrade` |
| Plan | `plan` | Event | `pro_monthly`, `pro_yearly` |
| Percent Scrolled | `percent_scrolled` | Event | Scroll depth milestone |
| Engagement Time (ms) | `engagement_time_msec` | Event | Engaged time in milliseconds |
| FAQ Index | `faq_index` | Event | Which FAQ item was expanded |

---

## How to Add Tracking to a New Page

### 1. Declarative click tracking

Add `data-ga-event` and `data-ga-label` to any element. `GaTracker` handles it automatically:

```tsx
<button
  data-ga-event="click"
  data-ga-label="my_action"
>
  Do Something
</button>

{/* With extra parameters */}
<button
  data-ga-event="click"
  data-ga-label="my_action"
  data-ga-params={JSON.stringify({ source: "hero", plan: "pro" })}
>
  Do Something
</button>
```

### 2. Programmatic event tracking

```tsx
import { trackEvent } from "@/lib/analytics";

trackEvent("my_custom_event", {
  my_param: "value",
  another_param: 42,
});
```

### 3. Scroll depth

Already active globally — **no per-page code needed**. `GaTracker` handles it.

### 4. Download with gate + tracking

```tsx
import { downloadWithGate } from "@/lib/downloadWithGate";

const ok = await downloadWithGate(blobUrl, "output.pdf", false, {
  download_type: "single",
  file_kind: "pdf",
});
// Fires: file_download (if allowed)
// OR:    limit_hit + popup_view (if blocked)
```

### 5. Process + Download funnel tracking

```tsx
import { useProcessDownloadFunnel } from "@/lib/analytics";

const { markDownloaded, flushSkips } = useProcessDownloadFunnel(queue);

// After successful download:
markDownloaded(itemId);

// When removing a processed-but-not-downloaded item:
flushSkips("remove_file", [itemId]);
```

---

## GA4 Recommended Reports

### Conversion funnel: Visitor → Processed → Downloaded → Paid

```
Funnel steps:
1. page_view         (tool: gemini-watermark-remover)
2. tool_upload
3. tool_process_complete
4. file_download     OR   popup_view (login gate)
5. popup_convert     (login)
6. popup_view        (upgrade)
7. purchase
```

### Download abandon analysis

```
Event:       download_skip
Segment by:  skip_reason  → why they didn't download
             skip_stage   → how soon after gating
             file_kind    → image vs video
             tool         → which page
```

### Payment drop-off

```
Events:     payment_cancelled / payment_failed
Compare:    purchase count for same period
Segment by: plan (pro_monthly vs pro_yearly)
```

### Content engagement by scroll depth

```
Event:      scroll
Breakdown:  percent_scrolled
Filter:     tool = gemini-watermark-remover
Insight:    See how far users scroll before uploading or leaving
```

### Gate effectiveness

```
limit_hit  →  popup_view  →  popup_convert   = conversion rate
limit_hit  →  funnel_drop                    = drop rate
Segment by: gate (login vs upgrade), action (upload / process / download)
```

---

## Update — Oct 16 2026 (Clarity + Friction Analysis)

### New Events Added

| Event | Where fires | Key parameters |
|---|---|---|
| `file_selected` | `handleFiles` — **before** limit gate | `file_type`, `file_kind`, `size_mb`, `size_bucket` |
| `download_click` | `handleDownload` — **before** gate check | `file_kind`, `download_type`, `plan` |
| `download_complete` | `handleDownload` — **after** file saved | `file_kind`, `download_type`, `file_count` |
| `limit_reached` | gate blocks upload/process/download | `gate`, `action` (key event alias for `limit_hit`) |
| `compare_slider_used` | first drag of before/after slider | (fired once per card) |
| `feedback_open` | FeedbackModal mounts | mirrors to Clarity |
| `feedback_submit_success` | form submitted OK | `rating`, `is_lead`, `source` |
| `feedback_submit_error` | API call failed | `status`, `error_message`, `source` |
| `feedback_abandon` | closed **after** typing or rating | `has_text`, `rating`, `source` |
| `js_error` | `window.onerror` / `unhandledrejection` | `error_message`, `error_source`, `error_line` |
| `api_error` | fetch 4xx/5xx | `endpoint`, `status`, `is_rate_limit` |

### `file_selected` vs `tool_upload` — Why Both?

| Event | When it fires | Purpose |
|---|---|---|
| `file_selected` | Immediately when user picks/drops file | True top-of-funnel count |
| `tool_upload` | After limit check passes | Qualified users who can process |

The **gap between `file_selected` and `tool_upload`** = users blocked by the gate. This is how you measure the limit's conversion cost.

### Full Funnel (Updated)

```
file_selected
    │
    ├── [gate blocks] ──► limit_reached  ──► popup_view (login/upgrade)
    │                                           ├── popup_convert  ──► (continue)
    │                                           └── popup_dismiss  ──► funnel_drop
    │
    └── [gate passes] ──► tool_upload
                              │
                              └── tool_process_start
                                      │
                                      ├── tool_process_complete
                                      │       │
                                      │       └── compare_slider_used (engagement)
                                      │
                                      └── tool_process_fail
```

```
[status: done]
    │
    ├── download_click (intent)
    │       │
    │       ├── [gated] ──► limit_reached + popup_view
    │       │
    │       └── [ok]    ──► file_download  ──► download_complete
    │
    └── [never clicks] ──► download_skip
```

### Clarity Changes

- **Production-only guard** added to `ClarityInit.tsx` — Clarity now only initializes on `eatbit.in`. Localhost and Netlify preview sessions no longer pollute heatmaps and recordings.
- All events now mirror to Clarity via `window.clarity("event", name)` inside `trackEvent()`.
- `feedback_open`, `feedback_submit_success`, `feedback_submit_error` send explicit Clarity events for session tagging and funnel filtering.

### GA4 Key Events to Mark (Admin → Conversions)

Mark these as key events in GA4 for them to appear in conversion reports:

| Event | Why |
|---|---|
| `download_complete` | Core conversion — file saved |
| `limit_reached` | Friction signal — measure gate impact |
| `feedback_submit_success` | Lead signal |
| `signup_click` / `login` | Account funnel |
| `purchase` | Revenue |

### New Custom Dimensions to Register

| Dimension | Parameter | Notes |
|---|---|---|
| Size Bucket | `size_bucket` | `<1MB`, `1-5MB`, `5-20MB`, `>20MB` |
| Has Text | `has_text` | feedback abandon signal |
| Is Lead | `is_lead` | feedback with custom software interest |
| Is Rate Limit | `is_rate_limit` | true for 429 errors |
