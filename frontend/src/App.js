import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import GroceryHomePage from './pages/GroceryHomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage  from './pages/ProductPage';
import ProductPageGrocery from './pages/ProductPageGrocery';

function App() {
  return (
    <div style={{ backgroundColor: '#e6fff7', minHeight: '100vh' }}>
      {/* Tout ton site à l'intérieur */}


      <Router>
        <div className="App">
          <NavBar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/grocery" element={<GroceryHomePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/grocery/product/:id" element={<ProductPageGrocery />} />
          </Routes>
        </div>
      </Router>

    </div>
  );
}

export default App;

