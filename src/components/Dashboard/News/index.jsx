import React, { useState, useEffect } from 'react';
import NewsForm from './NewsForm';
import NewsList from './NewsList';
import './News.css'; // Make sure this CSS is imported

const News = ({
                  userPermissions,
                  token,
                  setMessage,
                  API_URL
              }) => {
    // States
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [formVisible, setFormVisible] = useState(false);
    const [editingNews, setEditingNews] = useState(null);

    // Load news when component mounts and when page changes
    useEffect(() => {
        if (token) {
            fetchNews();
        }
    }, [token, currentPage]);

    // Fetch news from API
    const fetchNews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/listarNews?page=${currentPage}&per_page=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                setNews(data.data || []);
                setTotalPages(data.pagination?.total_pages || 1);
            } else {
                console.error('Error fetching news:', data.message);
                setMessage({ text: data.message || 'Error loading news', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setMessage({ text: 'Error loading news: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Start editing a news item
    const startEditNews = (newsItem) => {
        setEditingNews(newsItem);
        setFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Cancel editing/adding form
    const cancelForm = () => {
        setEditingNews(null);
        setFormVisible(false);
    };

    // Remove a news item
    const removeNews = async (id) => {
        if (!window.confirm('Are you sure you want to remove this article?')) {
            return;
        }

        if (!userPermissions.can_manage_news) {
            setMessage({ text: 'You don\'t have permission to remove news articles', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/removerNews?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ text: 'Article removed successfully!', type: 'success' });
                fetchNews();
            } else {
                setMessage({ text: data.message || 'Error removing article', type: 'error' });
            }
        } catch (error) {
            console.error('Error removing news:', error);
            setMessage({ text: 'Error removing article: ' + error.message, type: 'error' });
        }
    };

    // Handle page change in pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="news-container">
            <div className="dashboard-header-actions">
                <h2 className="dashboard-section-title">News Management</h2>
                {!formVisible && userPermissions.can_manage_news && (
                    <button className="btn-add" onClick={() => setFormVisible(true)}>
                        <i className="fas fa-plus"></i> Add New Article
                    </button>
                )}
            </div>

            {formVisible && (
                <NewsForm
                    news={editingNews}
                    token={token}
                    setMessage={setMessage}
                    refreshNews={fetchNews}
                    cancelForm={cancelForm}
                    API_URL={API_URL}
                />
            )}

            {isLoading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Loading news...</p>
                </div>
            ) : (
                <>
                    <NewsList
                        news={news}
                        onEdit={startEditNews}
                        onRemove={removeNews}
                        API_URL={API_URL}
                    />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>

                            <span className="pagination-info">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default News;