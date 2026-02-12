"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Home, Upload, Trash2, X, CheckCircle2, ChevronDown,
         MoreVertical, Eye, Pencil, AlertTriangle, ImagePlus } from "lucide-react";

type DocState = { name: string; file: File | null };

type Property = {
  id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  postal: string;
  units: string;
  yearBuilt: string;
  amenities: string;
  image: string;
};

const initialProperties: Property[] = [
  { id: 1, name: "Maplewood Residences", type: "Apartment Building", address: "742 Maplewood Drive", city: "Toronto",    postal: "M5V 2K1", units: "8", yearBuilt: "2001", amenities: "Parking, Laundry, Gym", image: "" },
  { id: 2, name: "Oakview Apartments",   type: "Apartment Building", address: "19 Oakview Lane",     city: "Mississauga", postal: "L5B 4T3", units: "6", yearBuilt: "1998", amenities: "Parking, Storage",      image: "" },
];

const PROPERTY_TYPES = [
  "Apartment Building", "Condo", "Single Family Home",
  "Duplex / Semi-Detached", "Townhouse", "Commercial", "Mixed-Use",
];

// ── Shared helpers ────────────────────────────────────────────────────────────

const inputClass  = "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const selectClass = "mt-1.5 w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";
const labelClass  = "block text-xs font-medium uppercase tracking-wide text-slate-400";

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-white shadow-xl">
      <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition"><X className="h-4 w-4" /></button>
    </div>
  );
}

// ── Actions menu ──────────────────────────────────────────────────────────────

function ActionsMenu({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const item = "flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors rounded-lg";

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label="Property actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
          <button className={item} onClick={() => { setOpen(false); onView(); }}>
            <Eye className="h-4 w-4 text-slate-400" /> View Property
          </button>
          <button className={item} onClick={() => { setOpen(false); onEdit(); }}>
            <Pencil className="h-4 w-4 text-slate-400" /> Edit Property
          </button>
          <div className="my-1 border-t border-slate-100" />
          <button
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <Trash2 className="h-4 w-4" /> Delete Property
          </button>
        </div>
      )}
    </div>
  );
}

// ── View property modal ───────────────────────────────────────────────────────

function ViewPropertyModal({ property, onClose, onEdit }: { property: Property; onClose: () => void; onEdit: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const row = (label: string, value: string) => value ? (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="w-28 flex-shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="flex-1 text-sm text-slate-800">{value}</span>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 p-6 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Property Details</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900 leading-snug">{property.name}</h2>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <X className="h-4 w-4" />
          </button>
        </div>
        {property.image && (
          <div className="px-6 pb-3">
            <img src={property.image} alt={property.name} className="h-40 w-full rounded-xl object-cover" />
          </div>
        )}
        <div className="px-6 pb-2">
          {row("Type",      property.type)}
          {row("Address",   `${property.address}, ${property.city} ${property.postal}`)}
          {row("Units",     property.units)}
          {row("Year Built",property.yearBuilt)}
          {row("Amenities", property.amenities)}
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
            Close
          </button>
          <button onClick={() => { onClose(); onEdit(); }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
            Edit Property
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm delete modal ──────────────────────────────────────────────────────

function ConfirmDeleteModal({ title, onCancel, onConfirm }: { title: string; onCancel: () => void; onConfirm: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-50 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">This action cannot be undone.</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onCancel} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandlordProperties() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [viewProperty,   setViewProperty]   = useState<Property | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [toast, setToast]           = useState<string | null>(null);

  // Form state
  const [name,       setName]       = useState("");
  const [type,       setType]       = useState("");
  const [address,    setAddress]    = useState("");
  const [city,       setCity]       = useState("");
  const [postal,     setPostal]     = useState("");
  const [units,      setUnits]      = useState("");
  const [yearBuilt,  setYearBuilt]  = useState("");
  const [amenities,  setAmenities]  = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Doc state
  const [ownershipDoc,     setOwnershipDoc]     = useState<DocState>({ name: "", file: null });
  const [insuranceDoc,     setInsuranceDoc]     = useState<DocState>({ name: "", file: null });
  const [registrationDoc,  setRegistrationDoc]  = useState<DocState>({ name: "", file: null });
  const [floorPlanDoc,     setFloorPlanDoc]     = useState<DocState>({ name: "", file: null });

  const imageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetForm = () => {
    setName(""); setType(""); setAddress(""); setCity(""); setPostal("");
    setUnits(""); setYearBuilt(""); setAmenities(""); setImagePreview("");
    if (imageInputRef.current) imageInputRef.current.value = "";
    setOwnershipDoc({ name: "", file: null }); setInsuranceDoc({ name: "", file: null });
    setRegistrationDoc({ name: "", file: null }); setFloorPlanDoc({ name: "", file: null });
  };

  const openEditForm = (p: Property) => {
    setEditingId(p.id);
    setName(p.name); setType(p.type); setAddress(p.address);
    setCity(p.city); setPostal(p.postal); setUnits(p.units);
    setYearBuilt(p.yearBuilt); setAmenities(p.amenities);
    setImagePreview(p.image);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingId !== null) {
      setProperties((prev) =>
        prev.map((p) => p.id === editingId
          ? { ...p, name, type, address, city, postal, units, yearBuilt, amenities, image: imagePreview }
          : p
        )
      );
      showToast(`"${name}" updated.`);
    } else {
      const newProp: Property = {
        id: Date.now(), name, type, address, city, postal, units, yearBuilt, amenities, image: imagePreview,
      };
      setProperties((prev) => [newProp, ...prev]);
      showToast(`"${name}" added successfully.`);
    }
    resetForm();
    setEditingId(null);
    setShowForm(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId === null) return;
    setProperties((prev) => prev.filter((p) => p.id !== deleteTargetId));
    setDeleteTargetId(null);
    showToast("Property removed.");
  };

  const handleDocUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<DocState>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter({ name: file.name, file });
    e.target.value = "";
  };

  const docItems = [
    { label: "Ownership Proof",       state: ownershipDoc,    setter: setOwnershipDoc    },
    { label: "Insurance Certificate", state: insuranceDoc,    setter: setInsuranceDoc    },
    { label: "Property Registration", state: registrationDoc, setter: setRegistrationDoc },
    { label: "Floor Plans",           state: floorPlanDoc,    setter: setFloorPlanDoc    },
  ];

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-sm text-slate-500">Add and manage all your properties in one place.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingId(null); setShowForm((v) => !v); }}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Property
        </button>
      </div>

      {/* Add / Edit property form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-slate-900">
            {editingId !== null ? "Edit Property" : "New Property"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Property Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Maplewood Residences" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Property Type</label>
                <div className="relative">
                  <select value={type} onChange={(e) => setType(e.target.value)} required className={selectClass}>
                    <option value="" disabled>Select type…</option>
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Street Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Main Street" className={inputClass} />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Toronto" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Postal Code</label>
                <input type="text" value={postal} onChange={(e) => setPostal(e.target.value)} required placeholder="M5V 2K1" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Number of Units</label>
                <input type="number" value={units} onChange={(e) => setUnits(e.target.value)} required min="1" placeholder="8" className={inputClass} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Year Built</label>
                <input type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} placeholder="2001" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Amenities <span className="font-normal normal-case text-slate-300">(optional)</span></label>
                <input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Parking, Gym, Laundry…" className={inputClass} />
              </div>
            </div>

            {/* Property Image */}
            <div>
              <label className={labelClass}>Property Image <span className="font-normal normal-case text-slate-300">(optional)</span></label>
              <div className="mt-1.5">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img src={imagePreview} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(""); if (imageInputRef.current) imageInputRef.current.value = ""; }}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/80 text-slate-600 shadow-sm transition hover:bg-white hover:text-red-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-8 transition hover:border-blue-400 hover:bg-blue-50">
                    <ImagePlus className="h-6 w-6 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">Click to upload JPG or PNG</span>
                    <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Document uploads */}
            <div>
              <p className={`${labelClass} mb-3`}>Documents <span className="font-normal normal-case text-slate-300">(optional)</span></p>
              <div className="grid gap-3 sm:grid-cols-2">
                {docItems.map(({ label, state, setter }) => {
                  const inputId = `prop-doc-${label.replace(/\s+/g, "-").toLowerCase()}`;
                  return (
                    <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700">{label}</p>
                        <p className="text-xs text-slate-400 truncate">{state.name || "No file"}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <label htmlFor={inputId} className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                          <Upload className="h-3 w-3" /> {state.name ? "Replace" : "Upload"}
                        </label>
                        {state.name && (
                          <button type="button" onClick={() => setter({ name: "", file: null })} className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                        <input id={inputId} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleDocUpload(e, setter)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95">
                {editingId !== null ? "Save Changes" : "Save Property"}
              </button>
              <button type="button" onClick={() => { resetForm(); setEditingId(null); setShowForm(false); }} className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Property list */}
      <div className="space-y-4">
        {properties.map((p) => (
          <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 overflow-hidden">
                  {p.image
                    ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    : <Home className="h-5 w-5 text-blue-600" />
                  }
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.address}, {p.city} {p.postal}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{p.type}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">{p.units} units</span>
                    {p.yearBuilt && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Built {p.yearBuilt}</span>}
                    {p.amenities && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">{p.amenities}</span>}
                  </div>
                </div>
              </div>
              <ActionsMenu
                onView={() => setViewProperty(p)}
                onEdit={() => openEditForm(p)}
                onDelete={() => setDeleteTargetId(p.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {viewProperty && (
        <ViewPropertyModal
          property={viewProperty}
          onClose={() => setViewProperty(null)}
          onEdit={() => { setViewProperty(null); openEditForm(viewProperty); }}
        />
      )}

      {deleteTargetId !== null && (
        <ConfirmDeleteModal
          title="Delete property?"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
