import React, { useState } from 'react';
import CategoryForm from './CategoryForm';

const Categories = ({
                        categories,
                        products,
                        userPermissions,
                        token,
                        setMessage,
                        refreshCategories,
                        API_URL
                    }) => {
    const [newCategoryName, setNewCategoryName] = useState('');

    // Add category
    const addCategory = async (e) => {
        e.preventDefault();

        if (!userPermissions.can_manage_categories) {
            setMessage({ text: 'You don\'t have permission to manage categories', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/adicionarCategoria`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nome: newCategoryName }),
            });

            if (!response.ok) {
                throw new Error(`Error adding the category: ${response.statusText}`);
            }

            setMessage({ text: 'Category successfully added.', type: 'success' });
            refreshCategories();
            setNewCategoryName('');
        } catch (error) {
            console.error('Error adding category:', error);
            setMessage({ text: 'Error adding the category.', type: 'error' });
        }
    };

    // Remove category
    const removeCategory = async (id) => {
        if (!window.confirm('Are you sure you want to remove this category?')) {
            return;
        }

        if (!userPermissions.can_manage_categories) {
            setMessage({ text: 'You don\'t have permission to manage categories.', type: 'error' });
            return;
        }

        // Check if there are products in this category
        const productsWithCategory = products.filter(product => product.categoria_id === id);

        if (productsWithCategory.length > 0) {
            setMessage({ text: 'You can\'t remove a category that is assigned to a product.', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/removerCategoria?id=${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error removing the Category: ${response.statusText}`);
            }

            setMessage({ text: 'Category successfully removed.', type: 'success' });
            refreshCategories();
        } catch (error) {
            console.error('Error removing category:', error);
            setMessage({ text: 'Error removing the Category: ' + error, type: 'error' });
        }
    };

    return (
        <div className="categories-container">
            <h2 className="dashboard-section-title">Category Management</h2>

            <CategoryForm
                newCategoryName={newCategoryName}
                setNewCategoryName={setNewCategoryName}
                onSubmit={addCategory}
            />

            <div className="categories-list">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category.id} className="category">
                            <h3>{category.nome}</h3>
                            <button onClick={() => removeCategory(category.id)}>Remove</button>
                        </div>
                    ))
                ) : (
                    <p>No categories available.</p>
                )}
            </div>
        </div>
    );
};

export default Categories;