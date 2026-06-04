import { recupererUtilisateurParEmail } from "@/services/utilisateur.service";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Mot de passe",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("Tentative connexion :", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const utilisateur = await recupererUtilisateurParEmail(
          credentials.email,
        );

        console.log("Utilisateur trouvé :", !!utilisateur);

        if (!utilisateur || !utilisateur.actif) {
          return null;
        }

        const motDePasseValide = await bcrypt.compare(
          credentials.password,
          utilisateur.motDePasseHash,
        );

        console.log("Mot de passe valide :", motDePasseValide);

        if (!motDePasseValide) {
          return null;
        }

        const roles = [...new Set(utilisateur.roles.map((ur) => ur.role.nom))];

        const permissions = [
          ...new Set(
            utilisateur.roles.flatMap((ur) =>
              ur.role.permissions.map((rp) => rp.permission.code),
            ),
          ),
        ];

        return {
          id: utilisateur.id,
          email: utilisateur.email,
          name: `${utilisateur.prenom} ${utilisateur.nom}`,
          roles,
          permissions,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.roles = token.roles;
      session.user.permissions = token.permissions;

      return session;
    },
  },
};
