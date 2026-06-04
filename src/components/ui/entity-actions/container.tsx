interface EntityActionsProps {
  children: React.ReactNode;
}

export function EntityContainer({ children }: EntityActionsProps) {
  return <div className="flex justify-end gap-2">{children}</div>;
}
