import { useState, useEffect } from 'react';
import { Cookie, X, SlidersHorizontal } from 'lucide-react';

const STORAGE_KEY = 'renaissance_cookie_consent';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  updatedAt: string;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const savePreferences = (analytics: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
    setVisible(false);
    setShowSettings(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-xl border border-[#06369c]/15 bg-white/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#06369c]/10 text-[#06369c]">
              <Cookie className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#06369c] sm:text-lg">
                We value your privacy
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
                We use essential cookies to ensure this website functions properly, and optional
                analytics cookies to understand how visitors interact with our site. Questions?{' '}
                <a
                  href="mailto:info@renaissanceevents.com"
                  className="font-medium text-[#06369c] underline underline-offset-2 hover:text-[#052b7d]"
                >
                  info@renaissanceevents.com
                </a>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => savePreferences(false)}
            aria-label="Close cookie banner"
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {showSettings && (
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#06369c]">Essential Cookies</p>
                <p className="text-xs text-slate-500">
                  Required for core site functionality. Always active.
                </p>
              </div>
              <span className="rounded-full bg-[#06369c]/10 px-2.5 py-0.5 text-xs font-medium text-[#06369c]">
                Always On
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-3">
              <div>
                <p className="text-sm font-medium text-[#06369c]">Analytics Cookies</p>
                <p className="text-xs text-slate-500">
                  Help us improve the experience by measuring site traffic and usage.
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#06369c] peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => setShowSettings((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:text-sm"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {showSettings ? 'Hide Settings' : 'Cookie Settings'}
          </button>

          <button
            type="button"
            onClick={() => savePreferences(false)}
            className="rounded-lg border border-[#06369c]/30 px-4 py-2 text-xs font-medium text-[#06369c] transition-colors hover:bg-[#06369c]/5 sm:text-sm"
          >
            Reject Non-Essential
          </button>

          {showSettings ? (
            <button
              type="button"
              onClick={() => savePreferences(analyticsEnabled)}
              className="rounded-lg bg-[#06369c] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#052b7d] sm:text-sm"
            >
              Save Preferences
            </button>
          ) : (
            <button
              type="button"
              onClick={() => savePreferences(true)}
              className="rounded-lg bg-[#06369c] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#052b7d] sm:text-sm"
            >
              Accept All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
