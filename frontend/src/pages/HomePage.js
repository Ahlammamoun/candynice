import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function HomePage() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Charger les catégories
        fetch('http://localhost:8000/api/categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            });

        // Charger les produits
        fetch('http://localhost:8000/api/products')
            .then(response => response.json())
            .then(data => {
                console.log('DATA PRODUCTS:', data);
                setProducts(data);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Chargement en cours...</div>;
    }

    // Trouver la catégorie "Candy"
    const candyCategory = categories.find(cat => cat.name.toLowerCase() === 'candy');

    // Sélectionner 5 produits attractifs (par exemple les 5 premiers pour l'instant)
    const selectedProducts = products.slice(0, 12

    );

    return (
        <div style={{ padding: '20px', backgroundColor: 'rgb(230, 255, 247)', minHeight: '100vh' }}>
            <h1 style={{
                textAlign: 'center',
                fontSize: '2.8rem',
                marginBottom: '30px',
                color: '#5c4033',
                fontWeight: 'bold',
                letterSpacing: '2px'
            }}>
                Bienvenue dans notre Candies Shop 🍫
            </h1>
     
            {/* Sous-navigation */}
        
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
                {candyCategory && candyCategory.children && (
            
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                        {candyCategory.children.map(subcat => (
                            <Link key={subcat.id} to={`/category/${subcat.slug}`} style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#ffcccb', border: 'none', textDecoration: 'none', color: 'black' }}>
                                {subcat.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '25px'
            }}>
            
                {selectedProducts.map((product, index) => (
                    <Link key={product.id} to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                        <div
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
                            {/* 👉 L'image du produit */}
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

                            {/* 👉 Le titre */}
                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '10px',
                                background: 'linear-gradient(to right, #333, #ff6699)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textFillColor: 'transparent'
                            }}>
                                {product.name}
                            </h3>

                            {/* 👉 La description */}
                            <p style={{ fontSize: '0.95rem', marginBottom: '15px', color: '#666' }}>
                                {product.description}
                            </p>

                            {/* 👉 Le prix */}
                            <p style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#ff3366' }}>
                                {product.price} €
                            </p>
                        </div>
                    </Link>
                ))}

            </div>


            {/* Footer */}
            <footer style={{ marginTop: '50px', padding: '20px', textAlign: 'center', backgroundColor: '#ffe6f0' }}>
                <p>&copy; 2025 CandyNice - Tous droits réservés.</p>
            </footer>
        </div>
    );


























}

export default HomePage;

