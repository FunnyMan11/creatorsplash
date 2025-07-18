import React from 'react';

const CategoryForm = ({ newCategoryName, setNewCategoryName, onSubmit }) => {
    return (
        <form className="form-add-category" onSubmit={onSubmit}>
            <label>Name of the new category:</label>
            <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
            />
            <button type="submit">Add Category</button>
        </form>
    );
};

export default CategoryForm;