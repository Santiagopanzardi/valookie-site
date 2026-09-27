import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';
import { StatusBadge } from '@/admin/components/StatusBadge.jsx';
import { STATUS_OPTIONS } from '@/admin/lib/constants';
import { formatCurrency, formatDateTime } from '@/admin/lib/formatters';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const data = await pb.collection('orders').getOne(id, { $autoCancel: false });
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
      toast.error('Error al cargar el pedido');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await pb.collection('orders').update(id, { status: newStatus });
      setOrder(prev => ({ ...prev, status: newStatus }));
      toast.success(`Estado actualizado a: ${STATUS_OPTIONS.find(s => s.value === newStatus)?.label}`);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!order) return null;

  const address = typeof order.shippingAddress === 'object'
    ? order.shippingAddress
    : { address: order.shippingAddress };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h2 className="text-xl font-bold">Pedido #{order.id.slice(0, 8)}</h2>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium">{order.customerName || '—'}</p>
            <p className="text-sm text-muted-foreground">{order.customerEmail || '—'}</p>
            <p className="text-sm text-muted-foreground">{order.customerPhone || '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dirección de envío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{address?.address || address?.street || '—'}</p>
            {address?.city && <p className="text-sm text-muted-foreground">{address.city}</p>}
            {order.postalCode && <p className="text-sm text-muted-foreground">CP: {order.postalCode}</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(order.items) && order.items.length > 0 ? (
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>{order.shippingCost > 0 ? formatCurrency(order.shippingCost) : 'Gratis'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Sin detalle de productos</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cambiar estado</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Select value={order.status} onValueChange={updateStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Creado: {formatDateTime(order.created)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
