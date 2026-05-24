import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Input } from '@/components/ui/input.jsx';

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
        <Label className="text-sm font-semibold mb-3 block">Rango de Precio</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={minPrice}
          max={maxPrice}
          step={0.5}
          className="mb-4"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Mínimo</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
              <Input
                type="number"
                value={priceRange[0]}
                min={minPrice}
                max={priceRange[1]}
                step={0.5}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), priceRange[1]);
                  setPriceRange([Math.max(val, minPrice), priceRange[1]]);
                }}
                className="pl-5 h-8 text-sm bg-white"
              />
            </div>
          </div>
          <span className="text-muted-foreground mt-5">—</span>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground mb-1 block">Máximo</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
              <Input
                type="number"
                value={priceRange[1]}
                min={priceRange[0]}
                max={maxPrice}
                step={0.5}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], Math.min(val, maxPrice)]);
                }}
                className="pl-5 h-8 text-sm bg-white"
              />
            </div>
          </div>
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
