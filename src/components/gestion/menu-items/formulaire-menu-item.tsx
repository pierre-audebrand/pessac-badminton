"use client";

import { useActionState, useState } from "react";

import { Menu, Page } from "@prisma/client";

import type { MenuItemFormState } from "@/actions/menu-item.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { libelleMenu } from "../../../lib/menus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Folder, FileText, Globe } from "lucide-react";

type TypeMenuItem = "NONE" | "PAGE" | "URL";

type Props = {
  action: (
    state: MenuItemFormState,
    formData: FormData,
  ) => Promise<MenuItemFormState>;

  pages: Pick<Page, "id" | "titre">[];

  parentsParMenu: Record<
    Menu,
    {
      id: string;
      libelle: string;
    }[]
  >;

  afficherSelectionMenu?: boolean;

  menuParDefaut?: Menu;

  menuItem?: {
    menu: Menu;
    parentId: string | null;
    libelle: string;
    pageId: string | null;
    url: string | null;
    ordre: number;
    nouvelOnglet: boolean;
    actif: boolean;
  };

  texteBouton: string;
};

const initialState: MenuItemFormState = {};

export function FormulaireMenuItem({
  action,
  pages,
  parentsParMenu,
  afficherSelectionMenu = true,
  menuParDefaut,
  menuItem,
  texteBouton,
}: Props) {
  const [state, formAction] = useActionState(action, initialState);

  const [typeMenuItem, setTypeMenuItem] = useState<TypeMenuItem>(() => {
    if (menuItem?.pageId) {
      return "PAGE";
    }

    if (menuItem?.url) {
      return "URL";
    }

    return "NONE";
  });

  const [menu, setMenu] = useState(
    menuItem?.menu ?? menuParDefaut ?? Menu.EN_TETE,
  );

  const [parentId, setParentId] = useState<string | null>(
    menuItem?.parentId ?? null,
  );

  const [pageId, setPageId] = useState<string | null>(menuItem?.pageId ?? null);

  const [url, setUrl] = useState(menuItem?.url ?? "");

  const parents = parentsParMenu[menu];

  return (
    <form action={formAction} className="max-w-2xl space-y-6" noValidate>
      <div className="space-y-2">
        {afficherSelectionMenu ? (
          <>
            <Label htmlFor="menu" required>
              Menu
            </Label>

            <input type="hidden" name="menu" value={menu} />

            <Select
              value={menu}
              onValueChange={(value) => {
                setMenu(value as Menu);
                setParentId(null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={Menu.EN_TETE}>
                  {libelleMenu(Menu.EN_TETE)}
                </SelectItem>

                <SelectItem value={Menu.PIED_DE_PAGE}>
                  {libelleMenu(Menu.PIED_DE_PAGE)}
                </SelectItem>
              </SelectContent>
            </Select>

            {state.erreurs?.menu?.map((erreur) => (
              <p key={erreur} className="text-sm text-destructive">
                {erreur}
              </p>
            ))}
          </>
        ) : (
          <>
            <input type="hidden" name="menu" value={menu} />

            <div className="space-y-2">
              <Label>Menu</Label>

              <p className="text-sm text-muted-foreground">
                {libelleMenu(menu)}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="parentId">Parent</Label>

        <input type="hidden" name="parentId" value={parentId ?? ""} />

        <Select
          value={parentId ?? "_none"}
          onValueChange={(value) =>
            setParentId(value === "_none" ? null : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Aucun parent" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="_none">Aucun</SelectItem>

            {parents.map((parent) => (
              <SelectItem key={parent.id} value={parent.id}>
                {parent.libelle}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {state.erreurs?.parentId?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="libelle" required>
          Libellé
        </Label>

        <Input
          id="libelle"
          name="libelle"
          required
          defaultValue={menuItem?.libelle}
        />

        {state.erreurs?.libelle?.map((erreur) => (
          <p key={erreur} className="text-sm text-destructive">
            {erreur}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Type</Label>

        <ToggleGroup
          type="single"
          value={typeMenuItem}
          variant="outline"
          spacing={2}
          className="w-full justify-start"
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            const type = value as TypeMenuItem;

            setTypeMenuItem(type);

            switch (type) {
              case "NONE":
                setPageId(null);
                setUrl("");
                break;

              case "PAGE":
                setUrl("");
                if (!pageId && pages.length === 1) {
                  setPageId(pages[0].id);
                }
                break;

              case "URL":
                setPageId(null);
                break;
            }
          }}
        >
          <ToggleGroupItem value="NONE" className="min-w-36">
            <Folder className="mr-2 h-4 w-4" />
            Sans lien
          </ToggleGroupItem>

          <ToggleGroupItem value="PAGE" className="min-w-32">
            <FileText className="mr-2 h-4 w-4" />
            Page
          </ToggleGroupItem>

          <ToggleGroupItem value="URL" className="min-w-28">
            <Globe className="mr-2 h-4 w-4" />
            URL
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {typeMenuItem === "PAGE" && (
        <div className="space-y-2">
          <Label htmlFor="pageId" required>
            Page
          </Label>

          <input type="hidden" name="pageId" value={pageId ?? ""} />

          <Select
            value={pageId ?? "_none"}
            onValueChange={(value) =>
              setPageId(value === "_none" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une page" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="_none">Sélectionner une page</SelectItem>

              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.titre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {state.erreurs?.pageId?.map((erreur) => (
            <p key={erreur} className="text-sm text-destructive">
              {erreur}
            </p>
          ))}
        </div>
      )}

      {typeMenuItem === "URL" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="url" required>
              URL
            </Label>

            <Input
              id="url"
              name="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />

            {state.erreurs?.url?.map((erreur) => (
              <p key={erreur} className="text-sm text-destructive">
                {erreur}
              </p>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="nouvelOnglet"
              name="nouvelOnglet"
              type="checkbox"
              defaultChecked={menuItem?.nouvelOnglet}
              className="h-4 w-4"
            />

            <Label htmlFor="nouvelOnglet">Ouvrir dans un nouvel onglet</Label>
          </div>

          {state.erreurs?.nouvelOnglet?.map((erreur) => (
            <p key={erreur} className="text-sm text-destructive">
              {erreur}
            </p>
          ))}
        </>
      )}

      <div className="flex items-center gap-3">
        <input
          id="actif"
          name="actif"
          type="checkbox"
          defaultChecked={menuItem?.actif ?? true}
          className="h-4 w-4"
        />

        <Label htmlFor="actif">Élément actif</Label>
      </div>

      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit">{texteBouton}</Button>
    </form>
  );
}
