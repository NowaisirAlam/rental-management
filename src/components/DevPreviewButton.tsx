"use client";

import { useRouter } from "next/navigation";

export default function DevPreviewButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        localStorage.setItem("role", "tenant");
        localStorage.setItem("tenantOnboarded", "true");
        router.push("/tenant/dashboard");
      }}
      className="rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95"
    >
      Tenant Dashboard
    </button>
  );
}
