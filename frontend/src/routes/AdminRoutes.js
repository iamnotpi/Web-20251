import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AdminRoutes = () => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated || !hasRole('admin')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;

