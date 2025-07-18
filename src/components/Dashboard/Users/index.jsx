import React, { useState } from 'react';
import UserForm from './UserForm';


import PropTypes from 'prop-types';


const Users = ({
                   users,
                   roles,
                   userPermissions,
                   token,
                   setMessage,
                   refreshUsers,
                   isLoading,
                   API_URL
               }) => {
    const [formVisible, setFormVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Start user editing
    const startEditUser = (user) => {
        setEditingUser(user);
        setFormVisible(true);
    };

    // Cancel editing/adding
    const cancelForm = () => {
        setEditingUser(null);
        setFormVisible(false);
    };

    // Remove user
    const removeUser = async (id) => {
        if (!window.confirm('Are you sure you want to remove this user?')) {
            return;
        }

        if (!userPermissions.can_manage_users) {
            setMessage({ text: 'You don\'t have permission to remove users', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/deleteUser&id=${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: 'User successfully removed!', type: 'success' });
                refreshUsers();
            } else {
                setMessage({ text: data.message || 'Error removing user', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error removing user: ' + error, type: 'error' });
        }
    };

    // View user details
    const viewUserDetails = (userId) => {
        // This function could open a modal with details or redirect
        // to a user details page
        alert(`Function to view details of user ${userId} will be implemented soon.`);
    };

    console.log("Permissions:", userPermissions);

    return (
        <div className="dashboard-users">
            <div className="dashboard-header-actions">
                <h2 className="dashboard-section-title">User Management</h2>
                {!formVisible && userPermissions.can_manage_users && (
                    <button className="dashboard-card-button" onClick={() => setFormVisible(true)}>
                        <i className="fas fa-plus"></i> Add New User
                    </button>
                )}
            </div>

            {formVisible && (
                <UserForm
                    user={editingUser}
                    roles={roles}
                    token={token}
                    setMessage={setMessage}
                    refreshUsers={refreshUsers}
                    cancelForm={cancelForm}
                    API_URL={API_URL}
                />
            )}

            {isLoading ? (
                <p>Loading users...</p>
            ) : (
                <div className="dashboard-table-container">
                    <table className="dashboard-table user-table">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.full_name || '-'}</td>
                                    <td>
                                        <span
                                            className="user-role"
                                            style={{backgroundColor: user.role_color || '#0F4C5C'}}
                                        >
                                            {user.role_name || 'User'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-indicator ${user.active ? 'status-active' : 'status-inactive'}`}></span>
                                        {user.active ? 'Active' : 'Inactive'}
                                    </td>
                                    <td>{user.last_login || 'Never'}</td>
                                    <td className="action-buttons">
                                        <button
                                            className="view-button"
                                            onClick={() => viewUserDetails(user.id)}
                                            title="View Details"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        {userPermissions.can_manage_users && (
                                            <>
                                                <button
                                                    className="edit-button"
                                                    onClick={() => startEditUser(user)}
                                                    title="Edit User"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => removeUser(user.id)}
                                                    title="Remove User"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No users found or you don't have permission to view users.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// After the Users component
Users.propTypes = {
    users: PropTypes.array.isRequired,
    roles: PropTypes.array.isRequired,
    userPermissions: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    API_URL: PropTypes.string.isRequired
};

export default Users;