import Image from "next/image";
import Link from "next/link";

import { Routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { obtenirSession } from "@/lib/authentification";
import {
  BoutonDeconnexionMenu,
  BoutonDeconnexionMenuMobile,
} from "../../auth/bouton-deconnexion";
import { Roles } from "@/lib/roles";
import { LogIn, User, Settings, Menu } from "lucide-react";
import { menuSite } from "@/lib/navigation/menus";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

export default async function SiteHeader() {
  const session = await obtenirSession();

  return (
    <header className="border-b-2 border-primary bg-black text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href={Routes.ACCUEIL} className="flex items-center gap-4">
          <Image
            src="/logo-ascpa-badminton.png"
            alt="Pessac Badminton"
            width={56}
            height={56}
          />

          <div>
            <h1 className="text-lg font-bold text-primary">Pessac Badminton</h1>

            <p className="text-sm text-gray-300">Club affilié FFBaD</p>
          </div>
        </Link>

        <div className="hidden md:block">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {menuSite.map((item) => {
                if (!item.enfants?.length) {
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href!}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap"
                        >
                          {item.libelle}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={item.libelle}>
                    <NavigationMenuTrigger>
                      {item.libelle}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                      <ul className="grid w-64 gap-1 p-2">
                        {item.enfants.map((enfant) => (
                          <li key={enfant.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={enfant.href!}
                                className="block rounded-md p-3 leading-none no-underline text-white transition-colors hover:text-primary"
                              >
                                {enfant.libelle}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}

              {!session && (
                <NavigationMenuItem>
                  <Button asChild>
                    <Link href={Routes.CONNEXION}>
                      <LogIn className="h-4 w-4" />
                      Se connecter
                    </Link>
                  </Button>
                </NavigationMenuItem>
              )}

              {session && (
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

                      {session.user.roles.includes(Roles.ADMIN) && (
                        <li>
                          <NavigationMenuLink asChild>
                            <Link href={Routes.GESTION}>
                              <Settings className="h-4 w-4" />
                              Gestion du club
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )}

                      <li>
                        <BoutonDeconnexionMenu />
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Ouvrir le menu">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex flex-col sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                {session && (
                  <p className="text-sm text-muted-foreground">
                    {session.user.name}
                  </p>
                )}
              </SheetHeader>
              <div className="px-2 flex-1 overflow-y-auto pb-6">
                <nav className="flex flex-col gap-2">
                  {menuSite.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.libelle}>
                        {item.href ? (
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                            >
                              {Icon && <Icon className="h-4 w-4" />}
                              {item.libelle}
                            </Link>
                          </SheetClose>
                        ) : (
                          <div className="flex items-center gap-3 px-3 py-2 font-medium">
                            {Icon && <Icon className="h-4 w-4" />}
                            {item.libelle}
                          </div>
                        )}

                        {item.enfants && (
                          <div className="flex flex-col">
                            {item.enfants.map((enfant) => {
                              const IconEnfant = enfant.icon;
                              return (
                                <SheetClose key={enfant.href} asChild>
                                  <Link
                                    href={enfant.href!}
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                                  >
                                    {IconEnfant && (
                                      <IconEnfant className="h-4 w-4" />
                                    )}
                                    {enfant.libelle}
                                  </Link>
                                </SheetClose>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <Separator className="my-4" />

                  {!session && (
                    <SheetClose asChild>
                      <Link
                        href={Routes.CONNEXION}
                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                      >
                        <LogIn className="h-4 w-4" />
                        Se connecter
                      </Link>
                    </SheetClose>
                  )}

                  {session && (
                    <>
                      <SheetClose asChild>
                        <Link
                          href={Routes.MON_COMPTE}
                          className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                        >
                          <User className="h-4 w-4" />
                          Mon compte
                        </Link>
                      </SheetClose>

                      {session.user.roles.includes(Roles.ADMIN) && (
                        <SheetClose asChild>
                          <Link
                            href={Routes.GESTION}
                            className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                          >
                            <Settings className="h-4 w-4" />
                            Gestion du club
                          </Link>
                        </SheetClose>
                      )}

                      <BoutonDeconnexionMenuMobile />
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
