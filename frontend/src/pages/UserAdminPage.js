import React, { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';

export default function UserAdminPage() {
  const { fetchWithAuth } = useUser();
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', roles: ['ROLE_USER'] });

  const loadUsers = async () => {
    const res = await fetchWithAuth('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/users/${editingId}` : '/api/users';

    const payload = editingId
      ? { email: form.email, roles: form.roles }
      : { ...form };

    const res = await fetchWithAuth(url, {
      method,
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      await loadUsers();
      setEditingId(null);
      setForm({ email: '', password: '', roles: ['ROLE_USER'] });
      alert(editingId ? 'Utilisateur modifié' : 'Utilisateur créé');
    } else {
      alert(data.error || 'Erreur');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({
      email: user.email,
      password: '',
      roles: user.roles,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    const res = await fetchWithAuth(`/api/users/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="admin-container">
      <h1 className="header">Admin - Utilisateurs</h1>

      <div className="form-container">
        <h3>{editingId ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</h3>
        <input
          className="input-field"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {!editingId && (
          <input
            className="input-field"
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        )}
        <select
          className="input-field"
          value={form.roles[0]}
          onChange={(e) => setForm({ ...form, roles: [e.target.value] })}
        >
          <option value="ROLE_USER">Utilisateur</option>
          <option value="ROLE_ADMIN">Administrateur</option>
        </select>

        <button className="btn-submit" onClick={handleSubmit}>
          {editingId ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>

      <h3>Liste des utilisateurs</h3>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div>
              <strong>{user.email}</strong> — {user.roles.join(', ')}
            </div>
            <div className="actions">
              <button className="btn-edit" onClick={() => handleEdit(user)}>✏️</button>
              <button className="btn-delete" onClick={() => handleDelete(user.id)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .admin-container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
        }

        .header {
          font-size: 2em;
          text-align: center;
          margin-bottom: 20px;
        }

        .form-container {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }

        .input-field {
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .btn-submit {
          width: 100%;
          padding: 12px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .btn-submit:hover {
          background-color: #45a049;
        }

        .user-list {
          list-style: none;
          padding: 0;
        }

        .user-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9f9f9;
          padding: 12px;
          border-radius: 5px;
          margin-bottom: 10px;
        }

        .actions button {
          margin-left: 10px;
          padding: 6px 10px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-edit {
          background-color: #ffc107;
        }

        .btn-delete {
          background-color: #dc3545;
          color: white;
        }

        .btn-edit:hover {
          background-color: #e0a800;
        }

        .btn-delete:hover {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
}
