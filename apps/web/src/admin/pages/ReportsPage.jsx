import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { StatCard } from '@/admin/components/StatCard.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function ReportsPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ordersData, productsData] = await Promise.all([
        pb.collection('orders').getFullList({ sort: '-created', $autoCancel: false }),
        pb.collection('products').getFullList({ $autoCancel: false }),
      ]);
      setOrders(ordersData);
      setProducts(productsData);

      try {
        const expensesData = await pb.collection('expenses').getFullList({ sort: '-date', $autoCancel: false });
        setExpenses(expensesData);
      } catch {
        // Collection may not exist yet
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return orders.filter(o => new Date(o.created) >= cutoff && o.status !== 'cancelled');
  }, [orders, period]);

  const salesByDay = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const day = new Date(o.created).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      map[day] = (map[day] || 0) + (o.total || 0);
    });
    return Object.entries(map)
      .map(([day, total]) => ({ day, total }))
      .reverse();
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      if (Array.isArray(o.items)) {
        o.items.forEach(item => {
          const name = item.name || 'Desconocido';
          if (!map[name]) map[name] = { name, quantity: 0, revenue: 0 };
          map[name].quantity += item.quantity || 0;
          map[name].revenue += (item.price || 0) * (item.quantity || 0);
        });
      }
    });
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  const customerStats = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const email = o.customerEmail || 'unknown';
      if (!map[email]) map[email] = { email, name: o.customerName || email, orders: 0, total: 0 };
      map[email].orders += 1;
      map[email].total += o.total || 0;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = filteredOrders.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const filteredExpenses = useMemo(() => {
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return expenses.filter(e => new Date(e.date) >= cutoff);
  }, [expenses, period]);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const chartConfig = {
    total: { label: 'Ventas', color: 'hsl(var(--primary))' },
    revenue: { label: 'Ingresos', color: 'hsl(var(--primary))' },
    quantity: { label: 'Cantidad', color: 'hsl(var(--chart-2))' },
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
            <SelectItem value="90">Últimos 90 días</SelectItem>
            <SelectItem value="365">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ingresos" value={formatCurrency(totalRevenue)} icon={TrendingUp} />
        <StatCard title="Pedidos" value={totalOrders} icon={ShoppingCart} />
        <StatCard title="Ticket medio" value={formatCurrency(avgOrder)} icon={Package} />
        <StatCard title="Margen" value={formatCurrency(totalRevenue - totalExpenses)} icon={TrendingUp} description={`Gastos: ${formatCurrency(totalExpenses)}`} />
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos top</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por día</CardTitle>
            </CardHeader>
            <CardContent>
              {salesByDay.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay ventas en este periodo</p>
              ) : (
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <BarChart data={salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Productos más vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay datos</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.quantity} unidades</p>
                        </div>
                      </div>
                      <span className="font-bold">{formatCurrency(p.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Mejores clientes</CardTitle>
            </CardHeader>
            <CardContent>
              {customerStats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No hay datos</p>
              ) : (
                <div className="space-y-3">
                  {customerStats.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-sm text-muted-foreground">{c.orders} pedidos</p>
                        </div>
                      </div>
                      <span className="font-bold">{formatCurrency(c.total)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
