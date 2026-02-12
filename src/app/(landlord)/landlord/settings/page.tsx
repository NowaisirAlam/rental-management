import { TopBar } from "@/components/landlord/topbar";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" />
      <main className="mx-auto max-w-2xl p-6">
        {/* Profile */}
        <section className="rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-accent">Profile</h2>
          <div className="space-y-4">
            {/* TODO: Connect to API when auth is implemented */}
            <Field label="Full Name" placeholder="John Doe" />
            <Field label="Email" placeholder="john@example.com" type="email" />
            <Field label="Phone" placeholder="512-555-0100" type="tel" />
            <Field label="Company Name" placeholder="JD Properties LLC" />
          </div>
          <button
            disabled
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white opacity-50"
          >
            Save Changes
          </button>
        </section>

        {/* Notification Preferences */}
        <section className="mt-6 rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-accent">
            Notification Preferences
          </h2>
          {/* TODO: Wire to notification settings API */}
          <div className="space-y-3">
            <Toggle label="In-app notifications" defaultChecked />
            <Toggle label="Email notifications" />
            <Toggle label="Rent reminder alerts" defaultChecked />
            <Toggle label="Maintenance ticket updates" defaultChecked />
          </div>
        </section>

        {/* Account */}
        <section className="mt-6 rounded-xl border border-border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-accent">Account</h2>
          <div className="flex flex-wrap gap-3">
            {/* TODO: Implement change password flow */}
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-accent transition hover:bg-surface">
              Change Password
            </button>
            {/* TODO: Implement account deletion with confirmation */}
            <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-accent">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        disabled
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted"
      />
    </div>
  );
}

function Toggle({
  label,
  defaultChecked = false,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm text-accent">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled
        className="h-4 w-4 rounded border-border"
      />
      {label}
    </label>
  );
}
