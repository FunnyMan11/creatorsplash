import React from 'react';

const Overview = ({ users, products, roles, games, setActiveTab }) => {
    return (
        <div className="dashboard-overview">
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{products.length}</div>
                    <div className="stat-label">Products</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{roles.length}</div>
                    <div className="stat-label">Roles</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{games.length}</div>
                    <div className="stat-label">Games</div>
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <h3 className="dashboard-card-title">User Management</h3>
                    <p className="dashboard-card-description">
                        View, add, edit, and manage user accounts and permissions
                    </p>
                    <button className="dashboard-card-button" onClick={() => setActiveTab('users')}>
                        Manage Users
                    </button>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <h3 className="dashboard-card-title">Products</h3>
                    <p className="dashboard-card-description">
                        Manage store products, categories, and inventory
                    </p>
                    <button className="dashboard-card-button" onClick={() => setActiveTab('products')}>
                        Manage Products
                    </button>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <i className="fas fa-user-tag"></i>
                    </div>
                    <h3 className="dashboard-card-title">Roles</h3>
                    <p className="dashboard-card-description">
                        Manage user roles and permissions
                    </p>
                    <button className="dashboard-card-button" onClick={() => setActiveTab('roles')}>
                        Manage Roles
                    </button>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <i className="fas fa-gamepad"></i>
                    </div>
                    <h3 className="dashboard-card-title">Games</h3>
                    <p className="dashboard-card-description">
                        Manage games and their participants
                    </p>
                    <button className="dashboard-card-button" onClick={() => setActiveTab('games')}>
                        Manage Games
                    </button>
                </div>

                <div className="dashboard-card">
                    <div className="dashboard-card-icon">
                        <i className="fas fa-users-cog"></i>
                    </div>
                    <h3 className="dashboard-card-title">Participants</h3>
                    <p className="dashboard-card-description">
                        Manage game participants and their order
                    </p>
                    <button className="dashboard-card-button" onClick={() => setActiveTab('participants')}>
                        Manage Participants
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Overview;