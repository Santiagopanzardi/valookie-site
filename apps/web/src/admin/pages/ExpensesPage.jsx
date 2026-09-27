import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { DataTable } from '@/admin/components/DataTable.jsx';
import { StatCard } from '@/admin/components/StatCard.jsx';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog.jsx';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/admin/lib/constants';
import { formatCurrency, formatDate } from '@/admin/lib/formatters';
import { Receipt, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  category: '',
  description: '',
  amount: '',
  supplier: '',
  paymentMethod: 'efectivo',
  isRecurring: false,
};

export function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await pb.collection('expenses').getFullList({ sort: '-date', $autoCancel: false });
      setExpenses(data);
    } catch {
      // Collection may not exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.description || !form.amount || !form.category) {
      toast.error('Completá los campos obligatorios');
      return;
    }

    try {
      const data = {
        ...form,
        amount: parseFloat(form.amount),
      };

      if (editingId) {
        await pb.collection('expenses').update(editingId, data);
        toast.success('Gasto actualizado');
      } else {
        await pb.collection('expenses').create(data);
        toast.success('Gasto registrado');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      loadExpenses();
    } catch (error) {
      toast.error('Error al guardar. ¿Existe la colección expenses en PocketBase?');
    }
  };

  const openEdit = (expense) => {
    setForm({
      date: expense.date?.split('T')[0] || expense.date?.split(' ')[0] || '',
      category: expense.category,
      description: expense.description,
      amount: String(expense.amount),
      supplier: expense.supplier || '',
      paymentMethod: expense.paymentMethod || 'efectivo',
      isRecurring: expense.isRecurring || false,
    });
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await pb.collection('expenses').delete(deleteId);
      toast.success('Gasto eliminado');
      setDeleteId(null);
      loadExpenses();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyTotal = thisMonth.reduce((sum, e) => sum + (e.amount || 0), 0);

  const columns = [
    {
      key: 'date',
      label: 'Fecha',
      render: (row) => formatDate(row.date),
    },
    {
      key: 'category',
      label: 'Categoría',
      render: (row) => (
        <Badge variant="outline">
          {EXPENSE_CATEGORIES.find(c => c.value === row.category)?.label || row.category}
        </Badge>
      ),
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (row) => <span className="max-w-[200px] truncate block">{row.description}</span>,
    },
    {
      key: 'amount',
      label: 'Importe',
      render: (row) => <span className="font-bold">{formatCurrency(row.amount)}</span>,
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (row) => row.supplier || '—',
    },
    {
      key: 'paymentMethod',
      label: 'Pago',
      render: (row) => PAYMENT_METHODS.find(m => m.value === row.paymentMethod)?.label || row.paymentMethod || '—',
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); }}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Registrar gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Gastos este mes" value={formatCurrency(monthlyTotal)} icon={Receipt} description={`${thisMonth.length} gastos`} />
        <StatCard title="Gastos totales" value={formatCurrency(totalExpenses)} icon={Receipt} description={`${expenses.length} gastos registrados`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos</CardTitle>
        </CardHeader>
        <DataTable
          columns={columns}
          data={expenses}
          loading={loading}
          searchField="description"
          searchPlaceholder="Buscar por descripción..."
          emptyMessage="No hay gastos registrados"
        />
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar gasto' : 'Nuevo gasto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Fecha *</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descripción *</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del gasto" />
            </div>
            <div>
              <Label>Importe (EUR) *</Label>
              <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            </div>
            <div>
              <Label>Proveedor</Label>
              <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Opcional" />
            </div>
            <div>
              <Label>Método de pago</Label>
              <Select value={form.paymentMethod} onValueChange={(val) => setForm({ ...form, paymentMethod: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map(m => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSubmit}>{editingId ? 'Guardar' : 'Registrar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Eliminar gasto"
        description="¿Estás seguro de que querés eliminar este gasto?"
        onConfirm={handleDelete}
      />
    </div>
  );
}
