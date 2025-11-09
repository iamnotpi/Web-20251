import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '../store';
import { selectHasRole, selectIsAuthenticated } from '../store/authSlice';

const AdminRoutes = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const hasAdminRole = useAppSelector(selectHasRole('admin'));

  if (!isAuthenticated || !hasAdminRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;

