import { useState } from "react";

export function useSelectState<T extends string>(initial?: T | null) {
  return useState<T | undefined>(initial ?? undefined);
}
