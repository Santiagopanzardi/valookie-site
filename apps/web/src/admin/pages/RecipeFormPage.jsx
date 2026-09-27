import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { INGREDIENT_UNITS } from '@/admin/lib/constants';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const EMPTY_INGREDIENT_ROW = { ingredientId: '', quantity: '', unit: '' };

export function RecipeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [productId, setProductId] = useState('');
  const [yieldCount, setYieldCount] = useState('');
  const [laborCostPerBatch, setLaborCostPerBatch] = useState('');
  const [overheadPerBatch, setOverheadPerBatch] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [recipeIngredients, setRecipeIngredients] = useState([
    { ...EMPTY_INGREDIENT_ROW },
  ]);

  const [allProducts, setAllProducts] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load products
      let productsList = [];
      try {
        productsList = await pb.collection('products').getFullList({
          sort: 'name',
          $autoCancel: false,
        });
      } catch (err) {
        // products collection may not exist yet
      }
      setAllProducts(productsList);

      // Load ingredients
      let ingredientsList = [];
      try {
        ingredientsList = await pb.collection('ingredients').getFullList({
          sort: 'name',
          $autoCancel: false,
        });
      } catch (err) {
        // ingredients collection may not exist yet
      }
      setAllIngredients(ingredientsList);

      // If editing, load the recipe
      if (id) {
        try {
          const recipe = await pb.collection('recipes').getOne(id, {
            $autoCancel: false,
          });
          setName(recipe.name || '');
          setProductId(recipe.productId || '');
          setYieldCount(recipe.yield ?? '');
          setLaborCostPerBatch(recipe.laborCostPerBatch ?? '');
          setOverheadPerBatch(recipe.overheadPerBatch ?? '');
          setIsActive(recipe.isActive !== false);
          if (recipe.ingredients && recipe.ingredients.length > 0) {
            setRecipeIngredients(recipe.ingredients);
          }
        } catch (error) {
          console.error('Error al cargar receta:', error);
          toast.error('No se pudo cargar la receta');
          navigate('/admin/recipes');
          return;
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map of ingredient id -> ingredient record
  const ingredientMap = useMemo(() => {
    const map = {};
    for (const ing of allIngredients) {
      map[ing.id] = ing;
    }
    return map;
  }, [allIngredients]);

  // Computed cost per cookie (real-time)
  const costPerCookie = useMemo(() => {
    const ingredientsCost = recipeIngredients.reduce((sum, ri) => {
      const ing = ingredientMap[ri.ingredientId];
      if (!ing) return sum;
      return sum + (ing.costPerUnit || 0) * (parseFloat(ri.quantity) || 0);
    }, 0);

    const total =
      ingredientsCost +
      (parseFloat(laborCostPerBatch) || 0) +
      (parseFloat(overheadPerBatch) || 0);

    const y = parseFloat(yieldCount) || 0;
    return y > 0 ? total / y : 0;
  }, [recipeIngredients, laborCostPerBatch, overheadPerBatch, yieldCount, ingredientMap]);

  // --- Ingredient rows management ---
  const addIngredientRow = () => {
    setRecipeIngredients((prev) => [...prev, { ...EMPTY_INGREDIENT_ROW }]);
  };

  const removeIngredientRow = (index) => {
    setRecipeIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredientRow = (index, field, value) => {
    setRecipeIngredients((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [field]: value };
        // Auto-fill unit when ingredient is selected
        if (field === 'ingredientId') {
          const ing = ingredientMap[value];
          if (ing) {
            updated.unit = ing.unit || '';
          }
        }
        return updated;
      })
    );
  };

  const getUnitLabel = (value) =>
    INGREDIENT_UNITS.find((u) => u.value === value)?.label || value || '—';

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    if (!yieldCount || parseFloat(yieldCount) <= 0) {
      toast.error('El rendimiento debe ser mayor a 0');
      return;
    }

    // Clean ingredient rows: remove empty rows
    const cleanIngredients = recipeIngredients
      .filter((ri) => ri.ingredientId && ri.quantity)
      .map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: parseFloat(ri.quantity) || 0,
        unit: ri.unit || '',
      }));

    const payload = {
      name: name.trim(),
      productId: productId || '',
      yield: parseFloat(yieldCount) || 0,
      laborCostPerBatch: parseFloat(laborCostPerBatch) || 0,
      overheadPerBatch: parseFloat(overheadPerBatch) || 0,
      isActive,
      ingredients: cleanIngredients,
    };

    setSaving(true);
    try {
      if (isEditing) {
        await pb.collection('recipes').update(id, payload);
        toast.success('Receta actualizada');
      } else {
        await pb.collection('recipes').create(payload);
        toast.success('Receta creada');
      }
      navigate('/admin/recipes');
    } catch (error) {
      console.error('Error al guardar receta:', error);
      if (error?.status === 404 || error?.message?.includes('Missing collection')) {
        toast.error(
          'La colección "recipes" no existe en PocketBase. Créala primero desde el panel de PocketBase.'
        );
      } else {
        toast.error('Error al guardar la receta');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/admin/recipes')}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a recetas
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General info */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Editar receta' : 'Nueva receta'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipe-name">Nombre *</Label>
              <Input
                id="recipe-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Chocolate Chip Cookie"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Producto vinculado</Label>
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {allProducts.length === 0 ? (
                      <SelectItem value="_none" disabled>
                        No hay productos
                      </SelectItem>
                    ) : (
                      allProducts.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name || p.title || p.id}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipe-yield">Rendimiento (cookies/lote) *</Label>
                <Input
                  id="recipe-yield"
                  type="number"
                  min="1"
                  step="1"
                  value={yieldCount}
                  onChange={(e) => setYieldCount(e.target.value)}
                  placeholder="Ej: 24"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-labor">Costo mano de obra/lote</Label>
                <Input
                  id="recipe-labor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={laborCostPerBatch}
                  onChange={(e) => setLaborCostPerBatch(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipe-overhead">Overhead/lote</Label>
                <Input
                  id="recipe-overhead"
                  type="number"
                  step="0.01"
                  min="0"
                  value={overheadPerBatch}
                  onChange={(e) => setOverheadPerBatch(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="recipe-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="recipe-active">Receta activa</Label>
            </div>
          </CardContent>
        </Card>

        {/* Ingredients section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle>Ingredientes</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredientRow}>
              <Plus className="w-4 h-4 mr-1" />
              Añadir
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {allIngredients.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay ingredientes registrados. Añade ingredientes desde la
                página de Inventario primero.
              </p>
            )}

            {recipeIngredients.map((row, index) => (
              <div
                key={index}
                className="flex items-end gap-3 rounded-lg border p-3"
              >
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Ingrediente</Label>
                  <Select
                    value={row.ingredientId}
                    onValueChange={(val) =>
                      updateIngredientRow(index, 'ingredientId', val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {allIngredients.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id}>
                          {ing.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Cantidad</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={row.quantity}
                    onChange={(e) =>
                      updateIngredientRow(index, 'quantity', e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
                <div className="w-28 space-y-1">
                  <Label className="text-xs">Unidad</Label>
                  <Input
                    value={getUnitLabel(row.unit)}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive shrink-0"
                  onClick={() => removeIngredientRow(index)}
                  disabled={recipeIngredients.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cost summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="font-medium">Costo por cookie (estimado)</span>
            <span className="text-2xl font-bold">
              {formatCurrency(costPerCookie)}
            </span>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/recipes')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar receta'
                : 'Crear receta'}
          </Button>
        </div>
      </form>
    </div>
  );
}
