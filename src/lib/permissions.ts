export const Permissions = {
  UTILISATEURS_GERER: {
    code: "utilisateurs:gerer",
    libelle: "Gestion des utilisateurs",
    description: "Créer, modifier, activer et désactiver les utilisateurs",
  },

  ROLES_GERER: {
    code: "roles:gerer",
    libelle: "Gestion des rôles",
    description: "Créer et modifier les rôles",
  },

  PERMISSIONS_CONSULTER: {
    code: "permissions:consulter",
    libelle: "Consultation des permissions",
    description: "Consulter les permissions disponibles dans l'application",
  },

  PAGES_GERER: {
    code: "pages:gerer",
    libelle: "Gestion des pages",
    description: "Créer et modifier les pages du site",
  },

  ACTUALITES_GERER: {
    code: "actualites:gerer",
    libelle: "Gestion des actualités",
    description: "Créer et publier des actualités",
  },

  DOCUMENTS_GERER: {
    code: "documents:gerer",
    libelle: "Gestion des documents",
    description: "Gérer les documents du club",
  },

  SALLES_GERER: {
    code: "salles:gerer",
    libelle: "Gestion des salles",
    description: "Créer et modifier les salles",
  },

  CRENEAUX_GERER: {
    code: "creneaux:gerer",
    libelle: "Gestion des créneaux",
    description: "Créer et modifier les créneaux",
  },

  GROUPES_GERER: {
    code: "groupes:gerer",
    libelle: "Gestion des groupes",
    description: "Créer et modifier les groupes",
  },

  STOCK_GERER: {
    code: "stock:gerer",
    libelle: "Gestion du stock",
    description: "Gérer le matériel et les consommables",
  },

  COMMANDES_GERER: {
    code: "commandes:gerer",
    libelle: "Gestion des commandes",
    description: "Gérer les commandes fournisseurs",
  },
} as const;

export const permissions = Object.values(Permissions);
