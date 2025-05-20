
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { UserContext } from '../components/UserContext';


function GroceryHomePage() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [regions, setRegions] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(UserContext);


  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8000/api/categories').then(res => res.json()),
      fetch('http://localhost:8000/api/products').then(res => res.json())
    ]).then(([categoriesData, productsData]) => {
      setCategories(categoriesData);
      setProducts(productsData);
      setLoading(false);

      // Extraire les régions distinctes
      const allRegions = Array.from(new Set(productsData.map(p => p.region).filter(Boolean)));
      setRegions(allRegions);
    });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  const groceryCategory = categories.find(cat => cat.name.toLowerCase() === 'grocery');
  const grocerySubCategories = groceryCategory ? groceryCategory.children : [];

  const groceryProducts = products.filter(product => {
    const inGrocery = grocerySubCategories.some(subcat => subcat.slug === product.category);
    const matchRegion = selectedRegion ? product.region === selectedRegion : true;
    const matchSearch = searchTerm ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return inGrocery && matchRegion && matchSearch;
  });

  return (
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

      {/* Bouton Filtres */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowFilters(prev => !prev)}
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            backgroundColor: '#d2b48c',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            color: '#5c4033'
          }}
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
      </div>

      {/* Filtres visibles */}
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
          {/* Filtre région */}
          <div style={{
            position: 'relative',
            width: '60%',
            maxWidth: '400px',
            minWidth: '250px'
          }}>
            <select
              id="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 40px 10px 15px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                appearance: 'none',
                boxSizing: 'border-box'
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
                  top: '50%',
                  transform: 'translateY(-50%)',
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

          {/* Barre de recherche */}
          <div style={{
            position: 'relative',
            width: '60%',
            maxWidth: '400px',
            minWidth: '250px'
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
                boxSizing: 'border-box'
              }}
              list="grocery-suggestions"
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
            <datalist id="grocery-suggestions">
              {products
                .filter(p => grocerySubCategories.some(sc => sc.slug === p.category))
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(p => (
                  <option key={p.id} value={p.name} />
                ))}
            </datalist>
          </div>
        </div>
      )}

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
          <Link key={product.id} to={`/grocery/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '20px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <img src={product.image.startsWith('/uploads/') ? product.image : `/uploads/images/${product.image}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  marginBottom: '15px'
                }}
              />
              <h3 style={{
                fontSize: '1.5rem',
                color: '#5c4033',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {product.name}
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '10px' }}>
                {product.description}
              </p>
              <p style={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#6b8e23',
                marginBottom: '10px'
              }}>
                {product.price} €
              </p>
              {product.region && (
                <p style={{ fontSize: '0.9rem', color: '#999' }}>
                  Origine : {product.region}
                </p>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault(); // éviter que le lien <Link> s'active
                  if (!user) {
                    alert("Vous devez être connecté pour ajouter un produit au panier.");
                    return;
                  }
                  addToCart(product);
                }}
                style={{
                  marginTop: '10px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#6b8e23',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🛒 Ajouter au panier
              </button>

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


