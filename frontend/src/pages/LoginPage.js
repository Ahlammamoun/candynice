import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext'; // Assurez-vous du bon chemin d'importation

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  
  const { setUser, setToken } = useContext(UserContext); // Utilisation correcte du UserContext
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Vérifier la réponse
      const textResponse = await res.text(); // Récupérer la réponse en texte brut
      console.log("Réponse brute du serveur:", textResponse);  // Loguer la réponse brute

      if (!res.ok || !textResponse) {
        throw new Error('Erreur connexion ou réponse vide');
      }

      // Tenter de parser la réponse en JSON
      let data;
      try {
        data = JSON.parse(textResponse); // Parser la réponse en JSON
      } catch (error) {
        console.error("Erreur lors du parsing JSON:", error);
        throw new Error('Réponse malformée du serveur');
      }

      // Vérifier que la réponse contient les données attendues
      if (!data.token || !data.role) {
        throw new Error('Données invalides reçues du serveur');
      }

      // Stocker dans localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('role', JSON.stringify(data.role)); // Stocker le role au lieu de user

      // Mettre à jour le contexte utilisateur avec les données de réponse
      setUser({ role: data.role }); // Stocker le rôle dans l'état utilisateur
      setToken(data.token);

      setResponse('Connexion réussie ✅');
      navigate('/'); // Rediriger vers la page d'accueil après la connexion
    } catch (error) {
      console.error(error);
      setResponse(`Erreur connexion ❌: ${error.message}`);
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '400px',
      margin: '50px auto',
      backgroundColor: '#e6fff7',
      borderRadius: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    }}>
      <h2 style={{ marginBottom: '20px', color: '#008080' }}>Connexion</h2>
      <div>{response}</div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          outline: 'none',
        }}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          outline: 'none',
        }}
      />
      <button onClick={handleLogin}  style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#00bfa6',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#00a28d'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#00bfa6'}
        >Se connecter
        </button>
        <div style={{ marginTop: '20px', color: response.includes('réussie') ? 'green' : 'red' }}>
        {response}
      </div>
    </div>
  );
};

export default LoginPage;
