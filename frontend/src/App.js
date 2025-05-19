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
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import { CartProvider } from './components/CartContext';
import CartPage from './pages/CartPage';
import UserOrdersPage from './pages/UserOrdersPage';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);


  // useEffect(() => {
  //   const storedToken = localStorage.getItem('auth_token');
  //   if (!storedToken) return;

  //   fetch('http://localhost:8000/api/me', {
  //     headers: {
  //       Authorization: `Bearer ${storedToken}`,
  //     },
  //   })
  //     .then(res => res.ok ? res.json() : null)
  //     .then(data => {
  //       if (data) {
  //         setToken(storedToken);
  //         setUser(data);
  //       } else {
  //         localStorage.removeItem('auth_token');
  //         localStorage.removeItem('user');
  //         setToken(null);
  //         setUser(null);
  //       }
  //     })
  //     .catch(() => {
  //       localStorage.removeItem('auth_token');
  //       setUser(null);
  //       setToken(null);
  //     });
  // }, []);




  return (
    <div style={{ backgroundColor: '#e6fff7', minHeight: '100vh' }}>
      <Router>
        <UserProvider>
          <CartProvider>
            <div className="App">
              <NavBar />
              {/* Afficher le token pour debug */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/grocery" element={<GroceryHomePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/grocery/product/:id" element={<ProductPageGrocery />} />
                <Route path="/login" element={<LoginPage setToken={setToken} setUser={setUser} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<CancelPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/my-orders" element={<UserOrdersPage />} />
              </Routes>
            </div>
          </CartProvider>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
