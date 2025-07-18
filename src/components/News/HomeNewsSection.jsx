import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NewsCard from './NewsCard';
import './News.css';

const HomeNewsSection = ({ API_URL }) => {
    const [latestNews, setLatestNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLatestNews();
    }, [API_URL]);

    const fetchLatestNews = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/listarNews?page=1&per_page=3&published_only=true`);

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                setLatestNews(data.data || []);
            } else {
                setError(data.message || 'Failed to load news');
            }
        } catch (error) {
            console.error('Error fetching latest news:', error);
            setError('Failed to load latest news');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <section className="home-news-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Latest News</h2>
                    </div>
                    <div className="news-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading latest news...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || latestNews.length === 0) {
        return null; // Don't show the section if there's an error or no news
    }

    return (
        <section className="home-news-section">
            <div className="container">
                <div className="section-header">
                    <h2>Latest News</h2>
                    <Link to="/news" className="view-all-link">
                        View All News <i className="fas fa-arrow-right"></i>
                    </Link>
                </div>

                <div className="home-news-grid">
                    {latestNews.map(article => (
                        <NewsCard
                            key={article.id}
                            article={article}
                            API_URL={API_URL}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeNewsSection;