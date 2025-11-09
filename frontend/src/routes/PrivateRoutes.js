import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../store';
import { selectIsAuthenticated } from '../store/authSlice';

const PrivateRoutes = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoutes;

