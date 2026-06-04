import { GestionHeader } from "@/components/layout/gestion/gestion-header";
import { GestionSidebar } from "@/components/layout/gestion/gestion-sidebar";
import { exigerRole } from "@/lib/autorisations";
import { Roles } from "@/lib/roles";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigerRole(Roles.ADMIN);

  return (
    <div className="flex min-h-screen flex-col">
      <GestionHeader />

      <div className="flex flex-1 min-w-0">
        <GestionSidebar />

        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
