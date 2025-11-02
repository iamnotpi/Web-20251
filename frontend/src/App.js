import { BrowserRouter } from 'react-router-dom';

import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <AuthProvider>
          <CartProvider>
            <div className="App">
              <AppRoutes />
            </div>
          </CartProvider>
        </AuthProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
