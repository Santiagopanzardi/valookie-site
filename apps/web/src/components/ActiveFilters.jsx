import React from 'react';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { X } from 'lucide-react';

const ActiveFilters = ({
  searchQuery,
  categoryFilter,
  priceRange,
  minPrice,
  maxPrice,
  selectedAllergens,
  onClearSearch,
  onClearCategory,
  onClearPriceRange,
  onClearAllergen,
  onClearAll
}) => {
  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== 'all' ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    selectedAllergens.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 p-4 bg-secondary/20 rounded-lg border border-border">
      <span className="text-sm font-medium text-muted-foreground">
        Filtros activos:
      </span>

      {searchQuery && (
        <Badge variant="secondary" className="gap-1 pr-1">
          Búsqueda: "{searchQuery}"
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onClearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {categoryFilter !== 'all' && (
        <Badge variant="secondary" className="gap-1 pr-1">
          Categoría: {categoryFilter}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onClearCategory}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
        <Badge variant="secondary" className="gap-1 pr-1">
          Precio: €{priceRange[0]} - €{priceRange[1]}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={onClearPriceRange}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {selectedAllergens.map(allergen => (
        <Badge key={allergen} variant="secondary" className="gap-1 pr-1">
          Sin {allergen}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onClearAllergen(allergen)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={onClearAll}
        className="ml-auto text-xs h-7"
      >
        Limpiar Todo
      </Button>
    </div>
  );
};

export default ActiveFilters;
