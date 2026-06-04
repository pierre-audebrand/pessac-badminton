"use client";

import { Routes } from "@/lib/routes";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export function FormulaireConnexion() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  async function connecter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const resultat = await signIn("credentials", {
      email,
      password: motDePasse,
      redirect: false,
    });

    if (resultat?.error) {
      setErreur("Email ou mot de passe incorrect");
      return;
    }

    router.push(Routes.MON_COMPTE);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <Image
            src="/logo-ascpa-badminton.png"
            alt="Pessac Badminton"
            width={120}
            height={120}
            priority
          />
        </div>

        <CardTitle className="text-2xl font-bold">Pessac Badminton</CardTitle>

        <p className="text-muted-foreground">Connexion</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={connecter} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motDePasse">Mot de passe</Label>

            <Input
              id="motDePasse"
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />
          </div>

          {erreur && <p className="text-sm text-red-500">{erreur}</p>}

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
