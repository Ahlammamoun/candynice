import React, { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';

const CategoryAdminPage = () => {
  const { fetchWithAuth } = useUser();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    parent: '',
  });
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await fetchWithAuth('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Échec chargement catégories');
      }
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      alert('Le nom et le slug sont obligatoires');
      return;
    }

    const res = await fetchWithAuth('/api/categories', {
      method: 'POST',
      body: JSON.stringify(newCategory),
    });

    const result = await res.json();
    if (res.ok) {
      await loadCategories();
      setNewCategory({ name: '', slug: '', parent: '' });
      alert('Catégorie ajoutée avec succès !');
    } else {
      console.error(result);
      alert(result.error || "Erreur lors de l'ajout de la catégorie.");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setNewCategory({
      name: category.name,
      slug: category.slug,
      parent: category.parent_id || '',
    });
  };

  const handleUpdateCategory = async () => {
    const res = await fetchWithAuth(`/api/categories/${editingCategoryId}`, {
      method: 'PUT',
      body: JSON.stringify(newCategory),
    });

    const result = await res.json();
    if (res.ok) {
      await loadCategories();
      setEditingCategoryId(null);
      setNewCategory({ name: '', slug: '', parent: '' });
      alert('Catégorie mise à jour avec succès !');
    } else {
      console.error(result);
      alert(result.error || "Erreur lors de la mise à jour de la catégorie.");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;

    const res = await fetchWithAuth(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      await loadCategories();
    } else {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="admin-container">
      <h1 className="header">Admin - Gestion des Catégories</h1>

      <div className="form-container">
        <h3>{editingCategoryId ? "Modifier une catégorie" : "Ajouter une catégorie"}</h3>
        <input
          className="input-field"
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Nom"
        />
        <input
          className="input-field"
          type="text"
          value={newCategory.slug}
          onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
          placeholder="Slug"
        />
        <select
          className="input-field"
          value={newCategory.parent}
          onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
        >
          <option value="">Aucune catégorie parente</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button
          className="btn-submit"
          onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
        >
          {editingCategoryId ? "Mettre à jour" : "Ajouter"}
        </button>
      </div>

      <h3>Liste des catégories</h3>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <div className="category-block">
              <div>
                <h4>{cat.name}</h4>
                <p>Slug : {cat.slug}</p>
              </div>
              <div className="actions">
                <button className="btn-edit" onClick={() => handleEditCategory(cat)}>Modifier</button>
                <button className="btn-delete" onClick={() => handleDeleteCategory(cat.id)}>Supprimer</button>
              </div>
            </div>

            {cat.children && cat.children.length > 0 && (
              <ul className="subcategory-list">
                {cat.children.map((sub) => (
                  <li key={sub.id} className="subcategory-item">
                    <div className="subcategory-block">
                      <div>
                        <strong>{sub.name}</strong> <span className="slug">({sub.slug})</span>
                      </div>
                      <div className="actions">
                        <button className="btn-edit" onClick={() => handleEditCategory(sub)}>Modifier</button>
                        <button className="btn-delete" onClick={() => handleDeleteCategory(sub.id)}>Supprimer</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Styles intégrés */}
      <style>{`
        .admin-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Arial', sans-serif;
        }

        .header {
          text-align: center;
          font-size: 2em;
          margin-bottom: 20px;
        }

        .form-container {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .input-field {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }

        .btn-submit {
          width: 100%;
          background: #6c63ff;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        }

        .btn-submit:hover {
          background: #6c63ff;
        }

        .category-list {
          list-style: none;
          padding: 0;
        }

        .category-item {
          background: #f9f9f9;
          margin-bottom: 15px;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .category-block,
        .subcategory-block {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .subcategory-list {
          list-style: none;
          margin-top: 10px;
          padding-left: 20px;
          border-left: 2px solid #ddd;
        }

        .subcategory-item {
          margin-top: 10px;
        }

        .actions {
          display: flex;
          gap: 10px;
        }

        .btn-edit,
        .btn-delete {
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-edit {
          background-color: #ffc107;
          color: #000;
        }

        .btn-edit:hover {
          background-color: #e0a800;
        }

        .btn-delete {
          background-color: #dc3545;
          color: #fff;
        }

        .btn-delete:hover {
          background-color: #c82333;
        }

        .slug {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default CategoryAdminPage;

