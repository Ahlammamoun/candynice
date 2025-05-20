 
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../components/CartContext';
import { useContext } from 'react';

function HomePage() {

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [regions, setRegions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const { addToCart } = useContext(CartContext);


    useEffect(() => {
        fetch('http://localhost:8000/api/categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
            });

        fetch('http://localhost:8000/api/products')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
                const allRegions = Array.from(new Set(data.map(p => p.region).filter(Boolean)));
                setRegions(allRegions);
            });
    }, []);



    const candyCategory = categories.find(cat => cat.name.toLowerCase() === 'candy');

    const filteredProducts = products.filter(p => {
        const matchRegion = selectedRegion ? p.region === selectedRegion : true;
        const matchSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchRegion && matchSearch;
    });

    const selectedProducts = filteredProducts.slice(0, 12);

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

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button
                    onClick={() => setShowFilters(prev => !prev)}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        backgroundColor: '#ffcccb',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                    }}
                >
                    {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
                </button>
            </div>

            {showFilters && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '30px',
                    width: '100%'
                }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '30px',
                        width: '100%'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            position: 'relative',
                            width: '60%',
                            maxWidth: '400px'
                        }}>
                            <select
                                id="region-select"
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                style={{
                                    padding: '10px 40px 10px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    width: '100%',
                                    appearance: 'none'
                                }}
                            >
                                <option value="">Toutes les régions</option>
                                {regions.map(region => (
                                    <option key={region} value={region}>{region}</option>
                                ))}
                            </select>

                            {selectedRegion && (
                                <button
                                    onClick={() => setSelectedRegion('')}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        color: '#888'
                                    }}
                                    aria-label="Réinitialiser la région"
                                >
                                    ✖
                                </button>
                            )}
                        </div>

                        <div style={{
                            position: 'relative',
                            width: '60%',
                            maxWidth: '400px',
                        }}>
                            <input
                                type="text"
                                placeholder="🔍 Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 40px 10px 15px',
                                    borderRadius: '10px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                    transition: 'border-color 0.3s',
                                }}
                                list="product-suggestions"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        color: '#888'
                                    }}
                                    aria-label="Effacer la recherche"
                                >
                                    ✖
                                </button>
                            )}
                            <datalist id="product-suggestions">
                                {products
                                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(p => (
                                        <option key={p.id} value={p.name} />
                                    ))}
                            </datalist>
                        </div>
                    </div>
                </div>
            )}

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
                            <img
                                src={
                                    product.image.startsWith('/uploads/')
                                        ? product.image
                                        : `/uploads/images/${product.image}`
                                }
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
                            <p style={{ fontSize: '0.95rem', marginBottom: '15px', color: '#666' }}>
                                {product.description}
                            </p>
                            <p style={{ fontSize: '0.95rem', marginBottom: '15px', color: '#666' }}>
                                {product.region}
                            </p>
                            <p style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#ff3366' }}>
                                {product.price} €
                            </p>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToCart(product);
                                }}
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: '#ff9900',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Ajouter au panier 🛒
                            </button>

                        </div>
                    </Link>
                ))}
            </div>

            <footer style={{ marginTop: '50px', padding: '20px', textAlign: 'center', backgroundColor: '#ffe6f0' }}>
                <p>&copy; 2025 CandyNice - Tous droits réservés.</p>
            </footer>
        </div>
    );
}

export default HomePage;
