import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import './News.css';

const NewsCard = ({ article, API_URL }) => {
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return format(date, "MMMM d", { locale: enUS });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="news-card">
            <Link to={`/news/${article.slug}`} className="news-card-link">
                <div className="news-card-image">
                    {article.thumbnail ? (
                        <img
                            src={`${API_URL}/${article.thumbnail}`}
                            alt={article.title}
                        />
                    ) : (
                        <div className="placeholder-image">
                            <i className="fas fa-newspaper"></i>
                        </div>
                    )}
                </div>
                <div className="news-card-content">
                    <div className="news-card-date">
                        {formatDate(article.published_at)}
                    </div>
                    <h2 className="news-card-title">{article.title}</h2>
                    <p className="news-card-excerpt">
                        {article.short_description || 'Click to read more...'}
                    </p>
                    <div className="news-card-read-more">
                        Read More <i className="fas fa-arrow-right"></i>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default NewsCard;