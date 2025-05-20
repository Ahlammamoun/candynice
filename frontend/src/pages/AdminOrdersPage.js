import React, { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';

const AdminOrdersPage = () => {
  const { user, token } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      alert('❌ Vous devez être connecté pour accéder aux commandes.');
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:8000/api/orders/all', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            alert('⛔️ Session expirée ou accès refusé.');
            window.location.href = '/login';
          } else {
            throw new Error('Erreur serveur');
          }
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setOrders(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors de la récupération des commandes :', err);
        setLoading(false);
      });
  }, [token]);


  const updateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Erreur lors de la mise à jour du statut');
        return;
      }

      // ✅ Mise à jour locale immédiate
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      // 🔄 Optionnel : revalidation silencieuse (facultatif)
      // await fetchOrders(); // si tu veux renforcer la cohérence après quelques secondes

      alert('✅ Statut mis à jour');
    } catch (err) {
      console.error('Erreur mise à jour statut :', err);
      alert('Erreur réseau');
    }
  };


  if (loading) return <p>Chargement...</p>;
  if (!orders.length) return <p>Aucune commande trouvée.</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2>📦 Liste des commandes</h2>
      {orders.map(order => (
        <div key={order.id} style={{
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '10px',
          backgroundColor: '#fff',
          marginBottom: '1rem'
        }}>
          <h4>Commande #{order.id}</h4>
          <p>👤 {order.user_email}</p>
          <p>📅 {order.createdAt}</p>
          <p>📦 {order.status}</p>
          <p>💰 Total : {order.total.toFixed(2)} €</p>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            style={{ marginBottom: '1rem' }}
          >
            <option value="en_attente">🕓 En attente</option>
            <option value="payee">✅ Payée</option>
            <option value="expediee">📦 Expédiée</option>
            <option value="livree">📬 Livrée</option>
            <option value="annulee">❌ Annulée</option>
          </select>

          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.product} — {item.quantity} × {item.unit_price} €
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersPage;
