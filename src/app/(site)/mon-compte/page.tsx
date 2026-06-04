import { exigerConnexion } from "@/lib/authentification";
import { obtenirUtilisateurConnecte } from "@/lib/authentification";

export default async function MonComptePage() {
  await exigerConnexion();

  const utilisateur = await obtenirUtilisateurConnecte();

  return (
    <main>
      <section className="border-b py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-bold">
            Bonjour {utilisateur.prenomEtNom}
          </h1>

          <p className="mt-4 text-muted-foreground">
            Bienvenue dans votre espace utilisateur.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Mon profil</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Consultez et modifiez vos informations personnelles.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Mon adhésion</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Statut de votre inscription au club.
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="font-semibold">Mes créneaux</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Retrouvez vos séances et entraînements.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Informations du compte</h2>

          <dl className="mt-6 space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Nom</dt>

              <dd className="font-medium">{utilisateur.prenomEtNom}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>

              <dd className="font-medium">{utilisateur.email}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted-foreground">Rôles</dt>

              <dd className="font-medium">{utilisateur.roles.join(", ")}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
