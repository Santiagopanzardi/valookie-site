import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { StatusBadge } from '@/admin/components/StatusBadge.jsx';
import { STATUS_OPTIONS } from '@/admin/lib/constants';
import { formatCurrency, formatDateTime } from '@/admin/lib/formatters';
import { Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await pb.collection('orders').getFullList({
        sort: '-created',
        $autoCancel: false,
      });
      setOrders(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await pb.collection('orders').update(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Pedido actualizado a: ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`);
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const columns = [
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
      key: 'customer',
      label: 'Cliente',
      render: (row) => (
        <div>
          <p className="font-medium">{row.customerName || '—'}</p>
          <p className="text-sm text-muted-foreground">{row.customerEmail || '—'}</p>
        </div>
      ),
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
      label: 'Cambiar estado',
      render: (row) => (
        <Select
          value={row.status}
          onValueChange={(val) => updateOrderStatus(row.id, val)}
          disabled={updatingStatus === row.id}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'detail',
      label: '',
      render: (row) => (
        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${row.id}`); }}>
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <p className="text-sm text-yellow-700">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-700">Preparando</p>
            <p className="text-2xl font-bold text-blue-800">{stats.processing}</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <p className="text-sm text-purple-700">Enviados</p>
            <p className="text-2xl font-bold text-purple-800">{stats.shipped}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-700">Entregados</p>
            <p className="text-2xl font-bold text-green-800">{stats.delivered}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle>Pedidos</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <DataTable
          columns={columns}
          data={filteredOrders}
          loading={loading}
          searchField={(row) => `${row.customerName} ${row.customerEmail} ${row.id}`}
          searchPlaceholder="Buscar por cliente o ID..."
          emptyMessage="No hay pedidos"
        />
      </Card>
    </div>
  );
}
