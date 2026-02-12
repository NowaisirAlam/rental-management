"use client";

import { useState } from "react";
import { Plus, Bell, Trash2, X, CheckCircle2, ChevronDown } from "lucide-react";

type Priority = "info" | "warning" | "urgent";

type Announcement = {
  id: number;
  title: string;
  message: string;
  property: string;
  unit: string;
  priority: Priority;
  date: string;
};

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "Water Shutoff Notice",       message: "Water will be shut off on Feb 15 from 9am–1pm for plumbing maintenance in all units.", property: "Maplewood Residences", unit: "All Units", priority: "warning", date: "Feb 8, 2026"  },
  { id: 2, title: "Fire Drill — Feb 20",         message: "A mandatory fire drill is scheduled for Feb 20 at 10am. Please evacuate promptly.",     property: "Oakview Apartments",   unit: "All Units", priority: "urgent",  date: "Feb 6, 2026"  },
  { id: 3, title: "New Laundry Room Hours",      message: "The laundry room will now be open 7am–10pm daily starting March 1.",                   property: "Maplewood Residences", unit: "All Units", priority: "info",    date: "Feb 3, 2026"  },
];

const priorityConfig: Record<Priority, { badge: string; dot: string; label: string }> = {
  info:    { badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500",   label: "Info"    },
  warning: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500",  label: "Warning" },
  urgent:  { badge: "bg-red-100 text-red-700",     dot: "bg-red-500",    label: "Urgent"  },
};

const PROPERTIES = ["All Properties", "Maplewood Residences", "Oakview Apartments"];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition"><X className="h-4 w-4" /></button>
    </div>
  );
}

const inputClass = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "block text-xs font-medium uppercase tracking-wide text-slate-400";

export default function LandlordAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm]           = useState(false);
  const [toast, setToast]                 = useState<string | null>(null);

  const [title,    setTitle]    = useState("");
  const [message,  setMessage]  = useState("");
  const [property, setProperty] = useState("All Properties");
  const [unit,     setUnit]     = useState("");
  const [priority, setPriority] = useState<Priority>("info");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetForm = () => { setTitle(""); setMessage(""); setProperty("All Properties"); setUnit(""); setPriority("info"); };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ann: Announcement = {
      id: Date.now(), title, message, property, priority,
      unit: unit || "All Units",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setAnnouncements((prev) => [ann, ...prev]);
    showToast("Announcement published.");
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="px-8 py-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
          <p className="mt-1 text-sm text-slate-500">Post updates and notices for your tenants.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> New Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-slate-900">Create Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Water Shutoff Notice" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Write the full announcement for tenants…"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Property</label>
                <div className="relative">
                  <select value={property} onChange={(e) => setProperty(e.target.value)} className={selectClass}>
                    {PROPERTIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Unit <span className="font-normal normal-case text-slate-300">(optional)</span></label>
                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. Unit 2A or leave blank for all" className={inputClass} />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className={`${labelClass} mb-2`}>Priority</label>
              <div className="flex gap-2">
                {(["info", "warning", "urgent"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg border py-2 text-xs font-semibold capitalize transition ${
                      priority === p
                        ? `${priorityConfig[p].badge} border-transparent`
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
                Publish
              </button>
              <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95">
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {announcements.map((a) => {
          const cfg = priorityConfig[a.priority];
          return (
            <div key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${cfg.dot}`} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{a.property} · {a.unit}</p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a.message}</p>
                    <p className="mt-2 text-xs text-slate-400">{a.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setAnnouncements((prev) => prev.filter((x) => x.id !== a.id)); showToast("Announcement deleted."); }}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
