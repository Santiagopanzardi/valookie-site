import { useAuth } from '@/contexts/AuthContext.jsx';
import { ADMIN_EMAILS } from '@/admin/lib/constants';

export function useAdminAuth() {
  const { currentUser, isAuthenticated, initialLoading } = useAuth();

  const isAdmin = isAuthenticated && ADMIN_EMAILS.includes(currentUser?.email);

  return { isAdmin, isAuthenticated, initialLoading, currentUser };
}
