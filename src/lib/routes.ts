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
  GESTION_UTILISATEURS_NOUVEL: "/gestion/utilisateurs/nouvel",
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
  GESTION_ROLES_NOUVEAU: "/gestion/roles/nouveau",
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
  GESTION_GROUPES_NOUVEAU: "/gestion/groupes/nouveau",
  groupe(id: string) {
    return `/gestion/groupes/${id}`;
  },
  modifierGroupe(id: string) {
    return `/gestion/groupes/${id}/modifier`;
  },

  GESTION_SALLES: "/gestion/salles",
  GESTION_SALLES_NOUVELLE: "/gestion/salles/nouvelle",
  salle(id: string) {
    return `/gestion/salles/${id}`;
  },
  modifierSalle(id: string) {
    return `/gestion/salles/${id}/modifier`;
  },

  GESTION_CRENEAUX: "/gestion/creneaux",
  GESTION_CRENEAUX_NOUVEAU: "/gestion/creneaux/nouveau",
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
  GESTION_INDISPONIBILITES_NOUVELLE: "/gestion/indisponibilites/nouvelle",
  indisponibilite(id: string) {
    return `/gestion/indisponibilites/${id}`;
  },
  modifierIndisponibilite(id: string) {
    return `/gestion/indisponibilites/${id}/modifier`;
  },

  GESTION_PAGES: "/gestion/pages",
  GESTION_PAGES_NOUVELLE: "/gestion/pages/nouvelle",
  page(id: string) {
    return `/gestion/pages/${id}`;
  },
  modifierPage(id: string) {
    return `/gestion/pages/${id}/modifier`;
  },

  GESTION_MENUS: "/gestion/menus",

  GESTION_MENU_ITEMS: "/gestion/menu-items",
  GESTION_MENU_ITEMS_NOUVEAU: "/gestion/menu-items/nouvelle",
  menuItem(id: string) {
    return `/gestion/menu-items/${id}`;
  },
  modifierMenuItem(id: string) {
    return `/gestion/menu-items/${id}/modifier`;
  },
};
