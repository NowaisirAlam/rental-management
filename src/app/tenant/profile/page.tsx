"use client";

import { useState, useRef, useEffect } from "react";
import {
  CheckCircle2, X, User, Upload, Trash2,
  FileText, ShieldCheck, CreditCard,
  Sun, Moon, Monitor, Mail, Phone, ChevronDown, Eye, EyeOff, Loader2,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

// ── Types ───────────────────────────────────────────────────────────────────────

type DocState = { name: string; file: File | null };
type DocItem = {
  label: string;
  icon: React.ElementType;
  state: DocState;
  setter: React.Dispatch<React.SetStateAction<DocState>>;
};

// ── Toast ───────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────────────────────

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass = "block text-xs font-medium uppercase tracking-wide text-slate-400";

// ── Page ────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  // Avatar
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Personal info — hydrated from API on mount
  const [fullName,       setFullName]       = useState("");
  const [email,          setEmail]          = useState("");
  const [phone,          setPhone]          = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [infoSaving,     setInfoSaving]     = useState(false);

  // Documents (local only — no file storage in DB)
  const [govId,     setGovId]     = useState<DocState>({ name: "", file: null });
  const [insurance, setInsurance] = useState<DocState>({ name: "", file: null });
  const [leaseDoc,  setLeaseDoc]  = useState<DocState>({ name: "", file: null });

  // Preferences (local only)
  const { theme, setTheme } = useTheme();
  const [contactMethod, setContactMethod] = useState<"Email" | "Phone">("Email");
  const [language, setLanguage]           = useState("English");

  // Security
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw,    setShowPw]    = useState(false);
  const [pwSaving,  setPwSaving]  = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  // Fetch profile on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: { name: string; email: string; phone: string | null }) => {
        setFullName(data.name ?? "");
        setEmail(data.email ?? "");
        setPhone(data.phone ?? "");
      })
      .catch(() => showToast("Could not load profile."))
      .finally(() => setProfileLoading(false));
  }, []);

  // ── Avatar handlers ──────────────────────────────────────────────────────────

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── Initials fallback ────────────────────────────────────────────────────────

  const initials = fullName.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  // ── Personal info save → PUT /api/profile ───────────────────────────────────

  const handleSaveInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInfoSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, phone: phone || null }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        showToast(err.error ?? "Failed to save.");
        return;
      }
      showToast("Profile updated successfully.");
    } catch {
      showToast("Failed to save profile.");
    } finally {
      setInfoSaving(false);
    }
  };

  // ── Password save → PUT /api/profile/password ───────────────────────────────

  const handlePasswordSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPw !== confirmPw) { showToast("Passwords do not match."); return; }
    setPwSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        showToast(err.error ?? "Failed to update password.");
        return;
      }
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      showToast("Password updated successfully.");
    } catch {
      showToast("Failed to update password.");
    } finally {
      setPwSaving(false);
    }
  };

  // ── Document upload ──────────────────────────────────────────────────────────

  const handleDocUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<DocState>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter({ name: file.name, file });
    e.target.value = "";
    showToast(`${file.name} uploaded.`);
  };

  // ── Document rows config ─────────────────────────────────────────────────────

  const docItems: DocItem[] = [
    { label: "Government ID",      icon: CreditCard,  state: govId,     setter: setGovId     },
    { label: "Insurance Document", icon: ShieldCheck, state: insurance, setter: setInsurance  },
    { label: "Lease",              icon: FileText,    state: leaseDoc,  setter: setLeaseDoc   },
  ];

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your personal details and documents.</p>
      </div>

      {/* ── Profile photo card ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile photo" className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white ring-2 ring-slate-200">
                {initials || <User className="h-8 w-8" />}
              </div>
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">{fullName || "—"}</p>
            <p className="text-sm text-slate-500">{email || "—"}</p>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={() => avatarInputRef.current?.click()} className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
                Change photo
              </button>
              {avatarSrc && (
                <button onClick={() => setAvatarSrc(null)} className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-red-500 transition hover:bg-red-50 active:scale-95">
                  Remove photo
                </button>
              )}
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>
      </div>

      {/* ── Personal information card ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Personal Information</h2>
        {profileLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
              />
              <p className="mt-1.5 text-xs text-slate-400">Email cannot be changed.</p>
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (416) 555-0000" className={inputClass} />
            </div>
            <button type="submit" disabled={infoSaving} className="mt-2 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-50">
              {infoSaving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        )}
      </div>

      {/* ── Documents card ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Documents</h2>
        <div className="space-y-3">
          {docItems.map(({ label, icon: Icon, state, setter }) => {
            const inputId = `doc-${label.replace(/\s+/g, "-").toLowerCase()}`;
            return (
              <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400 truncate">{state.name || "No file uploaded"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <label htmlFor={inputId} className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
                    <Upload className="h-3.5 w-3.5" />
                    {state.name ? "Replace" : "Upload"}
                  </label>
                  {state.name && (
                    <button onClick={() => setter({ name: "", file: null })} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500" aria-label={`Remove ${label}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <input id={inputId} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleDocUpload(e, setter)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Preferences card ────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Preferences</h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Preferred Contact Method</label>
            <div className="mt-3 flex gap-6">
              {(
                [
                  { value: "Email", icon: Mail,  label: "Email"           },
                  { value: "Phone", icon: Phone, label: "Phone (SMS/Call)" },
                ] as const
              ).map(({ value, icon: Icon, label }) => (
                <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="radio" name="contactMethod" checked={contactMethod === value} onChange={() => setContactMethod(value)} className="accent-blue-600 h-4 w-4 flex-shrink-0" />
                  <Icon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{label}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">This is how we&apos;ll contact you for important updates.</p>
          </div>
          <div>
            <label className={labelClass}>Language Preference</label>
            <div className="relative mt-1.5">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                {["English", "French", "Spanish", "Urdu", "Hindi", "Arabic", "Other"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Theme</label>
            <p className="mt-1 text-xs text-slate-400">Updates the dashboard immediately and persists across sessions.</p>
            <div className="mt-2 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {(
                [
                  { value: "light",  icon: Sun,     label: "Light"  },
                  { value: "dark",   icon: Moon,    label: "Dark"   },
                  { value: "system", icon: Monitor, label: "System" },
                ] as const
              ).map(({ value, icon: Icon, label }) => (
                <button key={value} type="button" onClick={() => setTheme(value)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${theme === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => showToast("Preferences saved.")} className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
            Save Preferences
          </button>
        </div>
      </div>

      {/* ── Security card ────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-sm font-semibold text-slate-700">Security</h2>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <label className={labelClass}>Current Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} required placeholder="••••••••" className={`${inputClass} pr-10`} />
              <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition mt-0.5">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>New Password</label>
            <input type={showPw ? "text" : "password"} value={newPw} onChange={(e) => setNewPw(e.target.value)} required placeholder="Min. 8 characters" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Confirm New Password</label>
            <input type={showPw ? "text" : "password"} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required placeholder="Repeat new password" className={inputClass} />
          </div>
          <button type="submit" disabled={pwSaving} className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95 disabled:opacity-50">
            {pwSaving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
