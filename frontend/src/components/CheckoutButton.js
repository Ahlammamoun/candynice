// src/components/CheckoutButton.jsx
import { loadStripe } from '@stripe/stripe-js';

// Remplace avec ta vraie clé publique Stripe
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXX');

const CheckoutButton = () => {
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.id) {
        const stripe = await stripePromise;
        stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert("Une erreur est survenue lors de la création de la session.");
      }
    } catch (err) {
      console.error('Erreur Stripe:', err);
      alert('Impossible de démarrer le paiement.');
    }
  };

  return (
    <button onClick={handleClick}>
      Payer la box de bonbons 🍬
    </button>
  );
};

export default CheckoutButton;
