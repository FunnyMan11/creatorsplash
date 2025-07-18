import React from 'react';

const RoleForm = ({
                      newRoleName,
                      setNewRoleName,
                      newRoleColor,
                      setNewRoleColor,
                      onSubmit
                  }) => {
    return (
        <form className="form-add-role" onSubmit={onSubmit}>
            <div>
                <label>New Role Name:</label>
                <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="colorPicker">Choose a color for the role:</label>
                <input
                    type="color"
                    id="colorPicker"
                    value={newRoleColor}
                    onChange={(e) => setNewRoleColor(e.target.value)}
                    required
                />
                <p>Selected color: <span style={{ color: newRoleColor }}>{newRoleColor}</span></p>
            </div>
            <button type="submit">Add Role</button>
        </form>
    );
};

export default RoleForm;