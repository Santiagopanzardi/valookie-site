import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { StatCard } from '@/admin/components/StatCard.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { Users, Eye } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function CustomersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, ordersData] = await Promise.all([
        pb.collection('users').getFullList({ $autoCancel: false }),
        pb.collection('orders').getFullList({ $autoCancel: false }),
      ]);
      setUsers(usersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const usersWithStats = useMemo(() => {
    const ordersByEmail = {};
    for (const order of orders) {
      const email = (order.customerEmail || '').toLowerCase();
      if (!email) continue;
      if (!ordersByEmail[email]) {
        ordersByEmail[email] = { count: 0, total: 0 };
      }
      ordersByEmail[email].count += 1;
      ordersByEmail[email].total += order.total || 0;
    }

    return users.map(user => {
      const stats = ordersByEmail[(user.email || '').toLowerCase()] || { count: 0, total: 0 };
      return {
        ...user,
        orderCount: stats.count,
        totalSpent: stats.total,
      };
    });
  }, [users, orders]);

  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (row) => <span className="font-medium">{row.name || '—'}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (row) => <span className="text-sm text-muted-foreground">{row.email || '—'}</span>,
    },
    {
      key: 'phone',
      label: 'Teléfono',
      render: (row) => <span className="text-sm">{row.phone || '—'}</span>,
    },
    {
      key: 'city',
      label: 'Ciudad',
      render: (row) => <span className="text-sm">{row.city || '—'}</span>,
    },
    {
      key: 'orderCount',
      label: 'Pedidos',
      render: (row) => (
        <span className="font-medium">{row.orderCount}</span>
      ),
    },
    {
      key: 'totalSpent',
      label: 'Total gastado',
      render: (row) => (
        <span className="font-bold">{formatCurrency(row.totalSpent)}</span>
      ),
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
            navigate(`/admin/customers/${row.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total clientes"
          value={loading ? '...' : users.length}
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <DataTable
          columns={columns}
          data={usersWithStats}
          loading={loading}
          searchField={(row) => `${row.name} ${row.email} ${row.city}`}
          searchPlaceholder="Buscar por nombre, email o ciudad..."
          emptyMessage="No hay clientes registrados"
          onRowClick={(row) => navigate(`/admin/customers/${row.id}`)}
        />
      </Card>
    </div>
  );
}
