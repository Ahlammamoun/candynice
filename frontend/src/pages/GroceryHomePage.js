import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function GroceryHomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/categories').then(res => res.json()),
      fetch('http://localhost:8000/api/products').then(res => res.json())
    ]).then(([categoriesData, productsData]) => {
      setCategories(categoriesData);
      setProducts(productsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Trouver la catégorie principale Grocery
  const groceryCategory = categories.find(cat => cat.name.toLowerCase() === 'grocery');

  // Trouver ses sous-catégories
  const grocerySubCategories = groceryCategory ? groceryCategory.children : [];

  // Trouver les produits liés aux sous-catégories de Grocery
  const groceryProducts = products.filter(product => {
    return grocerySubCategories.some(subcat => subcat.slug === product.category);
  });

  return (
    // Dans GroceryHomePage.js

    <div style={{ padding: '20px', backgroundColor: '#fdf6e3', minHeight: '100vh' }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '2.8rem',
        marginBottom: '30px',
        color: '#5c4033',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        Bienvenue dans notre Épicerie Fine 🍽️
      </h1>

      {/* Sous-catégories */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
        {grocerySubCategories.map(subcat => (
          <Link key={subcat.id} to={`/category/${subcat.slug}`}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              backgroundColor: '#d2b48c',
              textDecoration: 'none',
              color: '#5c4033',
              fontWeight: 'bold'
            }}>
            {subcat.name}
          </Link>
        ))}
      </div>

      {/* Produits */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '25px'
      }}>
        {groceryProducts.map(product => (
          <Link to={`/grocery/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <div key={product.id} style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>

              {/* Image */}
              <img src={`/images/${product.image}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  marginBottom: '15px'
                }}
              />

              {/* Nom */}
              <h3 style={{
                fontSize: '1.5rem',
                color: '#5c4033',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {product.name}
              </h3>

              {/* Description */}
              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '10px' }}>
                {product.description}
              </p>

              {/* Prix */}
              <p style={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#6b8e23',
                marginBottom: '10px'
              }}>
                {product.price} €
              </p>

              {/* Région */}
              {product.region && (
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  Origine : {product.region}
                </p>
              )}
            </div>
          </Link>
        ))}


      </div>
      {/* Footer */}
      <footer style={{ marginTop: '50px', padding: '20px', textAlign: 'center', backgroundColor: 'rgb(210, 180, 140)' }}>
        <p>&copy; 2025 CandyNice - Tous droits réservés.</p>
      </footer>
    </div>

  );
}

export default GroceryHomePage;

