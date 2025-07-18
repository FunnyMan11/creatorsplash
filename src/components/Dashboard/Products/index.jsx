import { useState } from 'react';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const Products = ({
                      products,
                      categories,
                      userPermissions,
                      token,
                      setMessage,
                      refreshProducts,
                      API_URL
                  }) => {
    const [formVisible, setFormVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Start product editing
    const startEditProduct = (product) => {
        setEditingProduct(product);
        setFormVisible(true);
    };

    // Cancel editing/adding
    const cancelForm = () => {
        setEditingProduct(null);
        setFormVisible(false);
    };

    // Remove product
    const removeProduct = async (id) => {
        if (!window.confirm('Are you sure you want to remove this product?')) {
            return;
        }

        if (!userPermissions.can_manage_products) {
            setMessage({ text: 'You don\'t have permission to remove products', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/remover?id=${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error removing product: ${response.statusText}`);
            }

            setMessage({ text: 'Product removed successfully!', type: 'success' });
            refreshProducts();
        } catch (error) {
            setMessage({ text: 'Error removing product: ' + error, type: 'error' });
        }
    };

    return (
        <div className="products-container">
            <h2 className="dashboard-section-title">Product Management</h2>

            {!formVisible && userPermissions.can_manage_products && (
                <div className="btn-add-container">
                    <button className="btn-add" onClick={() => setFormVisible(true)}>
                        Add New Product
                    </button>
                </div>
            )}

            {formVisible && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    token={token}
                    setMessage={setMessage}
                    refreshProducts={refreshProducts}
                    cancelForm={cancelForm}
                    API_URL={API_URL}
                />
            )}

            <ProductList
                products={products}
                onEdit={startEditProduct}
                onRemove={removeProduct}
            />
        </div>
    );
};

export default Products;