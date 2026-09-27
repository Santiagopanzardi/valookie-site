import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function RecipesPage() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [collectionMissing, setCollectionMissing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Load ingredients first (may not exist yet)
      let ingredientsList = [];
      try {
        ingredientsList = await pb.collection('ingredients').getFullList({
          $autoCancel: false,
        });
      } catch (err) {
        // ingredients collection may not exist yet
      }
      setIngredients(ingredientsList);

      // Load products (for linking)
      let productsList = [];
      try {
        productsList = await pb.collection('products').getFullList({
          $autoCancel: false,
        });
      } catch (err) {
        // products collection may not exist yet
      }
      setProducts(productsList);

      // Load recipes
      const recipesList = await pb.collection('recipes').getFullList({
        sort: 'name',
        $autoCancel: false,
      });
      setRecipes(recipesList);
      setCollectionMissing(false);
    } catch (error) {
      if (error?.status === 404 || error?.message?.includes('Missing collection')) {
        setCollectionMissing(true);
      } else {
        console.error('Error al cargar recetas:', error);
        toast.error('Error al cargar las recetas');
      }
    } finally {
      setLoading(false);
    }
  };

  // Build a map of ingredient id -> costPerUnit for fast lookup
  const ingredientCostMap = useMemo(() => {
    const map = {};
    for (const ing of ingredients) {
      map[ing.id] = ing.costPerUnit ?? 0;
    }
    return map;
  }, [ingredients]);

  // Build product name map
  const productNameMap = useMemo(() => {
    const map = {};
    for (const p of products) {
      map[p.id] = p.name || p.title || p.id;
    }
    return map;
  }, [products]);

  const computeCostPerCookie = (recipe) => {
    const recipeIngredients = recipe.ingredients || [];
    const ingredientsCost = recipeIngredients.reduce((sum, ri) => {
      const unitCost = ingredientCostMap[ri.ingredientId] ?? 0;
      return sum + unitCost * (ri.quantity || 0);
    }, 0);

    const totalCost =
      ingredientsCost +
      (recipe.laborCostPerBatch || 0) +
      (recipe.overheadPerBatch || 0);

    const yieldCount = recipe.yield || 1;
    return totalCost / yieldCount;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await pb.collection('recipes').delete(deleteTarget);
      setRecipes((prev) => prev.filter((r) => r.id !== deleteTarget));
      toast.success('Receta eliminada');
    } catch (error) {
      console.error('Error al eliminar receta:', error);
      toast.error('Error al eliminar la receta');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'productId',
      label: 'Producto vinculado',
      render: (row) =>
        row.productId ? (
          productNameMap[row.productId] || row.productId
        ) : (
          <span className="text-muted-foreground">Sin vincular</span>
        ),
    },
    {
      key: 'yield',
      label: 'Rendimiento',
      render: (row) =>
        row.yield ? `${row.yield} cookies/lote` : '—',
    },
    {
      key: 'costPerCookie',
      label: 'Costo/cookie',
      render: (row) => (
        <span className="font-mono">
          {formatCurrency(computeCostPerCookie(row))}
        </span>
      ),
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (row) =>
        row.isActive !== false ? (
          <Badge className="bg-green-100 text-green-800">Activa</Badge>
        ) : (
          <Badge variant="secondary">Inactiva</Badge>
        ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/recipes/${row.id}`);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteTarget(row.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Collection missing banner */}
      {collectionMissing && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm">
              La colección <strong>recipes</strong> no existe todavía en
              PocketBase. Créala desde el panel de administración de PocketBase
              con los campos: name (text), productId (text), yield (number),
              laborCostPerBatch (number), overheadPerBatch (number), isActive
              (bool), ingredients (json).
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Recetas</CardTitle>
          <Button onClick={() => navigate('/admin/recipes/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva receta
          </Button>
        </CardHeader>
        <DataTable
          columns={columns}
          data={recipes}
          loading={loading}
          searchField="name"
          searchPlaceholder="Buscar receta..."
          emptyMessage={
            collectionMissing
              ? 'La colección aún no existe en PocketBase'
              : 'No hay recetas registradas'
          }
        />
      </Card>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar receta"
        description="Se eliminará esta receta. Esta acción no se puede deshacer."
        onConfirm={handleDelete}
      />
    </div>
  );
}
