import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Account from '../pages/Account/Account';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/ProductDetail/ProductDetail';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/account" element={<Account />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/:productId" element={<ProductDetail />} />
    <Route path="/404" element={<Notfound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes>
);

export default AppRoutes;