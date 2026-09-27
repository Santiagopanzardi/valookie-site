import { useState, useEffect } from 'react';
import { StatCard } from '@/admin/components/StatCard.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { ShoppingCart, Package, Users, Euro } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export function DashboardPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0, pendingOrders: 0, todayRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [orders, products, users] = await Promise.all([
        pb.collection('orders').getFullList({ $autoCancel: false }),
        pb.collection('products').getFullList({ $autoCancel: false }),
        pb.collection('users').getFullList({ $autoCancel: false }),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(o => new Date(o.created) >= today);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);
      const todayRevenue = todayOrders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        orders: orders.length,
        revenue: totalRevenue,
        products: products.length,
        customers: users.length,
        pendingOrders,
        todayRevenue,
        todayOrders: todayOrders.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Bienvenido al panel</h2>
        <p className="text-muted-foreground">Resumen general de Valookie</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Ventas hoy"
          value={formatCurrency(stats.todayRevenue)}
          icon={Euro}
          description={`${stats.todayOrders || 0} pedidos hoy`}
        />
        <StatCard
          title="Pedidos pendientes"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          description={`${stats.orders} pedidos totales`}
        />
        <StatCard
          title="Productos"
          value={stats.products}
          icon={Package}
        />
        <StatCard
          title="Clientes"
          value={stats.customers}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Ingresos totales</h3>
          <p className="text-3xl font-bold">{formatCurrency(stats.revenue)}</p>
          <p className="text-sm text-muted-foreground mt-1">Desde el inicio</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold mb-4">Acciones rápidas</h3>
          <div className="grid grid-cols-2 gap-2">
            <a href="/admin/orders" className="rounded-lg border p-3 hover:bg-muted transition-colors text-sm">
              Ver pedidos pendientes
            </a>
            <a href="/admin/products/new" className="rounded-lg border p-3 hover:bg-muted transition-colors text-sm">
              Añadir producto
            </a>
            <a href="/admin/cash-register" className="rounded-lg border p-3 hover:bg-muted transition-colors text-sm">
              Abrir caja
            </a>
            <a href="/admin/expenses" className="rounded-lg border p-3 hover:bg-muted transition-colors text-sm">
              Registrar gasto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
