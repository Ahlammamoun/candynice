import React, { createContext, useState, useEffect, useContext } from 'react';

// Crée le contexte utilisateur
export const UserContext = createContext();

// Le provider du contexte utilisateur
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Lors du premier rendu, récupérer les données de localStorage (si elles existent)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur depuis localStorage', error);
      }
    }
  }, []);

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
    window.location.href = '/login'; // Redirection vers la page de login
  };

  // Fonction centralisée pour faire des appels API avec token et gestion 401
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

    // Gestion du token expiré
    if (response.status === 401) {
      const result = await response.json().catch(() => null);
      if (result?.message === 'Expired JWT Token') {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        logout();
        return;
      }
    }

    return response;
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout, fetchWithAuth }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte utilisateur
export const useUser = () => useContext(UserContext);
