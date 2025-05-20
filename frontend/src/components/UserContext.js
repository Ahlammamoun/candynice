import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const logout = (shouldRedirect = true) => {
    console.log('👋 Déconnexion !');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    if (shouldRedirect) navigate('/login');
  };


  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token'); // ou récupéré depuis un context

    const authOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, authOptions);

      if (response.status === 401) {
        const clone = response.clone();

        try {
          const result = await clone.json();
          if (result?.message === 'Expired JWT Token') {
            alert('Votre session a expiré. Veuillez vous reconnecter.');
            if (typeof logout === 'function') logout();
            return null;
          }
        } catch (e) {
          // JSON mal formé ou vide
        }
      }

      return response;
    } catch (error) {
      console.error('Erreur réseau :', error);
      throw error;
    }
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
      logout(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout, fetchWithAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

