import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import GroceryHomePage from './pages/GroceryHomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import ProductPageGrocery from './pages/ProductPageGrocery';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    // Vérification avant de parser les données
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);  // Parser l'utilisateur si les données existent
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
      }
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#e6fff7', minHeight: '100vh' }}>
      <Router>
        <UserProvider value={{ user, setUser, token, setToken }}>
          <div className="App">
            <NavBar />
            {/* Afficher le token pour debug */}
            {token && (
              <div style={{
                backgroundColor: '#c6f7e2',
                padding: '10px',
                margin: '10px',
                borderRadius: '10px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                ✅ Connecté ! Token : {token}
              </div>
            )}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/grocery" element={<GroceryHomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/grocery/product/:id" element={<ProductPageGrocery />} />
              <Route path="/login" element={<LoginPage setToken={setToken} setUser={setUser} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
