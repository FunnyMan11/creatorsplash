import React, { useState, useEffect } from 'react';

const UserForm = ({
                      user,
                      roles,
                      token,
                      setMessage,
                      refreshUsers,
                      cancelForm,
                      API_URL
                  }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [active, setActive] = useState(true);
    const [profileImage, setProfileImage] = useState(null);

    // Load user data if editing
    useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setFullName(user.full_name || '');
            setRoleId(user.role_id || '');
            setActive(user.active === 1 || user.active === true);
            // We don't load the password for security
        }
    }, [user]);

    // Validate form
    const validateForm = () => {
        if (!username || !email || (!user && !password)) {
            setMessage({ text: 'Required fields: Username, Email and Password', type: 'error' });
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage({ text: 'Invalid email format', type: 'error' });
            return false;
        }

        // Check if passwords match (only for new users or when changing password)
        if (password && password !== confirmPassword) {
            setMessage({ text: 'Passwords don\'t match', type: 'error' });
            return false;
        }

        // Validate password length (only for new users or when changing password)
        if (password && password.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
            return false;
        }

        return true;
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('full_name', fullName);
            formData.append('role_id', roleId);
            formData.append('active', active ? 1 : 0);

            if (password) {
                formData.append('password', password);
            }

            if (profileImage) {
                formData.append('profile_image', profileImage);
            }

            const url = user
                ? `${API_URL}/updateUser?id=${user.id}`
                : `${API_URL}/registerUser`;


            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    text: user ? 'User updated successfully.' : 'User created successfully.',
                    type: 'success'
                });
                resetForm();
                refreshUsers();
            } else {
                setMessage({
                    text: data.message || (user ? 'Error updating user.' : 'Error creating user.'),
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
        setUsername('');
        setEmail('');
        setFullName('');
        setPassword('');
        setConfirmPassword('');
        setRoleId('');
        setActive(true);
        setProfileImage(null);
        cancelForm();
    };

    return (
        <form className="form-add" onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Full Name:</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            <div>
                <label>Password {user ? "(leave blank to keep current)" : ""}:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!user}
                />
            </div>

            <div>
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={!user}
                />
            </div>

            <div>
                <label>Role:</label>
                <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                            {role.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Status:</label>
                <select
                    value={active ? "1" : "0"}
                    onChange={(e) => setActive(e.target.value === "1")}
                >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            </div>

            <div>
                <label>Profile Image:</label>
                <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                />
                {user && user.profile_image && (
                    <div className="current-image">
                        <p>Current image:</p>
                        <img
                            src={`${API_URL}/${user.profile_image}`}
                            alt={user.username}
                            style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }}
                        />
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="submit">
                    {user ? 'Update User' : 'Add User'}
                </button>
                <button type="button" onClick={resetForm}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UserForm;