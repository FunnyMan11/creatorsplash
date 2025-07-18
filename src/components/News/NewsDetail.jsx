import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './News.css';

const NewsDetail = ({ API_URL }) => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        fetchNewsArticle();
    }, [slug, API_URL]);

    const fetchNewsArticle = async () => {
        if (!slug) return;

        setIsLoading(true);
        try {
            // Fetch the individual news article
            const response = await fetch(`${API_URL}/getNews?slug=${slug}&increment_views=true`);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'success' && data.data) {
                setNews(data.data);

                // Fetch related news
                fetchRelatedNews(data.data.id);
            } else {
                setError(data.message || 'Article not found');
                if (data.status === 'error' && data.message === 'News article not found') {
                    // Redirect to the news list page if the article doesn't exist
                    setTimeout(() => {
                        navigate('/news');
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('Error fetching news article:', error);
            setError('Failed to load the article. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRelatedNews = async (currentNewsId) => {
        try {
            // Fetch 3 random published news articles (excluding the current one)
            const response = await fetch(`${API_URL}/listarNews?per_page=3&published_only=true`);

            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    // Filter out the current article and limit to 3 items
                    const filtered = (data.data || [])
                        .filter(item => item.id !== currentNewsId)
                        .slice(0, 3);
                    setRelatedNews(filtered);
                }
            }
        } catch (error) {
            console.error('Error fetching related news:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, "MMMM d, yyyy 'at' h:mm a", { locale: enUS });
        } catch (e) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="news-detail-container">
                <div className="news-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="news-detail-container">
                <div className="news-error">
                    <h2>Article Not Found</h2>
                    <p>{error || 'The article you are looking for does not exist or has been removed.'}</p>
                    <Link to="/news" className="back-to-news">
                        <i className="fas fa-arrow-left"></i> Back to News
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="news-detail-container">
            <div className="news-detail-header">
                <Link to="/news" className="back-to-news">
                    <i className="fas fa-arrow-left"></i> Back to News
                </Link>
                <h1 className="news-detail-title">{news.title}</h1>
                <div className="news-detail-meta">
                    <span className="news-detail-date">
                        <i className="far fa-calendar-alt"></i> {formatDate(news.published_at)}
                    </span>
                    {news.author_name && (
                        <span className="news-detail-author">
                            <i className="far fa-user"></i> {news.author_name}
                        </span>
                    )}
                    <span className="news-detail-views">
                        <i className="far fa-eye"></i> {news.view_count || 0} views
                    </span>
                </div>
            </div>

            {news.thumbnail && (
                <div className="news-detail-image">
                    <img src={`${API_URL}/${news.thumbnail}`} alt={news.title} />
                </div>
            )}

            <div className="news-detail-content">
                {/* Render the HTML content safely */}
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>

            {relatedNews.length > 0 && (
                <div className="related-news">
                    <h3 className="related-news-title">Related Articles</h3>
                    <div className="related-news-grid">
                        {relatedNews.map(item => (
                            <Link
                                key={item.id}
                                to={`/news/${item.slug}`}
                                className="related-news-card"
                            >
                                <div className="related-news-image">
                                    {item.thumbnail ? (
                                        <img
                                            src={`${API_URL}/${item.thumbnail}`}
                                            alt={item.title}
                                        />
                                    ) : (
                                        <div className="placeholder-image small">
                                            <i className="fas fa-newspaper"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="related-news-content">
                                    <h4>{item.title}</h4>
                                    <span className="related-news-date">
                                        {formatDate(item.published_at)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsDetail;