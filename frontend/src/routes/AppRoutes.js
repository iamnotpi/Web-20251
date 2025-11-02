import { Routes, Route } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Products from '../pages/Products/Products';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import Categories from '../pages/Categories/Categories';
import CategoryDetail from '../pages/CategoryDetail/CategoryDetail';
import Cart from '../pages/Cart/Cart';
import Favourites from '../pages/Favourites/Favourites';
import Orders from '../pages/Orders/Orders';
import OrderDetail from '../pages/OrderDetail/OrderDetail';
import Notifications from '../pages/Notifications/Notifications';
import Support from '../pages/Support/Support';
import PrivateRoutes from './PrivateRoutes';
import AdminRoutes from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:productId" element={<ProductDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:categoryId" element={<CategoryDetail />} />
      <Route path="/support" element={<Support />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      <Route element={<AdminRoutes />}>
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/notifications" element={<Notifications />} />
      </Route>

      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;

