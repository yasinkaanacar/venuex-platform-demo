import { useState, useCallback, type ReactNode, type FormEvent } from "react";
import posthog from "posthog-js";
import venueXLogo from "@assets/vx-logo-1000x1000_1756566252817.png";

const STORAGE_KEY = "venuex_demo_lead";

interface DemoLead {
  email: string;
  company: string;
  timestamp: string;
}

function getStoredLead(): DemoLead | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.email && parsed?.company) return parsed as DemoLead;
    return null;
  } catch {
    return null;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function DemoGate({ children }: { children: ReactNode }) {
  const [gated, setGated] = useState(() => !getStoredLead());
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [touched, setTouched] = useState({ email: false, company: false });

  const emailError = touched.email && !isValidEmail(email) ? "Please enter a valid work email" : "";
  const companyError = touched.company && company.trim().length < 2 ? "Company name must be at least 2 characters" : "";
  const isValid = isValidEmail(email) && company.trim().length >= 2;

  const handleBlur = useCallback((field: "email" | "company") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!isValid) return;

      const lead: DemoLead = {
        email: email.trim(),
        company: company.trim(),
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(lead));

      posthog.identify(lead.email, {
        email: lead.email,
        company_name: lead.company,
        demo_accessed_at: lead.timestamp,
      });
      posthog.capture("demo_gate_submitted", { company_name: lead.company });

      setGated(false);
    },
    [email, company, isValid]
  );

  if (!gated) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[420px] mx-4 bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={venueXLogo} alt="VenueX" className="h-24" />
        </div>

        {/* Copy */}
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          See VenueX in action
        </h1>
        <p className="text-sm text-gray-500 text-center mt-2 mb-8">
          Enter your details to explore the interactive demo.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="demo-email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Work Email
            </label>
            <input
              id="demo-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="you@company.com"
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                emailError ? "border-red-400 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {emailError && (
              <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="demo-company" className="block text-sm font-medium text-gray-700 mb-1.5">
              Company Name
            </label>
            <input
              id="demo-company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              onBlur={() => handleBlur("company")}
              placeholder="Acme Inc."
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                companyError ? "border-red-400 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {companyError && (
              <p className="mt-1.5 text-xs text-red-500">{companyError}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Access Demo
          </button>
        </form>
      </div>
    </div>
  );
}
