import { useState, useEffect } from 'react';
// import '../../../../noqyzz/noqzwebsite/src/assets/css/UserManagement.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Estado para formulário de criação/edição
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Campos do formulário
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [roleId, setRoleId] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Estado para logs de atividade
    const [showLogs, setShowLogs] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [selectedUserLogs, setSelectedUserLogs] = useState(null);

    const API_URL = '/api';

    // Carregar usuários e papéis ao iniciar
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchUsers(),
                    fetchRoles()
                ]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setMessage({ text: 'Failed to load data. Please try again.', type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Buscar lista de usuários
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ text: 'Authentication required. Please login again.', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/listUsers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setUsers(data.data);
            } else {
                setMessage({ text: data.message || 'Failed to load users', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage({ text: 'Error connecting to the server', type: 'error' });
        }
    };

    // Buscar lista de papéis
    const fetchRoles = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/listarCargos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setRoles(data.data);
            } else {
                console.error('Failed to load roles:', data.message);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // Buscar logs de atividade
    const fetchActivityLogs = async (userId = null) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            let url = `${API_URL}/userActivityLogs`;
            if (userId) {
                url += `&user_id=${userId}`;
                // Encontrar o nome do usuário para exibição
                const user = users.find(u => u.id === userId);
                if (user) {
                    setSelectedUserLogs(user.username);
                }
            } else {
                setSelectedUserLogs(null);
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setActivityLogs(data.data);
                setShowLogs(true);
            } else {
                setMessage({ text: data.message || 'Failed to load activity logs', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            setMessage({ text: 'Error connecting to the server', type: 'error' });
        }
    };

    // Adicionar novo usuário
    const addUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return;

        // Validar formulário
        if (!username || !password || !email || !roleId) {
            setMessage({ text: 'Please fill all required fields', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/registerUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    full_name: fullName,
                    role_id: roleId,
                    active: isActive
                })
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'User created successfully!', type: 'success' });
                resetForm();
                fetchUsers();
            } else {
                setMessage({ text: data.message || 'Error creating user', type: 'error' });
            }
        } catch (error) {
            console.error('Error creating user:', error);
            setMessage({ text: 'Error connecting to the server', type: 'error' });
        }
    };

    // Obter detalhes de um usuário para edição
    const editUser = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/getUser&id=${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                // Preencher o formulário com os dados do usuário
                setCurrentUser(data.data);
                setUsername(data.data.username);
                setEmail(data.data.email);
                setFullName(data.data.full_name || '');
                setRoleId(data.data.role_id || '');
                setIsActive(data.data.active === '1' || data.data.active === true);
                setPassword(''); // Limpar campo de senha

                // Mostrar formulário no modo de edição
                setIsEditing(true);
                setIsFormVisible(true);
            } else {
                setMessage({ text: data.message || 'Failed to get user details', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setMessage({ text: 'Error connecting to the server', type: 'error' });
        }
    };

    // Atualizar usuário existente
    const updateUser = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token || !currentUser) return;

        // Validar formulário
        if (!username || !email || !roleId) {
            setMessage({ text: 'Please fill all required fields', type: 'error' });
            return;
        }

        try {
            const userData = {
                username,
                email,
                full_name: fullName,
                role_id: roleId,
                active: isActive
            };

            // Incluir senha apenas se foi preenchida
            if (password.trim() !== '') {
                userData.password = password;
            }

            const response = await fetch(`${API_URL}/updateUser&id=${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'User updated successfully!', type: 'success' });
                resetForm();
                fetchUsers();
            } else {
                setMessage({ text: data.message || 'Error updating user', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            setMessage({ text: 'Error connecting to the server', type: 'error' });
        }
    };

    // Excluir usuário
    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/deleteUser&id=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'User deleted successfully!', type: 'success' });
                fetchUsers();
            } else {
                setMessage({ text: data.message || 'Error deleting user', type: 'error' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage({ text: 'Error connecting to the server', type: 'error' });
        }
    };

    // Resetar formulário
    const resetForm = () => {
        setUsername('');
        setPassword('');
        setEmail('');
        setFullName('');
        setRoleId('');
        setIsActive(true);
        setCurrentUser(null);
        setIsEditing(false);
        setIsFormVisible(false);
    };

    // Formatar data para exibição
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Obter nome do papel com base no ID
    const getRoleName = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        return role ? role.nome : 'Unknown';
    };

    // Renderizar lista de usuários
    const renderUserList = () => {
        if (loading) {
            return <div className="loading">Loading users...</div>;
        }

        if (users.length === 0) {
            return <p className="no-users">No users found.</p>;
        }

        return (
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Full Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Last Login</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} className={user.active === '1' || user.active === true ? '' : 'inactive-user'}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.full_name || '-'}</td>
                            <td>
                                    <span
                                        className="role-badge"
                                        style={{ backgroundColor: user.role_color || '#777' }}
                                    >
                                        {user.role_name || 'Unknown'}
                                    </span>
                            </td>
                            <td>
                                    <span className={`status-badge ${user.active === '1' || user.active === true ? 'active' : 'inactive'}`}>
                                        {user.active === '1' || user.active === true ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td>{formatDate(user.created_at)}</td>
                            <td>{formatDate(user.last_login)}</td>
                            <td className="actions-cell">
                                <button
                                    className="btn-icon btn-edit"
                                    onClick={() => editUser(user.id)}
                                    title="Edit user"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    className="btn-icon btn-delete"
                                    onClick={() => deleteUser(user.id)}
                                    title="Delete user"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                                <button
                                    className="btn-icon btn-logs"
                                    onClick={() => fetchActivityLogs(user.id)}
                                    title="View activity logs"
                                >
                                    <i className="fas fa-history"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    };

    // Renderizar formulário de usuário
    const renderUserForm = () => {
        return (
            <div className="user-form-container">
                <h3>{isEditing ? 'Edit User' : 'Add New User'}</h3>
                <form className="user-form" onSubmit={isEditing ? updateUser : addUser}>
                    <div className="form-group">
                        <label htmlFor="username">Username*</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">{isEditing ? 'Password (leave blank to keep current)' : 'Password*'}</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role*</label>
                        <select
                            id="role"
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                        >
                            <option value="">Select a role</option>
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>{role.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <label htmlFor="isActive">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            Active
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit">
                            {isEditing ? 'Update User' : 'Add User'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    // Renderizar logs de atividade
    const renderActivityLogs = () => {
        if (!showLogs) return null;

        return (
            <div className="activity-logs-container">
                <div className="activity-logs-header">
                    <h3>
                        Activity Logs
                        {selectedUserLogs ? ` for ${selectedUserLogs}` : ''}
                    </h3>
                    <button className="btn-close-logs" onClick={() => setShowLogs(false)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {activityLogs.length === 0 ? (
                    <p className="no-logs">No activity logs found.</p>
                ) : (
                    <table className="logs-table">
                        <thead>
                        <tr>
                            <th>Date/Time</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>IP Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {activityLogs.map(log => (
                            <tr key={log.id}>
                                <td>{formatDate(log.created_at)}</td>
                                <td>{log.username}</td>
                                <td>
                                        <span className={`action-badge ${log.action_type}`}>
                                            {log.action_type.replace(/_/g, ' ')}
                                        </span>
                                </td>
                                <td>{log.action_details}</td>
                                <td>{log.ip_address}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    };

    return (
        <div className="user-management-container">
            <h2 className="section-title">User Management</h2>

            {/* Botões de ações principais */}
            <div className="actions-toolbar">
                <button
                    className="btn-add-user"
                    onClick={() => {
                        resetForm();
                        setIsFormVisible(true);
                    }}
                    disabled={isFormVisible}
                >
                    <i className="fas fa-user-plus"></i> Add New User
                </button>

                <button
                    className="btn-view-logs"
                    onClick={() => fetchActivityLogs()}
                    disabled={showLogs}
                >
                    <i className="fas fa-history"></i> View All Activity
                </button>

                <button
                    className="btn-refresh"
                    onClick={() => {
                        fetchUsers();
                        fetchRoles();
                    }}
                    disabled={loading}
                >
                    <i className="fas fa-sync-alt"></i> Refresh
                </button>
            </div>

            {/* Mensagem de notificação */}
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}

            {/* Formulário ou Lista */}
            <div className="content-container">
                {isFormVisible ? renderUserForm() : renderUserList()}
            </div>

            {/* Logs de atividade */}
            {renderActivityLogs()}
        </div>
    );
}

export default UserManagement;