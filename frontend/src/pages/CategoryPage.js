import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const productsResponse = await fetch(`http://localhost:8000/api/products?category=${slug}`);
      const productsData = await productsResponse.json();
      setProducts(productsData);

      const categoriesResponse = await fetch('http://localhost:8000/api/categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      setLoading(false);
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // 🔥 Détection Grocery
  let isGroceryPage = false;
  for (const category of categories) {
    for (const child of category.children) {
      if (child.slug === slug && category.slug === 'grocery') {
        isGroceryPage = true;
      }
    }
  }

  return (
    <div style={{
      backgroundColor: isGroceryPage ? '#fdf6e3' : '#ffe6f0',   // 👈 Fond qui change
      minHeight: '100vh',
      paddingBottom: '50px'
    }}>
      <h1 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        marginTop: '30px',
        background: isGroceryPage
          ? 'linear-gradient(to right, #5c4033, #8b4513)'
          : 'linear-gradient(to right, #333, #ff6699)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        {slug.charAt(0).toUpperCase() + slug.slice(1)}
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
        marginTop: '40px',
        padding: '0 30px'
      }}>
        {products.map((product, index) => (
          <div
            key={product.id}
            style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              transform: index % 2 === 0 ? 'translateY(10px)' : 'translateY(-10px)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = index % 2 === 0 ? 'translateY(10px)' : 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.1)';
            }}
          >
            {/* 👉 Image produit */}
            <img
              src={`/images/${product.image}`}
              alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '15px',
                marginBottom: '15px',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />

            {/* 👉 Titre */}
            <h3 style={{
              fontSize: '1.5rem',
              marginBottom: '10px',
              background: isGroceryPage
                ? 'linear-gradient(to right, #5c4033, #8b4513)'
                : 'linear-gradient(to right, #333, #ff6699)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent'
            }}>
              {product.name}
            </h3>

            {/* 👉 Description */}
            <p style={{ fontSize: '0.95rem', marginBottom: '15px', color: '#666' }}>
              {product.description}
            </p>

            {/* 👉 Prix */}
            <p style={{
              fontWeight: 'bold',
              fontSize: '1.3rem',
              color: isGroceryPage ? '#8b4513' : '#ff3366'
            }}>
              {product.price} €
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
