"use client";

import { useState } from "react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzd6JpnpCZ0mS3W5KYW_vLfZeURV9s6nJ0loc2HFt_USyI7I3UicBkrobdUMczNRcDjhg/exec";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  linkedin: string;
  resume: string;
  why_us: string;
};

const initialForm: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  linkedin: "",
  resume: "",
  why_us: "",
};

export default function JobApplicationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const payload = {
      ...form,
      position: "Business Development Associate",
      submitted_at: new Date().toISOString(),
      source: "EatBit",
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        // Google Apps Script requires no-cors for cross-origin POST
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // no-cors means we can't read the response body, but if no network error thrown = success
      setStatus("success");
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "form-input w-full rounded-lg border border-[#e6e0db] bg-[#f8f7f5] h-12 px-4 focus:ring-2 focus:ring-[#f27f0d] focus:border-[#f27f0d] outline-none transition-all placeholder:text-[#8a7560]/60 text-[#181411]";
  const iconInputClass =
    "form-input w-full rounded-lg border border-[#e6e0db] bg-[#f8f7f5] h-12 pl-12 pr-4 focus:ring-2 focus:ring-[#f27f0d] focus:border-[#f27f0d] outline-none transition-all placeholder:text-[#8a7560]/60 text-[#181411]";

  return (
    <div className="bg-background text-foreground antialiased min-h-screen flex flex-col">
      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-[800px] w-full gap-8">

          {/* Job Header */}
          <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Business Development
                </span>
                <span className="text-muted-foreground text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  Full-time
                </span>
              </div>
              <h1 className="text-foreground text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Business Development Associate
              </h1>
              <p className="text-muted-foreground text-base flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Remote (Worldwide)
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {status === "success" && (
            <div className="flex items-center gap-3 p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
              <div>
                <p className="font-bold text-base">Application submitted!</p>
                <p className="text-sm opacity-80">We'll review your application and get back to you soon.</p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {status === "error" && (
            <div className="flex items-center gap-3 p-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
              <span className="material-symbols-outlined text-[28px]">error</span>
              <div>
                <p className="font-bold text-base">Submission failed</p>
                <p className="text-sm opacity-80">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Application Form */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border bg-muted/30">
              <h2 className="text-xl font-bold text-foreground">Submit your application</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Please fill out the form below to apply for this position.
              </p>
            </div>

            <form className="p-8 flex flex-col gap-6" onSubmit={handleSubmit}>

              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-foreground text-sm font-bold">
                    First Name <span className="text-primary">*</span>
                  </span>
                  <input
                    className={inputClass}
                    name="first_name"
                    placeholder="e.g. Jane"
                    type="text"
                    required
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-foreground text-sm font-bold">
                    Last Name <span className="text-primary">*</span>
                  </span>
                  <input
                    className={inputClass}
                    name="last_name"
                    placeholder="e.g. Doe"
                    type="text"
                    required
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-foreground text-sm font-bold">
                    Email Address <span className="text-primary">*</span>
                  </span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <span className="material-symbols-outlined text-[20px]">mail</span>
                    </span>
                    <input
                      className={iconInputClass}
                      name="email"
                      placeholder="jane@example.com"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-foreground text-sm font-bold">Phone Number</span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </span>
                    <input
                      className={iconInputClass}
                      name="phone"
                      placeholder="+91 98765 43210"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </label>
              </div>

              {/* LinkedIn */}
              <label className="flex flex-col gap-2">
                <span className="text-foreground text-sm font-bold">LinkedIn Profile</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <span className="material-symbols-outlined text-[20px]">link</span>
                  </span>
                  <input
                    className={iconInputClass}
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    type="url"
                    value={form.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </label>

              {/* Resume Link */}
              <label className="flex flex-col gap-2">
                <span className="text-foreground text-sm font-bold">
                  Resume / CV Link <span className="text-primary">*</span>
                </span>
                <p className="text-xs text-muted-foreground -mt-1">
                  Share a link to your resume (Google Drive, Dropbox, OneDrive, etc.)
                </p>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </span>
                  <input
                    className={iconInputClass}
                    name="resume"
                    placeholder="https://drive.google.com/your-resume"
                    type="url"
                    required
                    value={form.resume}
                    onChange={handleChange}
                  />
                </div>
              </label>

              {/* Why EatBit */}
              <label className="flex flex-col gap-2">
                <span className="text-foreground text-sm font-bold">
                  Why EatBit? <span className="text-primary">*</span>
                </span>
                <p className="text-xs text-muted-foreground -mt-1">
                  Tell us a bit about yourself and why you'd be a great fit for this role.
                </p>
                <textarea
                  className="form-textarea w-full rounded-lg border border-[#e6e0db] bg-[#f8f7f5] dark:bg-muted h-32 p-4 focus:ring-2 focus:ring-[#f27f0d] focus:border-[#f27f0d] outline-none transition-all placeholder:text-[#8a7560]/60 text-foreground resize-y"
                  name="why_us"
                  placeholder="I believe I am a great fit because..."
                  required
                  value={form.why_us}
                  onChange={handleChange}
                />
              </label>

              <div className="h-px w-full bg-border my-2" />

              {/* Submit */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground text-center sm:text-left max-w-xs">
                  By submitting, you agree that EatBit may contact you regarding this application.
                </p>
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-primary h-12 px-8 text-white text-base font-bold hover:bg-orange-600 active:bg-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Application
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
