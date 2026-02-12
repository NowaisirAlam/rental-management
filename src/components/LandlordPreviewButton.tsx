"use client";

import { useRouter } from "next/navigation";

export default function LandlordPreviewButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        localStorage.setItem("role", "landlord");
        localStorage.setItem("landlordOnboarded", "true");
        router.push("/landlord/dashboard");
      }}
      className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
    >
      Landlord Dashboard
    </button>
  );
}
