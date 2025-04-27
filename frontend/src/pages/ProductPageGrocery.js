// src/pages/ProductPageGrocery.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


function ProductPageGrocery() {
  const { id } = useParams(); // récupérer l'id du produit depuis l'URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
      
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#5c4033'
      }}>
        {product.name}
      </h1>

      <img 
        src={`/images/${product.image}`} 
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
      
    </div>
  );
}

export default ProductPageGrocery;
