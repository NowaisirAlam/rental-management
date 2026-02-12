import { Sidebar } from "@/components/landlord/sidebar";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="lg:ml-64">{children}</div>
    </div>
  );
}
