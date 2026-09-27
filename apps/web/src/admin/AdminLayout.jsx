import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar.jsx';
import { Spinner } from '@/components/ui/spinner.jsx';
import { AdminSidebar } from './AdminSidebar.jsx';
import { AdminHeader } from './AdminHeader.jsx';
import { useAdminAuth } from './hooks/useAdminAuth.js';

export function AdminLayout() {
  const { isAdmin, isAuthenticated, initialLoading } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialLoading) return;
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, isAuthenticated, initialLoading, navigate]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
