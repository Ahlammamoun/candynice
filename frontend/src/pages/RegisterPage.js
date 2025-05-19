import { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';

export default function RegisterPage() {
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');


  useEffect(() => {
    // Optionnel : Vérification des données utilisateur au démarrage du composant
    console.log("Utilisateur actuel:", user);
  }, [user]);
  // Fonction pour gérer l'inscription
  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role: 'ROLE_USER' }),

      });

      if (!res.ok) {
        throw new Error('Erreur inscription');
      }

      const data = await res.json();
      setResponse('Inscription réussie ✅');
    } catch (error) {
      console.error(error);
      setResponse('Erreur inscription ❌');
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

      <h2 style={{ marginBottom: '20px', color: '#008080' }}>Inscription ✍️</h2>
      <input
        type="text"
        placeholder="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
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

      <button
        onClick={handleRegister}
        style={{
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
      >
        S'inscrire
      </button>

      <div style={{ marginTop: '20px', color: response.includes('réussie') ? 'green' : 'red' }}>
        {response}
      </div>
    </div>
  );
}
