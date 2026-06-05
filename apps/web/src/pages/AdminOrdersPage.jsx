import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Package, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';

const ADMIN_EMAILS = ['admin@valookie.com', 'santiagopanzardi@gmail.com'];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Preparando', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Entregado', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
];

const AdminOrdersPage = () => {
  const { currentUser, isAuthenticated, initialLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    if (initialLoading) return;
    if (!isAuthenticated || !ADMIN_EMAILS.includes(currentUser?.email)) {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, currentUser, initialLoading]);

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
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      toast.success(`Pedido actualizado a: ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`);
    } catch (error) {
      console.error('Error al actualizar:', error);
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
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

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!isAuthenticated || !ADMIN_EMAILS.includes(currentUser?.email)) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Panel de Pedidos - Valookie Admin</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Valookie - Panel de Pedidos</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Volver a la tienda
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <p className="text-sm text-yellow-700">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-700">Preparando</p>
              <p className="text-2xl font-bold text-blue-800">{stats.processing}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-purple-700">Enviados</p>
              <p className="text-2xl font-bold text-purple-800">{stats.shipped}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-green-700">Entregados</p>
              <p className="text-2xl font-bold text-green-800">{stats.delivered}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pedidos</h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
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
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Cargando pedidos...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No hay pedidos</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Cambiar estado</TableHead>
                      <TableHead>Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">#{order.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          {new Date(order.created).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName || '-'}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">€{order.total?.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(val) => updateOrderStatus(order.id, val)}
                            disabled={updatingStatus === order.id}
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
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Estado:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Cliente</h4>
                <p>{selectedOrder.customerName || '-'}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customerEmail || '-'}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customerPhone || '-'}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Dirección de envío</h4>
                <p className="text-sm">
                  {typeof selectedOrder.shippingAddress === 'object'
                    ? selectedOrder.shippingAddress.address || JSON.stringify(selectedOrder.shippingAddress)
                    : selectedOrder.shippingAddress || '-'}
                </p>
                {selectedOrder.postalCode && (
                  <p className="text-sm text-gray-500">CP: {selectedOrder.postalCode}</p>
                )}
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Productos</h4>
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Sin detalle de productos</p>
                )}
              </div>

              <Separator />

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>€{selectedOrder.subtotal?.toFixed(2) || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>{selectedOrder.shippingCost > 0 ? `€${selectedOrder.shippingCost.toFixed(2)}` : 'Gratis'}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>€{selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Cambiar estado</h4>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) => updateOrderStatus(selectedOrder.id, val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminOrdersPage;
