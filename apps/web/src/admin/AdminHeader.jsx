import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { Avatar, AvatarFallback } from '@/components/ui/avatar.jsx';
import { LogOut, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Pedidos',
  '/admin/products': 'Productos',
  '/admin/customers': 'Clientes',
  '/admin/inventory': 'Inventario',
  '/admin/cash-register': 'Caja registradora',
  '/admin/expenses': 'Gastos',
  '/admin/reports': 'Informes',
  '/admin/recipes': 'Recetas',
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path)) return title;
  }
  return 'Admin';
}

export function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.email?.[0]?.toUpperCase() || 'A';

  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      <h1 className="text-lg font-semibold flex-1">{getPageTitle(location.pathname)}</h1>
      <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="hidden md:flex gap-2">
        <Store className="h-4 w-4" />
        Tienda
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="text-xs text-muted-foreground">
            {currentUser?.email}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
