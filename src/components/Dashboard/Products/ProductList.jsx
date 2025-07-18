import React from 'react';

const ProductList = ({ products, onEdit, onRemove }) => {
    if (products.length === 0) {
        return <p>No products available.</p>;
    }

    return (
        <div className="products-list">
            {products.map((product) => (
                <div key={product.id} className="product">
                    <img
                        src={`/api/${product.imagem}`}
                        alt={product.nome}
                        className="product-image"
                    />
                    <h3>{product.nome}</h3>
                    <p>{product.descricao}</p>
                    <p className="price">R$ {product.preco}</p>
                    <div className="product-actions">
                        <button onClick={() => onEdit(product)}>Edit</button>
                        <button onClick={() => onRemove(product.id)}>Remove</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;