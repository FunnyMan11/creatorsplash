import React from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const NewsList = ({ news, onEdit, onRemove, API_URL }) => {
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not published';
        try {
            const date = new Date(dateString);
            return format(date, "MMMM d, yyyy", { locale: enUS });
        } catch (e) {
            return dateString;
        }
    };

    if (news.length === 0) {
        return <p className="no-items">No news articles available.</p>;
    }

    return (
        <div className="news-list">
            <div className="news-list-header">
                <div className="news-header-cell image" style={{ width: '100px' }}>Image</div>
                <div className="news-header-cell title" style={{ flex: '2' }}>Title</div>
                <div className="news-header-cell date" style={{ flex: '1' }}>Date</div>
                <div className="news-header-cell status" style={{ flex: '1' }}>Status</div>
                <div className="news-header-cell views" style={{ flex: '1' }}>Views</div>
                <div className="news-header-cell actions" style={{ width: '120px' }}>Actions</div>
            </div>

            {news.map((item) => (
                <div key={item.id} className="news-item">
                    <div className="news-cell image">
                        {item.thumbnail ? (
                            <img
                                src={`${API_URL}/${item.thumbnail}`}
                                alt={item.title}
                                className="news-thumbnail"
                            />
                        ) : (
                            <div className="no-thumbnail">
                                <i className="fas fa-newspaper"></i>
                            </div>
                        )}
                    </div>

                    <div className="news-cell title">
                        <h3>{item.title}</h3>
                        <p>{item.short_description || 'No description'}</p>
                    </div>

                    <div className="news-cell date">
                        {formatDate(item.published_at)}
                    </div>

                    <div className="news-cell status">
                        <span className={`status-badge ${item.published === "1" || item.published === 1 ? 'published' : 'draft'}`}>
                            {item.published === "1" || item.published === 1 ? 'Published' : 'Draft'}
                        </span>
                    </div>

                    <div className="news-cell views">
                        <span className="view-count">
                            <i className="fas fa-eye"></i> {item.view_count || 0}
                        </span>
                    </div>

                    <div className="news-cell actions">
                        <button
                            onClick={() => onEdit(item)}
                            className="btn-edit"
                            title="Edit"
                        >
                            <i className="fas fa-edit"></i>
                        </button>

                        <button
                            onClick={() => onRemove(item.id)}
                            className="btn-delete"
                            title="Remove"
                        >
                            <i className="fas fa-trash"></i>
                        </button>

                        <a
                            href={`/news/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-view"
                            title="View"
                        >
                            <i className="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsList;