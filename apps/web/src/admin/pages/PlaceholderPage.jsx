import { Construction } from 'lucide-react';

export function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Construction className="h-12 w-12 mb-4" />
      <h2 className="text-xl font-semibold text-foreground">{title || 'En construcción'}</h2>
      <p className="mt-2">Esta sección estará disponible próximamente.</p>
    </div>
  );
}
