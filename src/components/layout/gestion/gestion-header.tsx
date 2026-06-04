import Image from "next/image";
import Link from "next/link";
import { Menu, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { menuGestion } from "@/lib/navigation/menus";
import { Routes } from "@/lib/routes";
import {
  BoutonDeconnexionMenu,
  BoutonDeconnexionMenuMobile,
} from "@/components/auth/bouton-deconnexion";
import { Separator } from "@/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { exigerConnexion } from "@/lib/authentification";

export async function GestionHeader() {
  const session = await exigerConnexion();

  return (
    <header className="border-b-2 border-primary bg-black text-white">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <Link href={Routes.GESTION} className="flex items-center gap-4">
          <Image
            src="/logo-ascpa-badminton.png"
            alt="Pessac Badminton"
            width={56}
            height={56}
          />

          <div>
            <h1 className="text-lg font-bold text-primary">Pessac Badminton</h1>

            <p className="text-sm text-gray-300">Gestion du site</p>
          </div>
        </Link>

        <div className="hidden md:block">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem className="relative">
                <NavigationMenuTrigger>
                  <User className="mr-2 h-4 w-4" />
                  {session.user.name}
                </NavigationMenuTrigger>

                <NavigationMenuContent className="md:right-0 md:left-auto">
                  <ul className="grid w-48 gap-1 p-2">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href={Routes.MON_COMPTE}>
                          <User className="h-4 w-4" />
                          Mon compte
                        </Link>
                      </NavigationMenuLink>
                    </li>

                    <li>
                      <BoutonDeconnexionMenu />
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Gestion du site</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {session.user.name}
                </p>
              </SheetHeader>

              <div className="px-2 flex-1 overflow-y-auto pb-6">
                <nav className="flex flex-col gap-2">
                  {menuGestion.map((item) => {
                    const Icon = item.icon;

                    return (
                      <SheetClose key={item.href} asChild>
                        <Link
                          href={item.href!}
                          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          {item.libelle}
                        </Link>
                      </SheetClose>
                    );
                  })}

                  <Separator className="my-4" />

                  <SheetClose asChild>
                    <Link
                      href={Routes.MON_COMPTE}
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                    >
                      <User className="h-4 w-4" />
                      Mon compte
                    </Link>
                  </SheetClose>

                  <BoutonDeconnexionMenuMobile />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
