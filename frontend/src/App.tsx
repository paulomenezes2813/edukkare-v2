import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import { AppProvider } from './contexts/AppContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MenuProvider>
          <AppProvider>
            <AppRoutes />
          </AppProvider>
        </MenuProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
