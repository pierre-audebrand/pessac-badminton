export const Routes = {
  ACCUEIL: "/",

  CLUB_PRESENTATION: "/club/presentation",
  CLUB_BUREAU: "/club/bureau",
  CLUB_SALLES: "/club/salles",
  CLUB_PARTENAIRES: "/club/partenaires",
  CLUB_LIENS_UTILES: "/club/liens-utiles",

  CRENEAUX: "/creneaux",

  TARIFS: "/inscription/tarifs",
  DOCUMENTS_INSCRIPTION: "/inscription/documents",
  REGLEMENT_INTERIEUR: "/inscription/reglement-interieur",

  ACTUALITES: "/actualites",

  CONTACT: "/contact",

  CONNEXION: "/connexion",

  MON_COMPTE: "/mon-compte",
  BOUTIQUE: "/boutique",

  GESTION: "/gestion",

  GESTION_UTILISATEURS: "/gestion/utilisateurs",
  GESTION_UTILISATEURS_CREER: "/gestion/utilisateurs/creer",
  utilisateur(id: string) {
    return `/gestion/utilisateurs/${id}`;
  },
  modifierUtilisateur(id: string) {
    return `/gestion/utilisateurs/${id}/modifier`;
  },

  rolesUtilisateur(id: string) {
    return `/gestion/utilisateurs/${id}/roles`;
  },

  groupesUtilisateur(id: string) {
    return `/gestion/utilisateurs/${id}/groupes`;
  },

  GESTION_ROLES: "/gestion/roles",
  GESTION_ROLES_CREER: "/gestion/roles/creer",
  role(id: string) {
    return `/gestion/roles/${id}`;
  },
  modifierRole(id: string) {
    return `/gestion/roles/${id}/modifier`;
  },

  GESTION_PERMISSIONS: "/gestion/permissions",
  permission(id: string) {
    return `/gestion/permissions/${id}`;
  },

  GESTION_GROUPES: "/gestion/groupes",
  GESTION_GROUPES_CREER: "/gestion/groupes/creer",
  groupe(id: string) {
    return `/gestion/groupes/${id}`;
  },
  modifierGroupe(id: string) {
    return `/gestion/groupes/${id}/modifier`;
  },

  GESTION_SALLES: "/gestion/salles",
  GESTION_SALLES_CREER: "/gestion/salles/creer",
  salle(id: string) {
    return `/gestion/salles/${id}`;
  },
  modifierSalle(id: string) {
    return `/gestion/salles/${id}/modifier`;
  },

  GESTION_CRENEAUX: "/gestion/creneaux",
  GESTION_CRENEAUX_CREER: "/gestion/creneaux/creer",
  creneau(id: string) {
    return `/gestion/creneaux/${id}`;
  },
  modifierCreneau(id: string) {
    return `/gestion/creneaux/${id}/modifier`;
  },

  groupesCreneau(id: string) {
    return `/gestion/creneaux/${id}/groupes`;
  },

  GESTION_INDISPONIBILITES: "/gestion/indisponibilites",
  GESTION_INDISPONIBILITES_CREER: "/gestion/indisponibilites/creer",
  indisponibilite(id: string) {
    return `/gestion/indisponibilites/${id}`;
  },
  modifierIndisponibilite(id: string) {
    return `/gestion/indisponibilites/${id}/modifier`;
  },

  GESTION_PAGES: "/gestion/pages",
  GESTION_PAGES_CREER: "/gestion/pages/creer",
  page(id: string) {
    return `/gestion/pages/${id}`;
  },
  modifierPage(id: string) {
    return `/gestion/pages/${id}/modifier`;
  },

  GESTION_MENUS: "/gestion/menus",

  GESTION_MENU_ITEMS: "/gestion/menu-items",
  GESTION_MENU_ITEMS_CREER: "/gestion/menu-items/creer",
  menuItem(id: string) {
    return `/gestion/menu-items/${id}`;
  },
  modifierMenuItem(id: string) {
    return `/gestion/menu-items/${id}/modifier`;
  },
};
