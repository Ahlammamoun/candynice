

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { UserContext } from '../components/UserContext';

function ProductPageGrocery() {

  const { id } = useParams(); // récupérer l'id du produit depuis l'URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
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
    return <div>Produit non trouvé</div>;
  }

  return (
    <div style={{


      padding: '30px',
      backgroundColor: '#fdf6e3', // Couleur douce Grocery
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Link to="/grocery" style={{ textDecoration: 'none' }}>
        <button
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: '#f4e1c1',
            color: '#5c4033',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>⬅<i className="fas fa-arrow-right"></i>
          </span>
        </button>
      </Link>
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#5c4033'
      }}>
        {product.name}
      </h1>

      <img
        src={product.image.startsWith('/uploads/') ? product.image : `/uploads/images/${product.image}`}
        alt={product.name}
        style={{
          width: '350px',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
          marginBottom: '20px'
        }}
      />

      <p style={{
        fontSize: '1.2rem',
        color: '#444',
        marginBottom: '15px',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        {product.description}
      </p>

      <p style={{
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#8b4513'
      }}>
        Prix : {product.price} €
      </p>

      {product.region && (
        <p style={{
          marginTop: '10px',
          fontStyle: 'italic',
          color: '#666'
        }}>
          Origine : {product.region}
        </p>
      )}
      <button
        onClick={() => {
          if (!user) {
            alert("Veuillez vous connecter pour ajouter ce produit au panier.");
            return;
          }
          addToCart(product);
          alert("✅ Produit ajouté au panier !");
        }}
        style={{
          marginTop: '20px',
          padding: '12px 24px',
          backgroundColor: '#8b4513',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        🛒 Ajouter au panier
      </button>

    </div>
  );
}

export default ProductPageGrocery;
