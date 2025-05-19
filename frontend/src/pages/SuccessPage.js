
import React, { useEffect, useContext, useRef } from 'react';
import { CartContext } from '../components/CartContext';
import { UserContext } from '../components/UserContext';

const SuccessPage = () => {

  const { cart, clearCart } = useContext(CartContext);
  const { token, user, setUser, setToken } = useContext(UserContext);
  const hasSent = useRef(false);

  // ✅ Restaurer l'utilisateur et le token depuis localStorage si perdus (ex : retour Stripe)
  useEffect(() => {
    if (!user || !token) {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("❌ Erreur de récupération user/token :", e);
        }
      }
    }
  }, [user, token, setToken, setUser]);

  // ✅ Envoyer la commande une seule fois si toutes les conditions sont remplies
  useEffect(() => {
    if (hasSent.current) return;
    if (!token || !user || cart.length === 0) return;

    const sendOrder = async () => {
      hasSent.current = true;
      try {
        const response = await fetch('http://localhost:8000/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
          }))),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("❌ Commande refusée :", data);
        } else {
          console.log("✅ Commande enregistrée :", data);
          clearCart(); // ✅ Seulement après succès
        }
      } catch (err) {
        console.error("❌ Erreur réseau :", err);
      }
    };

    sendOrder();
  }, [token, user, cart, clearCart]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>✅ Paiement réussi</h1>
      <p>Merci pour votre commande{user?.name ? `, ${user.name} !` : ' !'}</p>
    </div>
  );

};

export default SuccessPage;
