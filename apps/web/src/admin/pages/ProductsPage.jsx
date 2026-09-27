import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false,
      });
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const toggleField = async (productId, field, currentValue) => {
    try {
      await pb.collection('products').update(productId, { [field]: !currentValue });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, [field]: !currentValue } : p))
      );
      toast.success('Producto actualizado');
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  const deleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      await pb.collection('products').delete(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success('Producto eliminado');
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar el producto');
    } finally {
      setDeleteTarget(null);
    }
  };

  const columns = [
    {
      key: 'image',
      label: 'Imagen',
      render: (row) =>
        row.image ? (
          <img
            src={pb.files.getUrl(row, row.image)}
            alt={row.name}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
            Sin img
          </div>
        ),
      className: 'w-16',
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'price',
      label: 'Precio',
      render: (row) => <span className="font-bold">{formatCurrency(row.price)}</span>,
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (row) => (
        <span className={row.stock <= 0 ? 'text-destructive font-medium' : ''}>
          {row.stock ?? 0}
        </span>
      ),
    },
    {
      key: 'categories',
      label: 'Categorias',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {(row.categories || []).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'inStock',
      label: 'En stock',
      render: (row) => (
        <Switch
          checked={!!row.inStock}
          onCheckedChange={() => toggleField(row.id, 'inStock', row.inStock)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: 'isFeatured',
      label: 'Destacado',
      render: (row) => (
        <Switch
          checked={!!row.isFeatured}
          onCheckedChange={() => toggleField(row.id, 'isFeatured', row.isFeatured)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/products/${row.id}/edit`);
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
              setDeleteTarget(row);
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Productos</CardTitle>
          <Button onClick={() => navigate('/admin/products/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Anadir producto
          </Button>
        </CardHeader>
        <DataTable
          columns={columns}
          data={products}
          loading={loading}
          searchField="name"
          searchPlaceholder="Buscar producto..."
          emptyMessage="No hay productos"
        />
      </Card>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Seguro que quieres eliminar "${deleteTarget?.name}"? Esta accion no se puede deshacer.`}
        onConfirm={deleteProduct}
      />
    </div>
  );
}
