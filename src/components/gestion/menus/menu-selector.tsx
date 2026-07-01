"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Menu } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { libelleMenu } from "@/lib/menus";

interface Props {
  value?: Menu;
}

export function MenuSelector({ value }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  function changerMenu(menu: Menu) {
    const params = new URLSearchParams(searchParams);

    params.set("menu", menu);

    // Retour à la première page lorsqu'on change de menu
    params.delete("page");

    router.push(`?${params.toString()}`);
  }

  return (
    <Select value={value} onValueChange={(value) => changerMenu(value as Menu)}>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Choisir un menu" />
      </SelectTrigger>

      <SelectContent>
        {Object.values(Menu).map((menu) => (
          <SelectItem key={menu} value={menu}>
            {libelleMenu(menu)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
