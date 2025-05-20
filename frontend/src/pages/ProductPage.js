
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { UserContext } from '../components/UserContext';


function ProductPage() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);



  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!product) {
    return <div>Produit non trouvé 😢</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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


      <img
        src={product.image.startsWith('/uploads/') ? product.image : `/uploads/images/${product.image}`}
        alt={product.name}
        style={{ width: '300px', height: '300px', objectFit: 'cover', borderRadius: '20px', marginBottom: '20px' }}
      />

      <h1 style={{
        fontSize: '2.5rem',
        background: 'linear-gradient(to right, #333, #ff6699)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
        marginBottom: '20px'
      }}>
        {product.name}
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>
        {product.description}
      </p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff3366' }}>
        {product.price} €
      </p>
      <button
        onClick={() => {
          if (!user) {
            alert("Vous devez être connecté pour ajouter un produit au panier.");
            return;
          }
          addToCart(product);
          alert("✅ Produit ajouté au panier !");
        }}
        style={{
          marginTop: '10px',
          padding: '12px 24px',
          borderRadius: '10px',
          backgroundColor: '#00cc99',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        🛒 Ajouter au panier
      </button>

    </div>
  );
}

export default ProductPage;
