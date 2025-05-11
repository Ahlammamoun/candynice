import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();
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
    return <div>Produit non trouvé 😢</div>;
  }

  return (
    
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <img 
        src={`/images/${product.image}`} 
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
    </div>
  );
}

export default ProductPage;
