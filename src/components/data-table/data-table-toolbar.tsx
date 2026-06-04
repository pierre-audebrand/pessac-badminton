"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface DataTableToolbarProps {
  placeholder?: string;
}

export function DataTableToolbar({ placeholder }: DataTableToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const updateSearch = useDebouncedCallback((newValue: string) => {
    const query = new URLSearchParams(searchParams.toString());

    if (newValue.trim()) {
      query.set("q", newValue);
    } else {
      query.delete("q");
    }

    query.set("page", "1");

    router.replace(`${pathname}?${query.toString()}`);
  }, 300);

  return (
    <Input
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;

        setValue(newValue);
        updateSearch(newValue);
      }}
      placeholder={placeholder}
      className="max-w-sm"
    />
  );
}
