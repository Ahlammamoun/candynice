import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_COLORS = {
    en_attente: '#FFB347',
    payee: '#4CAF50',
    expediee: '#2196F3',
    livree: '#9C27B0',
    annulee: '#F44336',
};

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        fetch('http://localhost:8000/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(setStats)
            .catch(err => console.error('Erreur stats :', err));
    }, []);

    if (!stats) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Chargement...</p>;

    const chartData = stats.monthlyRevenue
        ? Object.entries(stats.monthlyRevenue).map(([month, revenue]) => ({ month, revenue }))
        : [];

    const statusData = stats.statusCount
        ? Object.entries(stats.statusCount).map(([status, count]) => ({ name: status, value: count }))
        : [];

    const yearlyData = stats.yearlyRevenue
        ? Object.entries(stats.yearlyRevenue).map(([year, revenue]) => ({ year, revenue }))
        : [];

    const handleExport = () => {
        const token = localStorage.getItem('auth_token');
        fetch('http://localhost:8000/api/admin/orders/export', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'commandes.csv';
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert('❌ Erreur export CSV'));
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '1rem' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
                📈 Tableau de bord administrateur
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={cardStyle}><strong>🛒 Total commandes</strong><p>{stats.totalOrders}</p></div>
                <div style={cardStyle}><strong>💰 Chiffre d'affaires</strong><p>{stats.totalRevenue.toFixed(2)} €</p></div>
                <div style={cardStyle}><strong>📊 Panier moyen</strong><p>{stats.averageOrder.toFixed(2)} €</p></div>
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>📦 Top produits vendus</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem'
                }}>
                    {Object.entries(stats.productSales).map(([product, qty], i) => (
                        <div key={i} style={{
                            backgroundColor: '#fdfdfd',
                            padding: '1rem',
                            borderRadius: '10px',
                            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                            textAlign: 'center',
                            fontSize: '1rem',
                            fontWeight: 500
                        }}>
                            {product} — <span style={{ color: '#4CAF50' }}>{qty} ventes</span>
                        </div>
                    ))}
                </div>

            </div>

            <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <button onClick={handleExport} style={buttonStyle}>
                    ⬇️ Exporter les commandes (CSV)
                </button>
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>📅 Chiffre d’affaires mensuel</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid stroke="#eee" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>📊 Répartition des statuts de commande</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={100}
                            label
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#8884d8'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>📆 Chiffre d’affaires annuel</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yearlyData}>
                        <CartesianGrid stroke="#eee" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="revenue" stroke="#00C49F" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontSize: '1.1rem',
};

const sectionStyle = {
    marginBottom: '3rem',
};

const sectionTitleStyle = {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
};

const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s',
};

