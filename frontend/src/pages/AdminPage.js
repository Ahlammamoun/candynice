import React, { useState } from 'react';
import ProductAdminPage from './ProductAdminPage'; // Import de la page de gestion des produits
import CategoryAdminPage from './CategoryAdminPage';
import UserAdminPage from './UserAdminPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminDashboard from './AdminDashboard';

export default function AdminPage({ token }) {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const changeSection = (section) => {
    setCurrentSection(section);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Menu de navigation */}
      <div style={{ width: '250px', backgroundColor: '#333', color: '#fff', padding: '20px' }}>
        <h2>Admin Dashboard</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              { section: 'products', label: 'Gestion des Produits' },
              { section: 'users', label: 'Gestion des Utilisateurs' },
              { section: 'categories', label: 'Gestion des Catégories' },
              { section: 'orders', label: 'Gestion des Commandes' } ,// ✅ Nouveau
               { section: 'statistiques', label: 'Statistiques' }
            ].map(({ section, label }) => (
              <li key={section} style={{ marginBottom: '10px' }}>
                <button
                  onClick={() => changeSection(section)}
                  style={{
                    backgroundColor: 'rgb(255, 204, 203)',
                    color: 'black',
                    padding: '20px',
                    width: '100%',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Contenu principal */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>

        {/* Affichage conditionnel des sections */}
        {currentSection === 'products' && <ProductAdminPage token={token} />}
        {currentSection === 'users' && <UserAdminPage token={token} />} {/* Gérer les utilisateurs ici */}
        {currentSection === 'categories' && <CategoryAdminPage token={token} />}
        {currentSection === 'orders' && <AdminOrdersPage />}
           {currentSection === 'statistiques' && <AdminDashboard />}
      </div>
    </div>
  );
}
