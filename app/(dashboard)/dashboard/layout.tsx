import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Toaster position="top-center" richColors />
      {children}
    </div>
  );
}
