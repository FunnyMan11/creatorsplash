import React, { useState, useEffect } from 'react';

const ProductForm = ({
                         product,
                         categories,
                         token,
                         setMessage,
                         refreshProducts,
                         cancelForm,
                         API_URL
                     }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [categoryId, setCategoryId] = useState('');

    // Load product data if editing
    useEffect(() => {
        if (product) {
            setName(product.nome);
            setDescription(product.descricao);
            setPrice(product.preco);
            setCategoryId(product.categoria_id);
        }
    }, [product]);

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome', name);
        formData.append('descricao', description);
        formData.append('preco', price);
        formData.append('categoriaId', categoryId);
        if (image) {
            formData.append('imagem', image);
        }

        try {
            const url = product
                ? `${API_URL}/atualizarProduto?id=${product.id}`
                : `${API_URL}/adicionarProduto`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (response.ok) {
                setMessage({
                    text: product ? 'Product updated successfully.' : 'Product added successfully.',
                    type: 'success'
                });
                resetForm();
                refreshProducts();
            } else {
                setMessage({
                    text: product ? 'Error updating product.' : 'Error adding product.',
                    type: 'error'
                });
            }
        } catch (error) {
            setMessage({
                text: 'API communication error: ' + error,
                type: 'error'
            });
        }
    };

    // Reset form
    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategoryId('');
        setImage(null);
        cancelForm();
    };

    return (
        <form className="form-add" onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Price:</label>
                <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>

            <div className="full-width">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    required
                />
            </div>

            <div>
                <label>Image:</label>
                <input
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                {product && product.imagem && (
                    <div className="current-image">
                        <p>Current image:</p>
                        <img
                            src={`http://localhost/api/${product.imagem}`}
                            alt={product.nome}
                            style={{ maxWidth: '100px', marginTop: '10px' }}
                        />
                    </div>
                )}
            </div>

            <div>
                <label>Category:</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-actions">
                <button type="submit">
                    {product ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={resetForm}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProductForm;