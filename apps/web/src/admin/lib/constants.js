export const ADMIN_EMAILS = ['admin@valookie.com', 'santiagopanzardi@gmail.com'];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Preparando', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Entregado', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
];

export const EXPENSE_CATEGORIES = [
  { value: 'ingredientes', label: 'Ingredientes' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'suministros', label: 'Suministros' },
  { value: 'equipamiento', label: 'Equipamiento' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'personal', label: 'Personal' },
  { value: 'impuestos', label: 'Impuestos' },
  { value: 'envio', label: 'Envío' },
  { value: 'otros', label: 'Otros' },
];

export const INGREDIENT_CATEGORIES = [
  { value: 'harinas', label: 'Harinas' },
  { value: 'grasas', label: 'Grasas' },
  { value: 'azucares', label: 'Azúcares' },
  { value: 'chocolates', label: 'Chocolates' },
  { value: 'lacteos', label: 'Lácteos' },
  { value: 'frutos_secos', label: 'Frutos secos' },
  { value: 'otros', label: 'Otros' },
];

export const INGREDIENT_UNITS = [
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'unidad', label: 'Unidad' },
];

export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
];
