import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Warehouse,
  Calculator,
  Receipt,
  BarChart3,
  CookingPot,
  Cookie,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'General',
    items: [
      { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Ventas',
    items: [
      { title: 'Pedidos', path: '/admin/orders', icon: ShoppingCart },
      { title: 'Caja registradora', path: '/admin/cash-register', icon: Calculator },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { title: 'Productos', path: '/admin/products', icon: Package },
      { title: 'Recetas', path: '/admin/recipes', icon: CookingPot },
      { title: 'Inventario', path: '/admin/inventory', icon: Warehouse },
    ],
  },
  {
    label: 'Negocio',
    items: [
      { title: 'Clientes', path: '/admin/customers', icon: Users },
      { title: 'Gastos', path: '/admin/expenses', icon: Receipt },
      { title: 'Informes', path: '/admin/reports', icon: BarChart3 },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <Cookie className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Valookie</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Panel de gestión</p>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Volver a la tienda
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
