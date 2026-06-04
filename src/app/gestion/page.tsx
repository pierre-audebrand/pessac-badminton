export default function AdminPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>

        <p className="mt-2 text-muted-foreground">Bienvenue dans la gestion.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Utilisateurs</h2>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Actualités</h2>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Événements</h2>
        </div>
      </div>
    </>
  );
}
