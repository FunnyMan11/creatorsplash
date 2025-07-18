import React, { useState } from 'react';
import RoleForm from './RoleForm';

const Roles = ({
                   roles,
                   userPermissions,
                   token,
                   setMessage,
                   refreshRoles,
                   API_URL
               }) => {
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleColor, setNewRoleColor] = useState('#000000');

    // Add role
    const addRole = async (e) => {
        e.preventDefault();

        if (!userPermissions.can_manage_roles) {
            setMessage({ text: 'You don\'t have permission to add roles', type: 'error' });
            return;
        }

        // Default permissions for new role
        const defaultPermissions = {
            can_manage_users: false,
            can_manage_products: true,
            can_manage_categories: true,
            can_manage_roles: false,
            can_view_statistics: true
        };

        try {
            const response = await fetch(`${API_URL}/adicionarCargo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome: newRoleName,
                    cor: newRoleColor,
                    ...defaultPermissions
                }),
            });

            const textResponse = await response.text();
            console.log('Raw response:', textResponse);

            const data = JSON.parse(textResponse);
            if (response.ok) {
                setMessage({ text: 'Role added successfully!', type: 'success' });
                refreshRoles();
                setNewRoleName('');
                setNewRoleColor('#000000');
            } else {
                setMessage({ text: data.error || 'Error adding role.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error adding role: ' + error, type: 'error' });
        }
    };

    // Remove role
    const removeRole = async (id) => {
        if (!userPermissions.can_manage_roles) {
            setMessage({ text: 'You don\'t have permission to remove roles', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/deletarCargo?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setMessage({ text: 'Role removed successfully!', type: 'success' });
                refreshRoles();
            } else {
                const data = await response.json();
                setMessage({ text: data.erro || 'Error removing role.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error removing role.', type: 'error' });
        }
    };

    // Change role color
    const changeRoleColor = async (id, newColor) => {
        if (!userPermissions.can_manage_roles) {
            setMessage({ text: 'You don\'t have permission to modify roles', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/atualizarCargo?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cor: newColor }),
            });

            const textResponse = await response.text();
            console.log('Raw response:', textResponse);

            const data = JSON.parse(textResponse);

            if (response.ok) {
                setMessage({ text: 'Role color changed successfully!', type: 'success' });
                refreshRoles();
            } else {
                setMessage({ text: data.message || 'Error changing role color.', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error changing role color: ' + error.message, type: 'error' });
        }
    };

    return (
        <div className="roles-container">
            <h2 className="dashboard-section-title">Role Management</h2>

            <RoleForm
                newRoleName={newRoleName}
                setNewRoleName={setNewRoleName}
                newRoleColor={newRoleColor}
                setNewRoleColor={setNewRoleColor}
                onSubmit={addRole}
            />

            <div className="roles-list">
                {roles.length > 0 ? (
                    roles.map((role) => (
                        <div key={role.id} className="role">
                            <h3 style={{ color: role.cor }}>{role.nome}</h3>
                            <div>
                                <label htmlFor={`colorPicker-${role.id}`}>Change color:</label>
                                <input
                                    type="color"
                                    id={`colorPicker-${role.id}`}
                                    value={role.cor}
                                    onChange={(e) => changeRoleColor(role.id, e.target.value)}
                                />
                                <p>Current color: <span style={{ color: role.cor }}>{role.cor}</span></p>
                            </div>
                            <button onClick={() => removeRole(role.id)}>Remove</button>
                        </div>
                    ))
                ) : (
                    <p>No roles available.</p>
                )}
            </div>
        </div>
    );
};

export default Roles;