import React, { useEffect, useState } from 'react';

const ProductAdminPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
        stock: 0,
        category: '',  // Slug de la catégorie principale
        subCategory: '',  // Slug de la sous-catégorie
        region: ''
    });

    const [imageFile, setImageFile] = useState(null); // Gestion de l'image téléchargée
    const [editingProductId, setEditingProductId] = useState(null); // ID du produit en cours d'édition

    useEffect(() => {
        // Récupérer tous les produits
        fetch('/api/products')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                console.log("Produits récupérés:", data);  // Vérification des produits
            })
            .catch((error) => console.error('Error fetching products:', error));

        // Récupérer les catégories depuis l'API
        fetch('/api/categories')
            .then((response) => response.json())
            .then((data) => {
                setCategories(data);
                console.log("Categories récupérées:", data);  // Vérification des catégories
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);
    // console.log(categories);
    // Fonction pour ajouter un produit
    const handleAddProduct = async () => {
        // Vérification des champs obligatoires
        if (!newProduct.region) {
            alert("Le champ 'Région' est obligatoire");
            return;
        }
        if (!newProduct.category || !newProduct.subCategory) {
            alert("La catégorie et la sous-catégorie sont obligatoires");
            return;
        }

        let imageUrl = newProduct.image;
        if (imageFile) {
            // Si une nouvelle image a été téléchargée, upload l'image et récupérer son URL
            imageUrl = await uploadImage(imageFile);
            if (!imageUrl) {
                alert('Erreur lors de l\'upload de l\'image');
                return;
            }
        }

        // Envoi de la requête POST pour ajouter un produit
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
            },
            body: JSON.stringify({
                ...newProduct,
                image: imageUrl, // Inclure l'URL de l'image dans les données
            }),
        });

        const result = await response.json(); // Récupérer la réponse sous forme JSON
        console.log("Réponse de l'API après ajout du produit:", result); // Afficher la réponse dans la console

        if (response.ok) {
            // Ajouter le produit à la liste sans avoir besoin de rafraîchir
            setProducts((prevProducts) => [
                ...prevProducts,
                {
                    id: Date.now(), // ID temporaire (ou tu peux le récupérer de la réponse si l'API le fournit)
                    name: newProduct.name,
                    description: newProduct.description,
                    price: newProduct.price,
                    image: imageUrl, // Image envoyée ou téléchargée
                    stock: newProduct.stock,
                    region: newProduct.region,
                    category: newProduct.category,
                    subCategory: newProduct.subCategory
                }
            ]);

            // Réinitialiser les champs du formulaire après l'ajout
            setNewProduct({
                name: '',
                description: '',
                price: 0,
                image: '',
                stock: 0,
                category: '',
                subCategory: '',
                region: ''
            });
            setImageFile(null); // Réinitialiser l'image téléchargée
            alert("Produit ajouté avec succès !");
        } else {
            console.error('Erreur lors de l\'ajout du produit:', result);
            alert("Erreur lors de l'ajout du produit.");
        }
    };


    // Fonction pour gérer le téléchargement de l'image
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {  // Assurez-vous que cette route d'upload existe
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
            },
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            return result.imageUrl;  // Retourne l'URL de l'image téléchargée
        } else {
            console.error(result);
            return null;
        }
    };

    // Fonction pour modifier un produit
    const handleEditProduct = (productId) => {
        const productToEdit = products.find((product) => product.id === productId);

        if (!productToEdit) {
            console.error('Produit non trouvé');
            return;
        }

        console.log('Produit à éditer:', productToEdit);

        // Trouver la catégorie principale à partir du slug de la sous-catégorie
        const selectedCategory = categories.find(category =>
            category.children?.some(sub => sub.slug === productToEdit.category)
        );

        // Trouver la sous-catégorie exacte
        const selectedSubCategory = selectedCategory?.children?.find(
            sub => sub.slug === productToEdit.category
        );

        console.log('Catégorie principale sélectionnée:', selectedCategory);
        console.log('Sous-catégorie sélectionnée:', selectedSubCategory);

        // Pré-remplir le formulaire avec les données du produit
        setEditingProductId(productId);
        setNewProduct({
            name: productToEdit.name,
            description: productToEdit.description,
            price: productToEdit.price,
            image: productToEdit.image,
            stock: productToEdit.stock,
            region: productToEdit.region || '',
            category: selectedCategory?.slug || '',       // slug de la catégorie principale
            subCategory: selectedSubCategory?.slug || '', // slug de la sous-catégorie
        });

        // Mettre à jour la liste des sous-catégories
        if (selectedCategory && selectedCategory.children) {
            setSubCategories(selectedCategory.children);
        } else {
            setSubCategories([]);
        }

        setImageFile(null); // Réinitialiser l'image uploadée
    };


    const handleUpdateProduct = async () => {
        // Vérification des champs obligatoires
        if (!newProduct.region) {
            alert("Le champ 'Région' est obligatoire");
            return;
        }
    
        if (!newProduct.category || !newProduct.subCategory) {
            alert("La catégorie et la sous-catégorie sont obligatoires");
            return;
        }
    
        let imageUrl = newProduct.image;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
            if (!imageUrl) {
                alert("Erreur lors de l'upload de l'image");
                return;
            }
        }
    
        // Effectuer la mise à jour du produit
        const response = await fetch(`/api/products/${editingProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
            },
            body: JSON.stringify({
                ...newProduct,
                image: imageUrl,
            }),
        });
    
        const result = await response.json();
        console.log('Résultat de la mise à jour :', result);
    
        if (response.ok) {
            // Recharger toute la liste des produits depuis l'API
            fetch('/api/products')
                .then((res) => res.json())
                .then((updatedProducts) => {
                    setProducts(updatedProducts);
                    alert("Produit mis à jour avec succès !");
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des produits :", error);
                    alert("Produit mis à jour, mais échec de la mise à jour de la liste.");
                });
    
            // Réinitialiser l'état d'édition
            setEditingProductId(null);
            setNewProduct({
                name: '',
                description: '',
                price: 0,
                image: '',
                stock: 0,
                category: '',
                subCategory: '',
                region: ''
            });
            setImageFile(null);
        } else {
            console.error('Erreur lors de la mise à jour du produit:', result);
            alert("Erreur lors de la mise à jour du produit.");
        }
    };
    
    // Fonction pour supprimer un produit
    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
                },
            });

            if (response.ok) {
                setProducts(products.filter((product) => product.id !== id));  // Retirer le produit supprimé
            } else {
                console.error("Erreur lors de la suppression du produit.");
            }
        } catch (error) {
            console.error("Erreur de réseau:", error);
        }
    };

    // Fonction pour récupérer les sous-catégories d'une catégorie par slug
    const handleCategoryChange = (categorySlug) => {
        setNewProduct({ ...newProduct, category: categorySlug, subCategory: '' });

        // Trouver la catégorie sélectionnée par son slug
        const selectedCategory = categories.find(category => category.slug === categorySlug);

        // Mettre à jour les sous-catégories avec les données de la catégorie sélectionnée
        if (selectedCategory && selectedCategory.children) {
            setSubCategories(selectedCategory.children);
        } else {
            setSubCategories([]);
        }
    };



    return (
        <div className="admin-container">
            <h1 className="header">Admin - Gestion des Produits</h1>

            {/* Formulaire d'ajout ou de modification */}
            <div className="form-container">
                <h3>{editingProductId ? "Modifier un produit" : "Ajouter un nouveau produit"}</h3>
                <input
                    className="input-field"
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Nom"
                />
                <textarea
                    className="input-field"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Description"
                />
                <input
                    className="input-field"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    placeholder="Prix"
                />
                <input
                    className="input-field"
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="Image URL"
                />
                <input
                    className="input-field"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                    placeholder="Stock"
                />

                {/* Sélecteur de catégorie principale */}
                {/* Sélecteur de catégorie principale */}
                <select
                    className="input-field"
                    value={newProduct.category}  // Lien avec l'état 'category'
                    onChange={(e) => handleCategoryChange(e.target.value)}  // Mettre à jour la catégorie et les sous-catégories
                >
                    <option value="">Sélectionner une catégorie principale</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {/* Sélecteur de sous-catégorie */}
                <select
                    className="input-field"
                    value={newProduct.subCategory}  // Lien avec l'état 'subCategory'
                    onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                    disabled={!newProduct.category}  // Désactive le select si aucune catégorie principale n'est sélectionnée
                >
                    <option value="">Sélectionner une sous-catégorie</option>
                    {subCategories.length > 0 ? (
                        subCategories.map((subCategory) => (
                            <option key={subCategory.id} value={subCategory.slug}>
                                {subCategory.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Aucune sous-catégorie disponible</option>
                    )}
                </select>




                <input
                    className="input-field"
                    type="text"
                    value={newProduct.region}
                    onChange={(e) => setNewProduct({ ...newProduct, region: e.target.value })}
                    placeholder="Région"
                />
                <button
                    className="btn-submit"
                    onClick={editingProductId ? handleUpdateProduct : handleAddProduct}
                >
                    {editingProductId ? "Mettre à jour" : "Ajouter"}
                </button>
            </div>

            {/* Liste des produits */}
            <h3>Liste des produits</h3>
            <ul className="product-list">
                {products.map((product) => (
                    <li key={product.id} className="product-item">
                        <div>
                            <h4>{product.name}</h4>
                            <p>{product.price}€</p>
                            <div className="actions">
                                <button className="btn-edit" onClick={() => handleEditProduct(product.id)}>Modifier</button>
                                <button className="btn-delete" onClick={() => handleDeleteProduct(product.id)}>Supprimer</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* CSS pour la page */}
            <style>{`
                /* Container général */
                .admin-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f7fb;
                    border-radius: 8px;
                }

                /* En-tête */
                .header {
                    font-size: 2em;
                    color: #333;
                    margin-bottom: 20px;
                    text-align: center;
                }

                /* Formulaire d'ajout et d'édition */
                .form-container {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }

                /* Titres du formulaire */
                .form-container h3 {
                    color: #333;
                    margin-bottom: 20px;
                    font-size: 1.5em;
                }

                /* Champs du formulaire */
                .input-field {
                    width: 100%;
                    padding: 12px;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1em;
                    background-color: #f9f9f9;
                }

                .input-field:focus {
                    border-color: #6c63ff;
                    outline: none;
                    background-color: #fff;
                }

                /* Sélecteurs */
                select.input-field {
                    background-color: #f9f9f9;
                    cursor: pointer;
                }

                /* Bouton de soumission */
                .btn-submit {
                    width: 100%;
                    padding: 14px;
                    background-color: #6c63ff;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.2em;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .btn-submit:hover {
                    background-color: #574bda;
                }

                /* Liste des produits */
                .product-list {
                    list-style-type: none;
                    padding: 0;
                    margin-top: 30px;
                }

                .product-item {
                    background-color: #fff;
                    padding: 20px;
                    margin-bottom: 10px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .product-item h4 {
                    margin: 0;
                    font-size: 1.2em;
                    color: #333;
                }

                .product-item p {
                    color: #777;
                }

                .actions {
                    display: flex;
                    gap: 10px;
                }

                .btn-edit {
                    padding: 8px 16px;
                    background-color: #f39c12;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .btn-edit:hover {
                    background-color: #e67e22;
                }

                .btn-delete {
                    padding: 8px 16px;
                    background-color: #e74c3c;
                    border: none;
                    border-radius: 4px;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                .btn-delete:hover {
                    background-color: #c0392b;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .admin-container {
                        padding: 15px;
                    }

                    .form-container {
                        padding: 20px;
                    }

                    .input-field {
                        padding: 10px;
                    }

                    .btn-submit {
                        font-size: 1em;
                    }

                    .product-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .actions {
                        justify-content: space-between;
                        width: 100%;
                    }

                    .btn-edit,
                    .btn-delete {
                        width: 100%;
                        margin-top: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProductAdminPage;
