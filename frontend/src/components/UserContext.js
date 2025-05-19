import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const logout = () => {
    console.log('👋 Déconnexion !');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  const fetchWithAuth = async (url, options = {}) => {
    const authOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, authOptions);

    if (response.status === 401) {
      // ✅ Clone la réponse pour lire son corps sans consommer l'original
      const clone = response.clone();

      try {
        const result = await clone.json();
        if (result?.message === 'Expired JWT Token') {
          alert('Votre session a expiré. Veuillez vous reconnecter.');
          logout();
          return null; // ⚠️ important : retourne null
        }
      } catch (e) {
        // JSON vide ou mal formé → on ignore
      }
    }

    return response;
  };


  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        console.log('✅ Session restaurée depuis localStorage');
      } catch (e) {
        console.error('❌ Erreur de parsing localStorage user', e);
        logout();
      }
    } else if (storedToken && !storedUser) {
      // Tentative de récupération depuis l'API
      fetch('http://localhost:8000/api/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          if (res.status === 401) {
            console.log('🚫 Token invalide, on déconnecte');
            logout();
            return;
          }

          const data = await res.json();
          console.log('✅ Utilisateur récupéré via /api/me :', data);
          setToken(storedToken);
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch((err) => {
          console.error('Erreur lors de /api/me :', err);
          logout();
        });
    } else {
      logout();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout, fetchWithAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

