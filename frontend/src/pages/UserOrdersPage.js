import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../components/UserContext';

const UserOrdersPage = () => {
  const { t } = useTranslation();
  const { fetchWithAuth, token } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/orders/${orderId}/invoice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error(t('download_error'));

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-commande-${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchWithAuth('http://localhost:8000/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des commandes :', err);
        setLoading(false);
      });
  }, [fetchWithAuth]);

  if (loading) return <p style={{ padding: '2rem' }}>{t('loading')}</p>;
  if (!orders.length) return <p style={{ padding: '2rem' }}>{t('no_orders')}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>🧾 {t('orders_title')}</h2>
      {orders.map(order => (
        <div key={order.id} style={{
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          backgroundColor: '#fff'
        }}>
          <h4 style={{ marginBottom: '0.5rem' }}>
            {t('order_number', { id: order.id })}
          </h4>
          <p style={{ margin: '0 0 0.5rem 0', color: '#555' }}>
            📅 {t('date')}: {order.createdAt}
          </p>
          <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
            💰 {t('total')}: {order.total.toFixed(2)} €
          </p>

          <ul style={{ paddingLeft: '1.2rem', marginBottom: '1rem' }}>
            {order.items.map((item, index) => (
              <li key={index} style={{ marginBottom: '0.4rem' }}>
                🧃 {item.product} — {item.quantity} × {item.unit_price.toFixed(2)} €
              </li>
            ))}
          </ul>

          <button onClick={() => downloadInvoice(order.id)} style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            📄 {t('download_invoice')}
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserOrdersPage;
