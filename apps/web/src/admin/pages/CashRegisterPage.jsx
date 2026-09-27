import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { StatCard } from '@/admin/components/StatCard.jsx';
import { formatCurrency } from '@/admin/lib/formatters';
import { PAYMENT_METHODS } from '@/admin/lib/constants';
import { Calculator, Plus, Trash2, DollarSign, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

export function CashRegisterPage() {
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [openingCash, setOpeningCash] = useState('');
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [closingCash, setClosingCash] = useState('');
  const [closingNotes, setClosingNotes] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const prods = await pb.collection('products').getFullList({ sort: 'name', $autoCancel: false });
      setProducts(prods);

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sessions = await pb.collection('daily_sales').getFullList({
          filter: `date >= "${today.toISOString()}" && status = "open"`,
          sort: '-created',
          $autoCancel: false,
        });
        if (sessions.length > 0) {
          const s = sessions[0];
          setSession(s);
          setItems(s.items || []);
        }
      } catch {
        // Collection may not exist yet
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openRegister = async () => {
    try {
      const now = new Date();
      const record = await pb.collection('daily_sales').create({
        date: now.toISOString(),
        openingCash: parseFloat(openingCash) || 0,
        status: 'open',
        items: [],
        totalSales: 0,
        cardPayments: 0,
        cashPayments: 0,
      });
      setSession(record);
      setItems([]);
      setShowOpenDialog(false);
      setOpeningCash('');
      toast.success('Caja abierta');
    } catch (error) {
      toast.error('Error al abrir caja. ¿Existe la colección daily_sales en PocketBase?');
    }
  };

  const addItem = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem = {
      productId: product.id,
      productName: product.name,
      quantity: parseInt(quantity) || 1,
      unitPrice: product.price,
      total: product.price * (parseInt(quantity) || 1),
      paymentMethod,
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    updateSession(newItems);
    setSelectedProduct('');
    setQuantity(1);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    updateSession(newItems);
  };

  const updateSession = async (updatedItems) => {
    if (!session) return;
    const totalSales = updatedItems.reduce((sum, item) => sum + item.total, 0);
    const cashPayments = updatedItems.filter(i => i.paymentMethod === 'efectivo').reduce((sum, i) => sum + i.total, 0);
    const cardPayments = updatedItems.filter(i => i.paymentMethod === 'tarjeta').reduce((sum, i) => sum + i.total, 0);

    try {
      await pb.collection('daily_sales').update(session.id, {
        items: updatedItems,
        totalSales,
        cashPayments,
        cardPayments,
      });
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const closeRegister = async () => {
    if (!session) return;
    try {
      await pb.collection('daily_sales').update(session.id, {
        closingCash: parseFloat(closingCash) || 0,
        status: 'closed',
        closedAt: new Date().toISOString(),
        notes: closingNotes,
      });
      toast.success('Caja cerrada correctamente');
      setSession(null);
      setItems([]);
      setShowCloseDialog(false);
      setClosingCash('');
      setClosingNotes('');
    } catch (error) {
      toast.error('Error al cerrar la caja');
    }
  };

  const totalSales = items.reduce((sum, item) => sum + item.total, 0);
  const cashTotal = items.filter(i => i.paymentMethod === 'efectivo').reduce((sum, i) => sum + i.total, 0);
  const cardTotal = items.filter(i => i.paymentMethod === 'tarjeta').reduce((sum, i) => sum + i.total, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-20">
          <Calculator className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Caja cerrada</h2>
          <p className="text-muted-foreground mb-6">Abrí la caja para empezar a registrar ventas del día.</p>
          <Button onClick={() => setShowOpenDialog(true)}>Abrir caja</Button>
        </div>

        <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Abrir caja</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Efectivo inicial (EUR)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowOpenDialog(false)}>Cancelar</Button>
              <Button onClick={openRegister}>Abrir caja</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Ventas totales" value={formatCurrency(totalSales)} icon={DollarSign} />
        <StatCard title="Efectivo" value={formatCurrency(cashTotal)} icon={Banknote} />
        <StatCard title="Tarjeta" value={formatCurrency(cardTotal)} icon={CreditCard} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registrar venta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label>Producto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.price)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-20">
              <Label>Cantidad</Label>
              <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="w-40">
              <Label>Pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addItem} disabled={!selectedProduct}>
              <Plus className="h-4 w-4 mr-2" /> Añadir
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Ventas del día</CardTitle>
          <Button variant="destructive" size="sm" onClick={() => setShowCloseDialog(true)}>
            Cerrar caja
          </Button>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No hay ventas registradas</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(item.total)}</TableCell>
                    <TableCell>{PAYMENT_METHODS.find(m => m.value === item.paymentMethod)?.label || item.paymentMethod}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar caja</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Efectivo inicial:</div>
              <div className="font-bold">{formatCurrency(session.openingCash)}</div>
              <div>Ventas totales:</div>
              <div className="font-bold">{formatCurrency(totalSales)}</div>
              <div>Ventas en efectivo:</div>
              <div className="font-bold">{formatCurrency(cashTotal)}</div>
              <div>Ventas con tarjeta:</div>
              <div className="font-bold">{formatCurrency(cardTotal)}</div>
            </div>
            <Separator />
            <div>
              <Label>Efectivo en caja al cerrar (EUR)</Label>
              <Input
                type="number"
                step="0.01"
                value={closingCash}
                onChange={(e) => setClosingCash(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Notas</Label>
              <Textarea
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                placeholder="Notas opcionales..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={closeRegister}>Cerrar caja</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
