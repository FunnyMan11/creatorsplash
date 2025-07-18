import { useEffect, useState, useRef } from "react";
import '../assets/css/Shop.css';
import Tebex from "@tebexio/tebex.js";

function Shop() {
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [notification, setNotification] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [cart, setCart] = useState({});
    const [cartOpen, setCartOpen] = useState(false);
    const [cartTotal, setCartTotal] = useState(0);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // API base URL - using the path without public/ as per your Vite config
    const API_BASE_URL = '/api';

    // Fetch packages from your proxy API endpoint
    const fetchPackages = () => {
        console.log('[fetchPackages] Iniciando requisição...');
        setIsSearching(true);

        fetch(`${API_BASE_URL}/tebexPackages`)
            .then(response => {
                console.log(`[fetchPackages] Status da resposta: ${response.status}`);
                if (!response.ok) {
                    throw new Error('Network response error: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('[fetchPackages] Dados brutos recebidos da API:', data);

                if (data && data.status === 'error') {
                    console.error('[fetchPackages] Erro retornado da API:', data.message);
                    setPackages([]);
                    showNotification('Falha ao carregar pacotes: ' + data.message);
                } else {
                    const receivedPackages = data.data || data || [];

                    if (!Array.isArray(receivedPackages)) {
                        console.warn('[fetchPackages] Os dados recebidos não são um array. Verifique a estrutura do retorno da API:', receivedPackages);
                        setPackages([]);
                    } else {
                        console.log('[fetchPackages] Pacotes processados para setPackages:', receivedPackages);
                        setPackages(receivedPackages);
                    }
                }

                setLoaded(true);
                setIsSearching(false);
            })
            .catch(error => {
                console.error('[fetchPackages] Erro ao buscar pacotes:', error);
                setLoaded(true);
                setIsSearching(false);
                showNotification('Falha ao carregar pacotes. Tente novamente mais tarde.');
            });
    };


    // Fetch categories from your proxy API endpoint
    const fetchCategories = () => {
        fetch(`${API_BASE_URL}/tebexCategories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response error: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Categories received:', data);
                // Check if the response is an error
                if (data && data.status === 'error') {
                    console.error('Error from API:', data.message);
                    setCategories([]);
                } else {
                    setCategories(data.data || []);
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    };

    // Filter packages based on selected category and search term
    useEffect(() => {
        setIsSearching(true);
        const timeoutId = setTimeout(() => {
            let filtered = [...packages];

            if (selectedCategory) {
                filtered = filtered.filter(pkg =>
                    pkg.category && pkg.category.id === parseInt(selectedCategory)
                );
            }

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filtered = filtered.filter(pkg =>
                    pkg.name.toLowerCase().includes(term) ||
                    (pkg.description && pkg.description.toLowerCase().includes(term))
                );
            }

            setFilteredPackages(filtered);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [packages, selectedCategory, searchTerm]);

    // Calculate cart total whenever cart changes
    useEffect(() => {
        let total = 0;
        Object.values(cart).forEach(item => {
            total += parseFloat(item.price) * item.quantity;
        });
        setCartTotal(total.toFixed(2));

        // Save cart to localStorage
        localStorage.setItem('tebexCart', JSON.stringify(cart));
    }, [cart]);

    // Load cart from localStorage on initial load
    useEffect(() => {
        const savedCart = localStorage.getItem('tebexCart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error parsing saved cart:', e);
            }
        }
    }, []);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        if (window.innerWidth <= 992) {
            setFilterOpen(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleCart = () => {
        setCartOpen(!cartOpen);
    };

    useEffect(() => {
        fetchPackages();
        fetchCategories();

        const handleClickOutside = (event) => {
            const cartElement = document.querySelector('.shop-cart');
            const cartToggle = document.querySelector('.cart-toggle');

            if (cartElement && cartToggle &&
                !cartElement.contains(event.target) &&
                !cartToggle.contains(event.target) &&
                cartOpen) {
                setCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cartOpen]);

    const togglePackageDetails = (pkg) => {
        setSelectedPackage(pkg);
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const addToCart = (pkg) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart };

            if (updatedCart[pkg.id]) {
                updatedCart[pkg.id].quantity += 1;
                updatedCart[pkg.id].totalPrice = (parseFloat(pkg.base_price) * updatedCart[pkg.id].quantity).toFixed(2);
            } else {
                updatedCart[pkg.id] = {
                    id: pkg.id,
                    quantity: 1,
                    totalPrice: parseFloat(pkg.base_price).toFixed(2),
                    image: pkg.image || '/imagens/produto-sem-imagem.jpg',
                    name: pkg.name,
                    price: pkg.base_price,
                    currency: pkg.currency
                };
            }

            return updatedCart;
        });

        showNotification(`${pkg.name} was added to the cart.`);
    };

    const removeFromCart = (packageId) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart };
            delete updatedCart[packageId];
            return updatedCart;
        });
    };

    const updateCartItemQuantity = (packageId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(packageId);
            return;
        }

        setCart(prevCart => {
            const updatedCart = { ...prevCart };
            if (updatedCart[packageId]) {
                updatedCart[packageId].quantity = quantity;
                updatedCart[packageId].totalPrice = (parseFloat(updatedCart[packageId].price) * quantity).toFixed(2);
            }
            return updatedCart;
        });
    };

    const closePackageDetails = (e) => {
        if (e.target.classList.contains('popup')) {
            setSelectedPackage(null);
        }
    };

    const checkout = async () => {
        if (Object.keys(cart).length === 0) {
            showNotification("Your cart is empty!");
            return;
        }

        setIsCheckingOut(true);

        try {
            // Create packages array with proper format including any variable data needed
            const packages = Object.values(cart).map(item => {
                const packageItem = {
                    id: String(item.id),
                    quantity: Number(item.quantity)
                };

                // Add any package-specific variable data
                if (item.serverSelection) {
                    packageItem.server_id = item.serverSelection;
                }

                // For gift cards
                if (item.giftRecipient) {
                    packageItem.gift_to = item.giftRecipient;
                }

                // Any other custom variable data
                if (item.customData) {
                    packageItem.variable_data = item.customData;
                }

                return packageItem;
            });

            console.log("Cart items:", cart);
            console.log("Packages to send:", packages);

            // Prepare the checkout data including customer info if needed
            const checkoutData = {
                packages: packages,
                customer: {
                    email: localStorage.getItem('email') || '',
                    username: localStorage.getItem('username') || '',
                    discord_id: localStorage.getItem('discord_id') || ''
                },
                complete_url: `${window.location.origin}/thank-you`,
                cancel_url: `${window.location.origin}/cart`,
                metadata: {
                    source: 'website_shop',
                    referrer: document.referrer,
                    timestamp: new Date().toISOString()
                }
            };

            console.log("Sending checkout data:", checkoutData);

            // Make the checkout request to your API
            const response = await fetch(`${API_BASE_URL}/tebexEmbeddedCheckout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData)
            });

            const result = await response.json();
            console.log("API response:", result);

            if (result.status === 'error') {
                throw new Error(result.message || 'Checkout failed');
            }

            console.log('Checkout result:', result);

            // Check if packages were actually added
            if (result.data?.basket?.packages?.length === 0) {
                console.warn("Warning: No packages were added to the basket!");
            }

            if (result.data && result.data.ident) {
                // Initialize Tebex.js with checkout configuration
                Tebex.checkout.init({
                    ident: result.data.ident,
                    colors: [
                        {
                            name: "primary",
                            color: "#910f0f",
                        },
                        {
                            name: "secondary",
                            color: "#25c235"
                        }
                    ],
                    // Add locale if you want to set a specific language
                    locale: "en_US",
                    // Theme can be "light", "dark", "auto", or "default"
                    theme: "default"
                });

                // Launch the Tebex.js checkout
                try {
                    await Tebex.checkout.launch();
                    console.log("Tebex checkout launched successfully");

                    // Set up event listeners for checkout events
                    Tebex.checkout.on('complete', () => {
                        console.log("Checkout completed successfully");
                        // Clear cart after successful checkout
                        setCart({});
                        localStorage.removeItem('tebexCart');
                        // Redirect to thank you page if needed
                        // window.location.href = `${window.location.origin}/thank-you`;
                    });

                    Tebex.checkout.on('close', () => {
                        console.log("Checkout was closed");
                    });

                    Tebex.checkout.on('error', (error) => {
                        console.error("Checkout error:", error);
                        showNotification("Checkout error: " + (error.message || "Unknown error"));
                    });

                } catch (error) {
                    console.error("Error launching Tebex checkout:", error);
                    throw new Error("Failed to launch checkout: " + error.message);
                }
            } else if (result.url) {
                // Fallback to redirect checkout if necessary
                window.location.href = result.url;
            } else {
                throw new Error('No checkout data received');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showNotification('Checkout failed: ' + error.message);
        } finally {
            setIsCheckingOut(false);
        }
    };


    return (
        <section className="shop">
            <div className="shop-header">
                <h1 className="shop-main-title">SHOP</h1>
                <p className="shop-subtitle">Check our products!</p>
            </div>

            <div className="container">
                <div className="shop-content">
                    <section className="shop-content__shop">
                        <div className="shop-filter">
                            <ul className="shop-filter__list">
                                <li
                                    onClick={() => handleCategoryChange('')}
                                    className={selectedCategory === '' ? 'active' : ''}
                                >
                                    All
                                </li>
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={selectedCategory === category.id ? 'active' : ''}
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="shop-content__search">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search packages..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {isSearching && <span className="search-loading">Searching...</span>}
                        </div>

                        <div className="shop-content__products">
                            {loaded ? (
                                filteredPackages && filteredPackages.length > 0 ? (
                                    <ul className="product-list-shop">
                                        {filteredPackages.map(pkg => (
                                            <li key={pkg.id} className="product-item">
                                                <div className="info-icon" onClick={() => togglePackageDetails(pkg)}>i</div>
                                                <span className="product-price-shop">
                                                    {pkg.currency} {pkg.base_price}
                                                </span>
                                                <img
                                                    className="product-image-shop"
                                                    src={pkg.image || '/imagens/produto-sem-imagem.jpg'}
                                                    alt={pkg.name || 'Package'}
                                                    onError={(e) => {
                                                        e.target.src = '/imagens/produto-sem-imagem.jpg';
                                                        e.target.onerror = null;
                                                    }}
                                                />
                                                <div className="product-details">
                                                    <h3 className="product-title">{pkg.name || 'Unnamed package'}</h3>
                                                    <p
                                                        className="product-description"
                                                        dangerouslySetInnerHTML={{__html: pkg.description || 'No description available'}}
                                                    ></p>
                                                    <button className="comprar-btn" onClick={() => addToCart(pkg)}>
                                                        BUY
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="no-products">
                                        <p>
                                            {searchTerm
                                                ? `No packages found for "${searchTerm}"`
                                                : "No packages found for this category."
                                            }
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading packages...</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Cart Toggle Button */}
            <button className="cart-toggle" onClick={toggleCart}>
                Cart ({Object.values(cart).reduce((total, item) => total + item.quantity, 0)})
            </button>

            {/* Right-side Cart */}
            <div className={`shop-cart ${cartOpen ? 'active' : ''}`}>
                <div className="shop-cart__header">
                    <h2>Your Cart</h2>
                    <button className="close-cart" onClick={toggleCart}>×</button>
                </div>

                <div className="shop-cart__items">
                    {Object.keys(cart).length > 0 ? (
                        Object.values(cart).map(item => (
                            <div key={item.id} className="cart-item">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.src = '/imagens/produto-sem-imagem.jpg';
                                        e.target.onerror = null;
                                    }}
                                />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>{item.currency} {item.totalPrice}</p>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                        >-</button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                        >+</button>
                                    </div>
                                    <button
                                        className="remove-item"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-cart-message">Your cart is empty</p>
                    )}
                </div>

                <div className="shop-cart__footer">
                    <div className="cart-total">
                        <span>Total:</span>
                        <span>
                            {Object.values(cart)[0]?.currency || '$'} {cartTotal}
                        </span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={checkout}
                        disabled={Object.keys(cart).length === 0 || isCheckingOut}
                    >
                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                    </button>
                </div>
            </div>

            {selectedPackage && (
                <div className="popup" onClick={closePackageDetails}>
                    <div className="popup-content">
                        <button className="close-btn" onClick={() => setSelectedPackage(null)}>×</button>
                        <div className="popup-product">
                            <img
                                className="popup-product__image"
                                src={selectedPackage.image || '/imagens/produto-sem-imagem.jpg'}
                                alt={selectedPackage.name || 'Package'}
                                onError={e => {
                                    e.target.src = '/imagens/produto-sem-imagem.jpg';
                                    e.target.onerror = null;
                                }}
                            />
                            <div className="popup-product__details">
                                <h1 className="popup-product__title">{selectedPackage.name}</h1>
                                <p
                                    className="popup-product__description"
                                    dangerouslySetInnerHTML={{ __html: selectedPackage.description }}
                                />
                                <span className="popup-product__price">
            {selectedPackage.currency} {selectedPackage.base_price}
          </span>
                                <button
                                    className="popup-product__add-btn"
                                    onClick={() => {
                                        addToCart(selectedPackage);
                                        setSelectedPackage(null);
                                    }}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className="notification">
                    <p>{notification}</p>
                </div>
            )}
        </section>
    );
}

export default Shop;