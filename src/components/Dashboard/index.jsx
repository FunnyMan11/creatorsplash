// components/Dashboard/index.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import DashboardHeader from './DashboardHeader';
import UserProfile from './UserProfile';
import DashboardTabs from './DashboardTabs';
import MessageAlert from './MessageAlert';
import Overview from './Overview';
import Users from './Users';
import Products from './Products';
import Categories from './Categories';
import Roles from './Roles';
import Games from './Games';
import Participants from './Participants';
import News from './News';
import '../../assets/css/Dashboard.css';
import '../../assets/css/Games.css';
import '../../assets/css/Participants.css';

// API URL
const API_URL = '/api';

function Dashboard({ onViewChange }) {
    // Main state
    const [activeTab, setActiveTab] = useState('overview');
    const [loggedIn, setLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // State for users
    const [users, setUsers] = useState([]);

    // State for products and categories
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // State for roles
    const [roles, setRoles] = useState([]);

    // State for games
    const [games, setGames] = useState([]);

    // State for permissions
    const [userPermissions, setUserPermissions] = useState({
        can_manage_users: false,
        can_manage_products: false,
        can_manage_categories: false,
        can_manage_roles: false,
        can_view_statistics: false,
        can_manage_games: false,
        can_manage_participants: false,
        can_manage_nes: false
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Verify token and load user permissions
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp < Date.now() / 1000) {
                    // Token expired
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                    navigate('/admin-login');
                    return;
                }

                // Basic user data - UUID is in the 'sub' field of the token
                console.log("Decoded token:", decodedToken);

                // UUID is in the 'sub' field of the token (instead of username)
                const uuid = decodedToken.sub;

                setUserData({
                    username: "Loading...", // Will be updated when we load real data
                    full_name: "Loading...",
                    role_name: "Loading...",
                    profile_image: null
                });

                // Valid token, get permissions using UUID
                getUserPermissions(token, uuid);
                setLoggedIn(true);

                // Load initial data
                initializeData(token);
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('token');
                setLoggedIn(false);
                navigate('/admin-login');
            }
        } else {
            setLoggedIn(false);
            navigate('/admin-login');
        }
    }, [navigate]);

    // Function to get user permissions
    const getUserPermissions = async (token, userIdentifier) => {
        try {
            // List all roles to get current role information
            const response = await fetch(`${API_URL}/listarCargos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Check if response is ok
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Failed API response (${response.status}):`, errorText);
                throw new Error(`Failed to fetch roles: ${response.status} ${response.statusText}`);
            }

            // Check response content before trying to parse as JSON
            const responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                console.error("Response:", responseText.substring(0, 500));
                throw new Error(`Invalid JSON response: ${parseError.message}`);
            }

            if (data.status === 'success') {
                // Get user role using the same careful approach
                try {
                    const usersResponse = await fetch(`${API_URL}/listUsers`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!usersResponse.ok) {
                        const errorText = await usersResponse.text();
                        console.error(`Failed users API response (${usersResponse.status}):`, errorText);
                        throw new Error(`Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}`);
                    }

                    const usersResponseText = await usersResponse.text();

                    const usersData = JSON.parse(usersResponseText);



                    if (usersData.status === 'success') {
                        // Store users list for management
                        setUsers(usersData.data || []);

                        console.log("Users list:", usersData.data);
                        console.log("Searching for user with identifier:", userIdentifier);

                        // Find current user by UUID or username
                        // First try by UUID (which is in the sub field of the token)
                        let currentUser = usersData.data.find(user => user.uuid === userIdentifier);

                        // If not found by UUID, try by username
                        if (!currentUser) {
                            currentUser = usersData.data.find(user => user.username === userIdentifier);
                        }

                        if (currentUser) {
                            // Update user data with real data
                            setUserData({
                                username: currentUser.username,
                                full_name: currentUser.full_name || currentUser.username,
                                role_name: currentUser.role_name || 'User',
                                profile_image: currentUser.profile_image
                            });

                            // Find user role
                            const userRole = data.data.find(role => role.id === currentUser.role_id);
                            if (userRole) {
                                // Convert string "1" or number 1 to boolean true
                                setUserPermissions({
                                    can_manage_users: userRole.can_manage_users === "1" || userRole.can_manage_users === 1,
                                    can_manage_products: userRole.can_manage_products === "1" || userRole.can_manage_products === 1,
                                    can_manage_categories: userRole.can_manage_categories === "1" || userRole.can_manage_categories === 1,
                                    can_manage_roles: userRole.can_manage_roles === "1" || userRole.can_manage_roles === 1,
                                    can_view_statistics: userRole.can_view_statistics === "1" || userRole.can_view_statistics === 1,
                                    can_manage_games: userRole.can_manage_games === "1" || userRole.can_manage_games === 1,
                                    can_manage_participants: userRole.can_manage_participants === "1" || userRole.can_manage_participants === 1,
                                    can_manage_news: userRole.can_manage_news === "1" || userRole.can_manage_news === 1  // Add this line
                                });
                                console.log("Permissions set based on role:", userRole.nome);

                                console.log("API Response for roles:", data.data);
                                console.log("Current user role:", userRole);
                                console.log("Permissions being set:", {
                                    can_manage_users: userRole.can_manage_users === "1" || userRole.can_manage_users === 1,
                                    can_manage_products: userRole.can_manage_products === "1" || userRole.can_manage_products === 1,
                                    can_manage_categories: userRole.can_manage_categories === "1" || userRole.can_manage_categories === 1,
                                    can_manage_roles: userRole.can_manage_roles === "1" || userRole.can_manage_roles === 1,
                                    can_view_statistics: userRole.can_view_statistics === "1" || userRole.can_view_statistics === 1,
                                    can_manage_news: userRole.can_manage_news === "1" || userRole.can_manage_news === 1
                                });
                            } else {
                                console.warn(`User's role ID ${currentUser.role_id} not found in roles`, data.data);
                                // Default permissions if role not found
                                setUserPermissions({
                                    can_view_statistics: true
                                });
                            }
                        } else {
                            console.warn(`User ${userIdentifier} not found in users list`, usersData.data);
                            // Check identifier format
                            if (typeof userIdentifier === 'string' && userIdentifier.includes('-')) {
                                console.log("Identifier looks like a UUID, but wasn't found in database");
                            } else {
                                console.log("Identifier doesn't look like a valid UUID");
                            }

                            // Set alternative data
                            setUserData({
                                username: userIdentifier,
                                full_name: userIdentifier,
                                role_name: 'User',
                                profile_image: null
                            });
                            // Default permissions
                            setUserPermissions({
                                can_view_statistics: true
                            });
                        }
                    } else {
                        console.error("Users API returned error status:", usersData);
                        setMessage({ text: usersData.message || 'Failed to load user data', type: 'error' });
                    }
                } catch (userError) {
                    console.error('Error processing user data:', userError);
                    setMessage({ text: `Error loading user data: ${userError.message}`, type: 'error' });
                }
            } else {
                console.error("Roles API returned error status:", data);
                setMessage({ text: data.message || 'Failed to load roles data', type: 'error' });
            }
        } catch (error) {
            console.error('Error getting user permissions:', error);
            setMessage({ text: `Error getting user permissions: ${error.message}`, type: 'error' });

            // Set default permissions for fallback
            setUserPermissions({
                can_view_statistics: true
            });
        }
    };

    // Function to initialize data
    const initializeData = async (token) => {
        try {
            setIsLoading(true);

            // Parallel loading to optimize
            const [
                productsResponse,
                categoriesResponse,
                rolesResponse,
                gamesResponse  // Add this to fetch games
            ] = await Promise.all([
                fetch(`${API_URL}/listar`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/listarCategorias`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/listarCargos`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/listarGames`, {  // Add this to fetch games
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            // Process responses
            if (productsResponse.ok) {
                const productsData = await productsResponse.json();
                setProducts(productsData.data || []);
            }

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData || []);
            }

            if (rolesResponse.ok) {
                const rolesData = await rolesResponse.json();
                setRoles(rolesData.data || []);
            }

            // Add this to process games response
            if (gamesResponse.ok) {
                const gamesData = await gamesResponse.json();
                setGames(gamesData.data || []);
            }
        } catch (error) {
            console.error('Error loading initial data:', error);
            setMessage({ text: 'Error loading data. Please try again later.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Functions for products
    const listProducts = async (token) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/listar`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Products received:', data);
            setProducts(data.data || []);
        } catch (error) {
            console.error('Error listing products:', error);
            setMessage({ text: 'An error occurred while loading products. Please try again later.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Functions for categories
    const listCategories = async (token) => {
        try {
            const response = await fetch(`${API_URL}/listarCategorias`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching categories: ${response.statusText}`);
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error listing categories:', error);
            setMessage({ text: 'An error occurred while loading categories. Please try again later.', type: 'error' });
        }
    };

    // Functions for roles
    const listRoles = async (token) => {
        try {
            const response = await fetch(`${API_URL}/listarCargos`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const textResponse = await response.text();
            console.log('Raw response:', textResponse);

            const data = JSON.parse(textResponse);
            if (data.status === 'success') {
                setRoles(data.data);
            } else {
                setMessage({ text: 'Error loading roles: ' + (data.message || 'Unknown'), type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Error loading roles: ' + error, type: 'error' });
        }
    };

    // Function to list games
    const listGames = async (token) => {
        try {
            const response = await fetch(`${API_URL}/listarGames`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching games: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setGames(data.data || []);
            } else {
                setMessage({ text: 'Error loading games: ' + (data.message || 'Unknown'), type: 'error' });
            }
        } catch (error) {
            console.error('Error listing games:', error);
            setMessage({ text: 'Error loading games: ' + error, type: 'error' });
        }
    };

    // Go to user management section
    const goToUserManagement = () => {
        if (typeof onViewChange === 'function') {
            onViewChange('users');
        } else {
            setActiveTab('users');
        }
    };

    // Render content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <Overview
                        users={users}
                        products={products}
                        roles={roles}
                        games={games}          // Add games prop
                        setActiveTab={setActiveTab}
                    />
                );
            case 'news':
                return (
                    <News
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        API_URL={API_URL}
                    />
                );
            case 'users':
                return (
                    <Users
                        users={users}
                        roles={roles}
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        refreshUsers={() => {
                            const token = localStorage.getItem('token');
                            if (token) {
                                fetch(`${API_URL}/listUsers`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        if (data.status === 'success') {
                                            setUsers(data.data || []);
                                        } else {
                                            setMessage({ text: data.message || 'Error loading users', type: 'error' });
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error fetching users:', error);
                                        setMessage({ text: 'Error loading users', type: 'error' });
                                    });
                            }
                        }}
                        isLoading={isLoading}
                        API_URL={API_URL}
                    />
                );
            case 'products':
                return (
                    <Products
                        products={products}
                        categories={categories}
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        refreshProducts={() => listProducts(localStorage.getItem('token'))}
                        API_URL={API_URL}
                    />
                );
            case 'categories':
                return (
                    <Categories
                        categories={categories}
                        products={products}
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        refreshCategories={() => listCategories(localStorage.getItem('token'))}
                        API_URL={API_URL}
                    />
                );
            case 'roles':
                return (
                    <Roles
                        roles={roles}
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        refreshRoles={() => listRoles(localStorage.getItem('token'))}
                        API_URL={API_URL}
                    />
                );
            case 'games':
                return (
                    <Games
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        API_URL={API_URL}
                    />
                );
            case 'participants':
                return (
                    <Participants
                        games={games}
                        userPermissions={userPermissions}
                        token={localStorage.getItem('token')}
                        setMessage={setMessage}
                        API_URL={API_URL}
                    />
                );
            default:
                return (
                    <Overview
                        users={users}
                        products={products}
                        roles={roles}
                        games={games}          // Add games prop here too
                        setActiveTab={setActiveTab}
                    />
                );
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <div className="loading">
                    <span>Loading dashboard data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <DashboardHeader />

            {userData && <UserProfile userData={userData} API_URL={API_URL} />}


            <DashboardTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userPermissions={userPermissions}
            />

            {message.text && (
                <MessageAlert message={message.text} type={message.type} />
            )}

            {renderTabContent()}
        </div>
    );
}

export default Dashboard;