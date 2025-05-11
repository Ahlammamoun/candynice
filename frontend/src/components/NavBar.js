import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { UserContext } from '../components/UserContext';

function NavBar() {
  const { user, setUser, token } = useContext(UserContext);
  const [isGroceryPage, setIsGroceryPage] = useState(false);
  const [isGroceryCategoryPage, setIsGroceryCategoryPage] = useState(false);


  // Use useLocation to detect route changes
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    setIsGroceryPage(path.startsWith('/grocery'));

  }, [location]);


  useEffect(() => {
    const match = location.pathname.match(/^\/category\/(.+)$/);
    const slug = match?.[1];

    if (slug) {
      fetch('http://localhost:8000/api/categories')
        .then(res => res.json())
        .then(categories => {
          const grocery = categories.find(c => c.slug === 'grocery');
          const isInGrocery = grocery?.children?.some(child => child.slug === slug);
          setIsGroceryCategoryPage(!!isInGrocery);
        });
    } else {
      setIsGroceryCategoryPage(false);
    }
  }, [location]);

  const linkStyle = {
    fontSize: '1.1rem',
    color: isGroceryPage ? '#5c4033' : '#333',
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.3s',
  };

  const linkStyleRole = {
    fontSize: '1.1rem',
    color: isGroceryPage ? 'black' : 'black', // Keep this black, as it's a valid color
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.3s',
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: isGroceryPage || isGroceryCategoryPage
        ? 'rgb(210, 180, 140)'
        : location.pathname.startsWith('/category/')
          ? 'rgb(255, 204, 203' // neutre rosé si catégorie mais pas grocery
          : 'rgb(255, 204, 203)',


      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottomRightRadius: '13px',
      borderBottomLeftRadius: '13px',
    }}>
      {/* Left: Logo */}
      <div>
        <Link to="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: isGroceryPage || isGroceryCategoryPage ? '#5c4033' : '#ff6699',
          textDecoration: 'none',
        }}>
          {isGroceryPage || isGroceryCategoryPage ? "GroceryFine" : "CandyNice"}
        </Link>
      </div>


      {/* Right: Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '20px',
      }}>


        {/* User Role Display */}
        {user ? (
          <>
            <span style={linkStyleRole}>
              {user.role && user.role.includes('ROLE_ADMIN') ? 'Hello👋 Admin' : 'Hello👋 Utilisateur'}
            </span>
            <Link to="/" onClick={handleLogout} style={linkStyle}>Logout</Link>
            {user.role && user.role.includes('ROLE_ADMIN') && (
              <Link to="/admin" style={linkStyle}>Backoffice</Link>
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
          </>
        )}
        <Link to="/" style={linkStyle}>Accueil</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
        <Link to="/" style={linkStyle}>Candies</Link>
        <Link to="/grocery" style={linkStyle}>Groceries</Link>

      </div>
    </nav>
  );
}

export default NavBar;
