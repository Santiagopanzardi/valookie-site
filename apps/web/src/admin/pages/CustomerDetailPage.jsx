import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { StatusBadge } from '@/admin/components/StatusBadge.jsx';
import { formatCurrency, formatDateTime } from '@/admin/lib/formatters';
import { ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, [id]);

  const loadCustomer = async () => {
    try {
      const user = await pb.collection('users').getOne(id, { $autoCancel: false });
      setCustomer(user);

      const customerOrders = await pb.collection('orders').getFullList({
        filter: `customerEmail = "${user.email}"`,
        sort: '-created',
        $autoCancel: false,
      });
      setOrders(customerOrders);
    } catch (error) {
      console.error('Error al cargar cliente:', error);
      toast.error('Error al cargar el cliente');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!customer) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const orderColumns = [
    {
      key: 'id',
      label: 'Pedido',
      render: (row) => <span className="font-mono text-sm">#{row.id.slice(0, 8)}</span>,
    },
    {
      key: 'created',
      label: 'Fecha',
      render: (row) => formatDateTime(row.created),
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => <span className="font-bold">{formatCurrency(row.total)}</span>,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/admin/orders/${row.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/customers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-xl font-bold">{customer.name || 'Cliente'}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información del cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">{customer.name || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{customer.phone || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ciudad</p>
              <p className="font-medium">{customer.city || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium">{customer.address || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Código postal</p>
              <p className="font-medium">{customer.postalCode || '—'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Historial de pedidos</CardTitle>
          <div className="text-sm text-muted-foreground">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} — Total: {formatCurrency(totalSpent)}
          </div>
        </CardHeader>
        <DataTable
          columns={orderColumns}
          data={orders}
          loading={false}
          emptyMessage="Este cliente no tiene pedidos"
          onRowClick={(row) => navigate(`/admin/orders/${row.id}`)}
        />
      </Card>
    </div>
  );
}
