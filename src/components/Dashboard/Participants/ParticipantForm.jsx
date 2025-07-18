import React, { useState, useEffect } from 'react';

const ParticipantForm = ({
                             participant,
                             selectedGameId,
                             onSubmit,
                             cancelForm,
                             API_URL
                         }) => {
    const [nickname, setNickname] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // Load participant data if editing
    useEffect(() => {
        if (participant) {
            setNickname(participant.nickname || '');
            if (participant.imagem) {
                setPreviewUrl(`${API_URL}/${participant.imagem}`);
            }
        } else {
            resetForm();
        }
    }, [participant, API_URL]);

    // Reset form function
    const resetForm = () => {
        setNickname('');
        setImage(null);
        setPreviewUrl('');
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData object
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('game_id', selectedGameId);

        if (image) {
            formData.append('imagem', image);
        }

        // Submit the form
        if (participant) {
            onSubmit(participant.id, formData);
        } else {
            onSubmit(formData);
        }
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create a URL for preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    return (
        <form className="form-add" onSubmit={handleSubmit}>
            <div>
                <label>Nickname:</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Profile Image:</label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                />
                {previewUrl && (
                    <div className="image-preview">
                        <p>Image Preview:</p>
                        <img
                            src={previewUrl}
                            alt="Preview"
                            style={{ maxWidth: '150px', maxHeight: '150px', marginTop: '10px' }}
                        />
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="submit">
                    {participant ? 'Update Participant' : 'Add Participant'}
                </button>
                <button type="button" onClick={cancelForm}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ParticipantForm;