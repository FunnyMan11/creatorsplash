import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const NewsForm = ({
                      news,
                      token,
                      setMessage,
                      refreshNews,
                      cancelForm,
                      API_URL
                  }) => {
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [published, setPublished] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [publishedDate, setPublishedDate] = useState(null);

    // Quill editor modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'link', 'image'
    ];

    // Load news data if editing
    useEffect(() => {
        if (news) {
            setTitle(news.title || '');
            setShortDescription(news.short_description || '');
            setContent(news.content || '');
            setPublished(news.published === "1" || news.published === 1);

            // Set published date if available
            if (news.published_at) {
                setPublishedDate(new Date(news.published_at));
            }

            if (news.thumbnail) {
                setThumbnailPreview(`${API_URL}/${news.thumbnail}`);
            }
        }
    }, [news, API_URL]);

    // Handle thumbnail change
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle publish status change
    const handlePublishedChange = (e) => {
        const isPublished = e.target.checked;
        setPublished(isPublished);

        // If setting to published and there's no published date yet, set it to now
        if (isPublished && !publishedDate) {
            setPublishedDate(new Date());
        }
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return '';
        try {
            return format(date, "MMMM d, yyyy, h:mm a", { locale: enUS });
        } catch (e) {
            return '';
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title) {
            setMessage({ text: 'Title is required', type: 'error' });
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('short_description', shortDescription);
        formData.append('content', content);
        formData.append('published', published ? '1' : '0');

        // Add published date if available
        if (publishedDate) {
            formData.append('published_at', publishedDate.toISOString());
        }

        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            const url = news
                ? `${API_URL}/atualizarNews?id=${news.id}`
                : `${API_URL}/adicionarNews`;

            console.log('Sending request to:', url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                console.error('Error parsing response:', error);
                setMessage({
                    text: 'Error processing server response: ' + error.message,
                    type: 'error'
                });
                setIsSubmitting(false);
                return;
            }

            if (response.ok) {
                setMessage({
                    text: news ? 'Article updated successfully.' : 'Article created successfully.',
                    type: 'success'
                });
                resetForm();
                refreshNews();
            } else {
                setMessage({
                    text: data.message || (news ? 'Error updating article.' : 'Error creating article.'),
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setMessage({
                text: 'API communication error: ' + error,
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setTitle('');
        setShortDescription('');
        setContent('');
        setThumbnail(null);
        setPublished(false);
        setPublishedDate(null);
        setThumbnailPreview('');
        cancelForm();
    };

    return (
        <form className="news-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h3>{news ? 'Edit Article' : 'Add New Article'}</h3>
            </div>

            {/* Title - Full width */}
            <div className="form-row">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-control"
                        placeholder="Enter article title"
                    />
                </div>
            </div>

            {/* Short Description - Full width */}
            <div className="form-row">
                <div className="form-group">
                    <label>Short Description:</label>
                    <textarea
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="form-control"
                        placeholder="Enter a brief description (displayed in listings)"
                        rows="3"
                    />
                </div>
            </div>

            {/* Image and Status in the same row */}
            <div className="form-media-row">
                <div className="form-group">
                    <label>Cover Image:</label>
                    <input
                        type="file"
                        onChange={handleThumbnailChange}
                        accept="image/*"
                        className="form-control"
                    />
                    {thumbnailPreview && (
                        <div className="thumbnail-preview">
                            <p>Cover image:</p>
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                style={{ maxWidth: '200px', maxHeight: '150px', marginTop: '10px' }}
                            />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Publication Status:</label>
                    <div className="form-check">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={handlePublishedChange}
                            id="publishedCheck"
                            className="form-check-input"
                        />
                        <label htmlFor="publishedCheck" className="form-check-label">
                            Published
                        </label>
                    </div>

                    {/* Show publication date only if it's published */}
                    {published && (
                        <div className="publish-date-info">
                            {publishedDate ? (
                                <span>Published on: {formatDate(publishedDate)}</span>
                            ) : (
                                <span>Will be published now</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content - Full width */}
            <div className="form-row">
                <div className="form-group">
                    <label>Content:</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        formats={formats}
                        className="news-editor"
                        placeholder="Write the article content here..."
                    />
                </div>
            </div>

            {/* Action buttons */}
            <div className="form-actions">
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading-spinner small"></span>
                            {news ? 'Updating...' : 'Publishing...'}
                        </>
                    ) : (
                        news ? 'Update Article' : 'Publish Article'
                    )}
                </button>
                <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default NewsForm;