import { useUser } from '../components/UserContext';   
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { UserContext } from '../components/UserContext';


function CategoryPage() {
  const { fetchWithAuth } = useUser();
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);


  useEffect(() => {
    async function fetchData() {
      const productsResponse = await fetchWithAuth(`http://localhost:8000/api/products?category=${slug}`);
      const productsData = await productsResponse.json();
      setProducts(productsData);

      const categoriesResponse = await fetchWithAuth('http://localhost:8000/api/categories');
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


      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          borderRadius: '20px',
          backgroundColor: '#f4e1c1',
          color: '#5c4033',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>⬅<i className="fas fa-arrow-right"></i>
        </span>
      </button>


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
              overflow: 'hidden',
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
              src={product.image.startsWith('/uploads/') ? product.image : `/uploads/images/${product.image}`}
              alt={product.name}

              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '20px',
                marginBottom: '20px',
                display: 'block',
              }}
            />

            {/* 👉 Titre */}
            <h3
              style={{
                fontSize: '1.5rem',
                marginBottom: '10px',
                background: isGroceryPage
                  ? 'linear-gradient(to right, #5c4033, #8b4513)'
                  : 'linear-gradient(to right, #333, #ff6699)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              {product.name}
            </h3>

            {/* 👉 Description */}
            <p style={{ fontSize: '0.95rem', marginBottom: '15px', color: '#666' }}>
              {product.description}
            </p>

            {/* 👉 Prix */}
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '1.3rem',
                color: isGroceryPage ? '#8b4513' : '#ff3366',
              }}
            >
              {product.price} €
            </p>
            <button
              onClick={() => {
                if (!user) {
                  alert("Veuillez vous connecter pour ajouter un produit au panier.");
                  return;
                }
                addToCart(product);
                alert("✅ Produit ajouté au panier !");
              }}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isGroceryPage ? '#8b4513' : '#00cc99',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🛒 Ajouter au panier
            </button>

          </div>

        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
