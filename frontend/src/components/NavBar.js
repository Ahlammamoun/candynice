import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import { CartContext } from './CartContext';

function NavBar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const { user, logout } = useContext(UserContext);
  const { totalQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const [isGroceryPage, setIsGroceryPage] = useState(false);
  const [isGroceryCategoryPage, setIsGroceryCategoryPage] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      backgroundColor: isGroceryPage || isGroceryCategoryPage
        ? 'rgb(210, 180, 140)'
        : 'rgb(255, 204, 203)',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottomRightRadius: '13px',
      borderBottomLeftRadius: '13px',
    }}>
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
        <Link to="/cart" style={{ position: 'relative', fontSize: '1.2rem', textDecoration: 'none' }}>
          🛒
          {totalQuantity > 0 && (
            <span style={{
              position: 'absolute',
              top: '-17px',
              right: '-10px',
              background: '#ff3366',
              color: 'white',
              borderRadius: '50%',
              padding: '4px 8px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              lineHeight: '1',
              minWidth: '20px',
              textAlign: 'center'
            }}>
              {totalQuantity}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <span style={{ ...linkStyle, fontWeight: 'bold' }}>
              <span style={{ marginLeft: '10px', fontStyle: 'italic' }}>
            <span>👋{user.name}, tu es </span>
              </span>
              {user.roles?.includes('ROLE_ADMIN') ?  t('admin') : t('user')}
            </span>

            <Link to="/my-orders" style={linkStyle}>{t('my_orders')}</Link>
            <button
              onClick={handleLogout}
              style={{
                ...linkStyle,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                padding: 0
              }}
            >
              {t('logout')}
            </button>
            {user.roles?.includes('ROLE_ADMIN') && (
              <Link to="/admin" style={linkStyle}>Backoffice</Link>
            )}
          </>
        ) : (
          <Link to="/login" style={linkStyle}>{t('login')}</Link>
        )}

        <Link to="/" style={linkStyle}>{t('home')}</Link>
        <Link to="/register" style={linkStyle}>{t('register')}</Link>
        <Link to="/" style={linkStyle}>{t('candies')}</Link>
        <Link to="/grocery" style={linkStyle}>{t('groceries')}</Link>
        <button onClick={toggleLanguage}>
          🌍 {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
