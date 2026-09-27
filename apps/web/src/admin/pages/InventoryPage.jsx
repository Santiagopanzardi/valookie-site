import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { StatCard } from '@/admin/components/StatCard.jsx';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog.jsx';
import { INGREDIENT_CATEGORIES, INGREDIENT_UNITS } from '@/admin/lib/constants';
import { formatCurrency } from '@/admin/lib/formatters';
import { Package, AlertTriangle, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const EMPTY_FORM = {
  name: '',
  unit: '',
  costPerUnit: '',
  currentStock: '',
  minStock: '',
  supplier: '',
  category: '',
};

export function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [collectionMissing, setCollectionMissing] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const data = await pb.collection('ingredients').getFullList({
        sort: 'name',
        $autoCancel: false,
      });
      setIngredients(data);
      setCollectionMissing(false);
    } catch (error) {
      if (error?.status === 404 || error?.message?.includes('Missing collection')) {
        setCollectionMissing(true);
      } else {
        console.error('Error al cargar ingredientes:', error);
        toast.error('Error al cargar los ingredientes');
      }
    } finally {
      setLoading(false);
    }
  };

  const openNewDialog = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (ingredient) => {
    setForm({
      name: ingredient.name || '',
      unit: ingredient.unit || '',
      costPerUnit: ingredient.costPerUnit ?? '',
      currentStock: ingredient.currentStock ?? '',
      minStock: ingredient.minStock ?? '',
      supplier: ingredient.supplier || '',
      category: ingredient.category || '',
    });
    setEditingId(ingredient.id);
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.unit || !form.category) {
      toast.error('Nombre, unidad y categoría son obligatorios');
      return;
    }

    const payload = {
      name: form.name,
      unit: form.unit,
      costPerUnit: parseFloat(form.costPerUnit) || 0,
      currentStock: parseFloat(form.currentStock) || 0,
      minStock: parseFloat(form.minStock) || 0,
      supplier: form.supplier,
      category: form.category,
    };

    setSaving(true);
    try {
      if (editingId) {
        const updated = await pb.collection('ingredients').update(editingId, payload);
        setIngredients((prev) =>
          prev.map((i) => (i.id === editingId ? updated : i))
        );
        toast.success('Ingrediente actualizado');
      } else {
        const created = await pb.collection('ingredients').create(payload);
        setIngredients((prev) => [...prev, created]);
        toast.success('Ingrediente creado');
      }
      setDialogOpen(false);
      setCollectionMissing(false);
    } catch (error) {
      console.error('Error al guardar ingrediente:', error);
      if (error?.status === 404 || error?.message?.includes('Missing collection')) {
        toast.error(
          'La colección "ingredients" no existe en PocketBase. Créala primero desde el panel de PocketBase.'
        );
      } else {
        toast.error('Error al guardar el ingrediente');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await pb.collection('ingredients').delete(deleteTarget);
      setIngredients((prev) => prev.filter((i) => i.id !== deleteTarget));
      toast.success('Ingrediente eliminado');
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error);
      toast.error('Error al eliminar el ingrediente');
    } finally {
      setDeleteTarget(null);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const getCategoryLabel = (value) =>
    INGREDIENT_CATEGORIES.find((c) => c.value === value)?.label || value;

  const getUnitLabel = (value) =>
    INGREDIENT_UNITS.find((u) => u.value === value)?.label || value;

  const lowStockCount = ingredients.filter(
    (i) => i.currentStock < i.minStock
  ).length;

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (row) => (
        <Badge variant="secondary">{getCategoryLabel(row.category)}</Badge>
      ),
    },
    {
      key: 'unit',
      label: 'Unidad',
      render: (row) => getUnitLabel(row.unit),
    },
    {
      key: 'costPerUnit',
      label: 'Costo/unidad',
      render: (row) => formatCurrency(row.costPerUnit),
    },
    {
      key: 'currentStock',
      label: 'Stock',
      render: (row) => (
        <span
          className={
            row.currentStock < row.minStock
              ? 'font-bold text-amber-700'
              : ''
          }
        >
          {row.currentStock ?? 0}
        </span>
      ),
    },
    {
      key: 'minStock',
      label: 'Stock mín.',
      render: (row) => row.minStock ?? 0,
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (row) => row.supplier || '—',
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
              openEditDialog(row);
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

  // Custom row class to highlight low-stock rows
  const getRowClassName = (row) =>
    row.currentStock < row.minStock ? 'bg-amber-50' : '';

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total ingredientes"
          value={ingredients.length}
          icon={Package}
        />
        <StatCard
          title="Stock bajo"
          value={lowStockCount}
          icon={AlertTriangle}
          className={lowStockCount > 0 ? 'border-amber-200 bg-amber-50' : ''}
          description={
            lowStockCount > 0
              ? 'Ingredientes por debajo del mínimo'
              : 'Todo en orden'
          }
        />
      </div>

      {/* Collection missing banner */}
      {collectionMissing && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-amber-800 text-sm">
              La colección <strong>ingredients</strong> no existe todavía en
              PocketBase. Créala desde el panel de administración de PocketBase
              con los campos: name, unit, costPerUnit, currentStock, minStock,
              supplier, category.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Inventario de ingredientes</CardTitle>
          <Button onClick={openNewDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Añadir ingrediente
          </Button>
        </CardHeader>
        <DataTable
          columns={columns}
          data={ingredients.map((row) => ({
            ...row,
            _rowClassName: getRowClassName(row),
          }))}
          loading={loading}
          searchField="name"
          searchPlaceholder="Buscar ingrediente..."
          emptyMessage={
            collectionMissing
              ? 'La colección aún no existe en PocketBase'
              : 'No hay ingredientes registrados'
          }
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Editar ingrediente' : 'Nuevo ingrediente'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ing-name">Nombre *</Label>
              <Input
                id="ing-name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ej: Harina de trigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) => updateField('category', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {INGREDIENT_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unidad *</Label>
                <Select
                  value={form.unit}
                  onValueChange={(val) => updateField('unit', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {INGREDIENT_UNITS.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ing-cost">Costo por unidad</Label>
                <Input
                  id="ing-cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.costPerUnit}
                  onChange={(e) => updateField('costPerUnit', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ing-supplier">Proveedor</Label>
                <Input
                  id="ing-supplier"
                  value={form.supplier}
                  onChange={(e) => updateField('supplier', e.target.value)}
                  placeholder="Ej: Proveedor S.L."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ing-stock">Stock actual</Label>
                <Input
                  id="ing-stock"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.currentStock}
                  onChange={(e) => updateField('currentStock', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ing-min">Stock mínimo</Label>
                <Input
                  id="ing-min"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.minStock}
                  onChange={(e) => updateField('minStock', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar ingrediente"
        description="Se eliminará este ingrediente del inventario. Esta acción no se puede deshacer."
        onConfirm={handleDelete}
      />
    </div>
  );
}
