import React from 'react';

const DashboardTabs = ({ activeTab, setActiveTab, userPermissions }) => {
    console.log('userPermissions received in DashboardTabs:', userPermissions);
    console.log('can_manage_news value:', userPermissions.can_manage_news);
    return (
        <div className="dashboard-tabs">
            <button
                className={`dashboard-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
            >
                <i className="fas fa-home"></i> Overview
            </button>
            {userPermissions.can_manage_users && (
                <button
                    className={`dashboard-tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    <i className="fas fa-users"></i> Users
                </button>
            )}
            {userPermissions.can_manage_products && (
                <button
                    className={`dashboard-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    <i className="fas fa-shopping-cart"></i> Products
                </button>
            )}
            {userPermissions.can_manage_categories && (
                <button
                    className={`dashboard-tab ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    <i className="fas fa-tags"></i> Categories
                </button>
            )}
            {userPermissions.can_manage_roles && (
                <button
                    className={`dashboard-tab ${activeTab === 'roles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roles')}
                >
                    <i className="fas fa-user-tag"></i> Roles
                </button>
            )}
            {userPermissions.can_manage_news && (
                <button
                    className={`dashboard-tab ${activeTab === 'news' ? 'active' : ''}`}
                    onClick={() => setActiveTab('news')}
                >
                    <i className="fas fa-newspaper"></i> News
                </button>
            )}
        </div>
    );
};

export default DashboardTabs;