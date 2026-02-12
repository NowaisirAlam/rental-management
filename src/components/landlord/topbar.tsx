import { Bell } from "lucide-react";

export function TopBar({ title }: { title: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      {/* Left: spacer for mobile hamburger + title */}
      <div className="flex items-center gap-4">
        <div className="w-10 lg:hidden" /> {/* spacer for mobile hamburger button */}
        <h1 className="text-xl font-semibold text-accent">{title}</h1>
      </div>

      {/* Right: notification bell + user avatar */}
      <div className="flex items-center gap-4">
        {/* TODO: Wire to notifications API */}
        <button className="relative rounded-lg p-2 text-muted transition hover:bg-surface hover:text-accent">
          <Bell className="h-5 w-5" />
          {/* TODO: Unread count badge */}
        </button>

        {/* TODO: Replace with real user data from session */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-sm font-semibold text-primary">
          JD
        </div>
      </div>
    </header>
  );
}
