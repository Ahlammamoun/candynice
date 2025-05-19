import { useUser } from '../components/UserContext';   
import React, { useContext } from 'react';
import { CartContext } from '../components/CartContext';
import { UserContext } from '../components/UserContext';
import { Navigate } from 'react-router-dom';

const CartPage = () => {
     const { fetchWithAuth } = useUser();
    const { user } = useContext(UserContext);
    const { cart, removeFromCart, clearCart } = useContext(CartContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2 style={{ fontSize: '2rem', color: '#666' }}>🛒 Votre panier est vide</h2>
            </div>
        );
    }

    const handleCheckout = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8000/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart: cart.map(item => ({

                        id: item.id,
                        quantity: item.quantity

                    })),
                    email: user.email
                })
            });


            const data = await response.json();
            const stripe = window.Stripe('pk_live_51FpejlK9Q2TyiugcJQHFelHbKeO4VhmNlPF7q2PlDV0EgxysFtUYKUbo1ZniO7s1jXunu25b3b9jkMBweVAqQes200hA1NzOqq');
            localStorage.setItem('cart_backup', JSON.stringify(cart));
            stripe.redirectToCheckout({ sessionId: data.id });
        } catch (error) {
            console.error("Erreur de redirection Stripe :", error.message || error);
            alert("Erreur lors de la tentative de paiement.");
        }
    };

    return (
        <div style={{
            padding: '2rem',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh'
        }}>
            <h1 style={{
                textAlign: 'center',
                fontSize: '2.5rem',
                color: '#5c4033',
                marginBottom: '2rem'
            }}>
                🛍️ Mon Panier
            </h1>

            <div style={{
                display: 'grid',
                gap: '1.5rem',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {cart.map(item => (
                    <div key={item.id} style={{
                        padding: '1.5rem',
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                    }}>
                        <h3 style={{ fontSize: '1.3rem', color: '#333' }}>{item.name}</h3>
                        <p style={{ margin: 0, color: '#666' }}>Prix unitaire : <strong>{item.price} €</strong></p>
                        <p style={{ margin: 0, color: '#666' }}>Quantité : <strong>{item.quantity}</strong></p>
                        <p style={{ margin: 0, color: '#666' }}>Sous-total : <strong>{(item.price * item.quantity).toFixed(2)} €</strong></p>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            style={{
                                marginTop: '0.5rem',
                                padding: '8px 14px',
                                backgroundColor: '#ff4d4f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>

            <div style={{
                maxWidth: '800px',
                margin: '3rem auto 0',
                padding: '2rem',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
                    🧾 Total du panier : <span style={{ color: '#00cc99' }}>{total.toFixed(2)} €</span>
                </h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                        onClick={handleCheckout}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#00cc99',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        💳 Payer le panier
                    </button>

                    <button
                        onClick={clearCart}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#999',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        🗑 Vider le panier
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

