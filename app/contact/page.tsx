"use client";

import { useState } from "react";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwLnyGXKrgLTdkMgXnwL38DafnGxE-vhb-SzHG0gCKCl7aWrduKWGAomaiSUve4jrAY/exec";

type FormState = {
  fullname: string;
  email: string;
  phone: string;
  type: string;
  budget: string;
  description: string;
};

const initialForm: FormState = {
  fullname: "",
  email: "",
  phone: "",
  type: "",
  budget: "",
  description: "",
};

export default function ContactUsPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const payload = {
      ...form,
      submitted_at: new Date().toISOString(),
      source: "EatBit Website",
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  const inputClass =
    "w-full h-12 px-4 rounded-lg border border-slate-300 bg-[#f8f7f5] focus:border-[#f27f0d] focus:ring-1 focus:ring-[#f27f0d] outline-none transition-all placeholder:text-[#8a7560]/50 text-[#181411]";
  const iconInputClass =
    "w-full h-12 pl-11 pr-4 rounded-lg border border-slate-300 bg-[#f8f7f5] focus:border-[#f27f0d] focus:ring-1 focus:ring-[#f27f0d] outline-none transition-all placeholder:text-[#8a7560]/50 text-[#181411]";

  return (
    <div className="bg-background text-foreground antialiased min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4 md:px-8">
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── Left: Info ── */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:sticky lg:top-28">
            <div className="flex flex-col gap-4">
              <span className="text-primary font-bold tracking-wider uppercase text-sm">
                Let's build together
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight">
                Start Your Project with EatBit
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ready to transform your digital presence? Tell us about your vision and we'll
                craft a tailored solution that fits your needs and budget perfectly.
              </p>
            </div>

            <div className="grid gap-5">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                  <p className="text-muted-foreground text-sm">neeleshbaghel40@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                  <p className="text-muted-foreground text-sm">+91 8319212779</p>
                  <p className="text-muted-foreground text-sm">Mon–Fri from 9am to 6pm IST</p>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                  <span className="material-symbols-outlined">people</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Connect on LinkedIn</h3>
                  <a
                    href="https://www.linkedin.com/in/antrisk40/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm hover:underline"
                  >
                    linkedin.com/in/antrisk40
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-7">
            <div className="bg-card rounded-2xl shadow-xl p-6 md:p-10 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit_document</span>
                Project Details
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Fill in the form and we'll get back to you within 24 hours.
              </p>

              {/* Success Banner */}
              {status === "success" && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                  <span className="material-symbols-outlined text-[28px]">check_circle</span>
                  <div>
                    <p className="font-bold">Request sent!</p>
                    <p className="text-sm opacity-80">We'll be in touch shortly.</p>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                  <span className="material-symbols-outlined text-[28px]">error</span>
                  <div>
                    <p className="font-bold">Submission failed</p>
                    <p className="text-sm opacity-80">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                {/* Full Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="fullname">
                      Full Name <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                      </span>
                      <input
                        className={iconInputClass}
                        id="fullname"
                        name="fullname"
                        placeholder="John Doe"
                        type="text"
                        required
                        value={form.fullname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="email">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </span>
                      <input
                        className={iconInputClass}
                        id="email"
                        name="email"
                        placeholder="john@company.com"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <span className="material-symbols-outlined text-[20px]">call</span>
                    </span>
                    <input
                      className={iconInputClass}
                      id="phone"
                      name="phone"
                      placeholder="+91 98765 43210"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Project Type & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="type">
                      Project Type <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <span className="material-symbols-outlined text-[20px]">category</span>
                      </span>
                      <select
                        className={`${iconInputClass} appearance-none cursor-pointer`}
                        id="type"
                        name="type"
                        required
                        value={form.type}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select a type…</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Tech Consulting">Tech Consulting</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-foreground" htmlFor="budget">
                      Estimated Budget <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <span className="material-symbols-outlined text-[20px]">payments</span>
                      </span>
                      <select
                        className={`${iconInputClass} appearance-none cursor-pointer`}
                        id="budget"
                        name="budget"
                        required
                        value={form.budget}
                        onChange={handleChange}
                      >
                        <option value="" disabled>Select range…</option>
                        <option value="Under ₹50,000">Under ₹50,000</option>
                        <option value="₹50,000 - ₹1,00,000">₹50,000 – ₹1,00,000</option>
                        <option value="₹1,00,000 - ₹5,00,000">₹1,00,000 – ₹5,00,000</option>
                        <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 – ₹10,00,000</option>
                        <option value="₹10,00,000+">₹10,00,000+</option>
                        <option value="Let's discuss">Let's discuss</option>
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-foreground" htmlFor="description">
                    Project Description <span className="text-primary">*</span>
                  </label>
                  <textarea
                    className="w-full p-4 rounded-lg border border-slate-300 bg-[#f8f7f5] focus:border-[#f27f0d] focus:ring-1 focus:ring-[#f27f0d] outline-none transition-all placeholder:text-[#8a7560]/50 text-[#181411] resize-none"
                    id="description"
                    name="description"
                    placeholder="Tell us about your project goals, timeline, and requirements…"
                    rows={5}
                    required
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    className="w-full h-14 bg-primary hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    type="submit"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <span className="material-symbols-outlined text-[22px] animate-spin">
                          progress_activity
                        </span>
                        Sending…
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <span className="material-symbols-outlined text-[22px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-muted-foreground mt-4">
                    By submitting, you agree to our{" "}
                    <a className="underline hover:text-primary" href="#">Privacy Policy</a>.
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
