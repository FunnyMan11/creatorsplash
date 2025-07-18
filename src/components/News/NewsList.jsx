import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './News.css';

const NewsList = ({ API_URL }) => {
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage, API_URL]);

    const fetchNews = async (page) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/listarNews?page=${page}&per_page=9&published_only=true`);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                setNews(data.data || []);
                setTotalPages(data.pagination.total_pages || 1);
            } else {
                setError(data.message || 'Failed to load news');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to load news. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, "MMMM d, yyyy", { locale: enUS });
        } catch (e) {
            return dateString;
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (isLoading) {
        return (
            <div className="news-page-container">
                <div className="news-page-header">
                    <h1>Latest News</h1>
                </div>
                <div className="news-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading news...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="news-page-container">
                <div className="news-page-header">
                    <h1>Latest News</h1>
                </div>
                <div className="news-error">
                    <p>{error}</p>
                    <button className="retry-button" onClick={() => fetchNews(currentPage)}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="news-page-container">
            <div className="news-page-header">
                <h1>Latest News</h1>
                <p>Stay updated with our latest announcements and articles</p>
            </div>

            {news.length === 0 ? (
                <div className="no-news">
                    <p>No news available at the moment.</p>
                </div>
            ) : (
                <>
                    <div className="news-grid">
                        {news.map((item) => (
                            <div key={item.id} className="news-card">
                                <Link to={`/news/${item.slug}`} className="news-card-link">
                                    <div className="news-card-image">
                                        {item.thumbnail ? (
                                            <img
                                                src={`${API_URL}/${item.thumbnail}`}
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div className="placeholder-image">
                                                <i className="fas fa-newspaper"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="news-card-content">
                                        <div className="news-card-date">
                                            {formatDate(item.published_at)}
                                        </div>
                                        <h2 className="news-card-title">{item.title}</h2>
                                        <p className="news-card-excerpt">
                                            {item.short_description || 'Click to read more...'}
                                        </p>
                                        <div className="news-card-read-more">
                                            Read More <i className="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="news-pagination">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>

                            <div className="pagination-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        // Show first page, last page, current page, and pages close to current
                                        return page === 1 ||
                                            page === totalPages ||
                                            Math.abs(page - currentPage) <= 1;
                                    })
                                    .map((page, index, array) => {
                                        // If there's a gap, show ellipsis
                                        if (index > 0 && page - array[index - 1] > 1) {
                                            return (
                                                <React.Fragment key={`ellipsis-${page}`}>
                                                    <span className="pagination-ellipsis">...</span>
                                                    <button
                                                        className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <button
                                                key={page}
                                                className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                            </div>

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

export default NewsList;