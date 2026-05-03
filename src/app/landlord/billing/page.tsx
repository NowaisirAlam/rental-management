"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, X } from "lucide-react";

const features = [
  "Up to 50 properties",
  "Unlimited tenants",
  "Rent tracking",
  "Maintenance tickets",
  "Reports and CSV exports",
];

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl bg-[#1A1714] px-5 py-3 text-[#F0EBE1] shadow-xl">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#6B8F5E]" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-[#A99E90] transition hover:text-[#F0EBE1]">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function LandlordBillingPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showComingSoon = () => {
    setToast("Stripe checkout coming soon.");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#141210] px-8 py-8 text-[#F0EBE1]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/landlord/properties"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#A99E90] transition hover:text-[#F0EBE1]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to properties
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C4956A]">PropManager Pro</p>
            <h1 className="mt-3 font-serif text-5xl font-normal leading-tight text-[#F0EBE1]">
              Upgrade to PropManager Pro
            </h1>
            <div className="mt-5 flex items-end gap-3">
              <span className="text-6xl font-semibold tracking-tight">$29</span>
              <span className="pb-2 text-xl text-[#A99E90]">/ month</span>
            </div>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#A99E90]">
              Free plan includes 1 property. Pro unlocks up to 50 properties so your portfolio can keep growing.
            </p>

            <div className="mt-12 max-w-2xl rounded-2xl border border-[#2E281F] bg-[#1D1915] p-6 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#F0EBE1]">Professional Plan</h2>
                  <p className="mt-1 text-base text-[#A99E90]">Built for active landlords and property managers.</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-[#F0EBE1]">$29.00</p>
                  <p className="text-sm text-[#A99E90]">Billed monthly</p>
                </div>
              </div>

              <div className="my-6 border-t border-[#2E281F]" />

              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-base text-[#F0EBE1]">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-[#6B8F5E]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="my-6 border-t border-[#2E281F]" />

              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">$29.00</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xl">
                <span className="font-semibold">Total due today</span>
                <span className="font-semibold">$29.00</span>
              </div>
            </div>
          </section>

          <aside className="lg:pt-12">
            <div className="overflow-hidden rounded-2xl border border-[#2E281F] bg-[#1D1915] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#2E281F] px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C4956A]/20">
                    <ShieldCheck className="h-5 w-5 text-[#C4956A]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#F0EBE1]">Secure checkout</p>
                    <p className="text-sm text-[#A99E90]">Stripe integration placeholder</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 px-7 py-7">
                <div className="rounded-xl border border-[#2E281F] bg-[#2A241E] p-5">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-[#C4956A]" />
                    <div>
                      <p className="font-semibold text-[#F0EBE1]">Card attachment coming soon</p>
                      <p className="mt-1 text-sm leading-6 text-[#A99E90]">
                        New users will add their card through Stripe Checkout. PropManager will never store raw card details.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={showComingSoon}
                  className="w-full rounded-xl bg-[#C4956A] px-5 py-4 text-base font-bold text-[#1A1714] transition hover:bg-[#B07E55] active:scale-[0.99]"
                >
                  Upgrade to Pro - $29/month
                </button>

                <p className="text-center text-sm leading-6 text-[#A99E90]">
                  Stripe checkout will be connected here later. For now, this page previews the Pro upgrade flow.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
