import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
import AppRoutes from './routes/AppRoutes';
import { store } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
