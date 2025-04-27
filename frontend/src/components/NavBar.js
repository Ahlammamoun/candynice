import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function NavBar() {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [isGroceryPage, setIsGroceryPage] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/grocery')) {
      setIsGroceryPage(true);
    } else if (path.startsWith('/category/')) {
      const slug = path.split('/category/')[1];
      let found = false;

      for (const category of categories) {
        for (const child of category.children) {
          if (child.slug === slug && category.slug === 'grocery') {
            found = true;
          }
        }
      }
      setIsGroceryPage(found);
    } else {
      setIsGroceryPage(false);
    }
  }, [location, categories]);

  const linkStyle = {
    fontSize: '1.1rem',
    color: isGroceryPage ? '#5c4033' : '#333',
    textDecoration: 'none',
    position: 'relative',
    transition: 'color 0.3s',
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: isGroceryPage ? '#f5f0e1' : '#ffe6f0',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderbottomrightradius: '13px',
      borderbottomleftradius: '13px',
    }}>

      {/* Left : Logo */}
      {/* Left : Logo */}
      <div style={{ flex: 1 }}>
        <Link to="/" style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: isGroceryPage ? '#5c4033' : '#ff6699',  // Marron ou Rose
          textDecoration: 'none',
        }}>
          {isGroceryPage ? "GroceryFine" : "CandyNice"}
        </Link>
      </div>



      {/* Center : Emoji */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        fontSize: '1.8rem',
      }}>
        {isGroceryPage ? (
          <>
            <span role="img" aria-label="pain">🥖</span>
            <span role="img" aria-label="fromage">🧀</span>
            <span role="img" aria-label="huile">🫒</span>
            <span role="img" aria-label="riz">🍚</span>
            <span role="img" aria-label="pot">🥫</span>
          </>
        ) : (
          <>
            <span role="img" aria-label="candy">🤤</span>
            <span role="img" aria-label="bonbon">🍬</span>
            <span role="img" aria-label="chocolat">🍫</span>
            <span role="img" aria-label="chariot">🛒</span>
            <span role="img" aria-label="lollipop">🍭</span>
          </>
        )}
      </div>

      {/* Right : Links */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '20px',
      }}>
        <Link to="/" style={linkStyle}>Accueil</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/" style={linkStyle}>Candies</Link>
        <Link to="/grocery" style={linkStyle}>Groceries</Link>
      </div>

    </nav>
  );
}

export default NavBar;
