import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Separator } from '@/components/ui/separator.jsx';

const FilterPanel = ({
  categoryFilter,
  setCategoryFilter,
  availableCategories,
  sortBy,
  setSortBy,
  priceRange,
  setPriceRange,
  minPrice,
  maxPrice,
  selectedAllergens,
  setSelectedAllergens,
  availableAllergens
}) => {
  const handleAllergenToggle = (allergen) => {
    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Categoría</Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full bg-white text-gray-900">
            <SelectValue placeholder="Todas las Categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {availableCategories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">
          Rango de Precio: €{priceRange[0]} - €{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={minPrice}
          max={maxPrice}
          step={0.5}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>€{minPrice}</span>
          <span>€{maxPrice}</span>
        </div>
      </div>

      <Separator />

      {/* Allergen Filter */}
      {availableAllergens.length > 0 && (
        <>
          <div>
            <Label className="text-sm font-semibold mb-3 block">
              Excluir Alérgenos
            </Label>
            <div className="space-y-3">
              {availableAllergens.map(allergen => (
                <div key={allergen} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergen-${allergen}`}
                    checked={selectedAllergens.includes(allergen)}
                    onCheckedChange={() => handleAllergenToggle(allergen)}
                  />
                  <Label
                    htmlFor={`allergen-${allergen}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {allergen}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />
        </>
      )}

      {/* Sort By */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Ordenar por</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full bg-white text-gray-900">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más Recientes</SelectItem>
            <SelectItem value="popularity">Más Populares</SelectItem>
            <SelectItem value="rating">Mejor Calificadas</SelectItem>
            <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterPanel;
