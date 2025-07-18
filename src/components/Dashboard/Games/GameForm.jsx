import React, { useState, useEffect } from 'react';

const GameForm = ({
                      game,
                      onSubmit,
                      cancelForm
                  }) => {
    const [name, setName] = useState('');
    const [deadline, setDeadline] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#0F4C5C');

    // Load game data if editing
    useEffect(() => {
        if (game) {
            setName(game.nome || '');
            // Format the date for the date input (YYYY-MM-DD)
            if (game.data_limite) {
                const dateObj = new Date(game.data_limite);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                setDeadline(`${year}-${month}-${day}`);
            } else {
                setDeadline('');
            }
            setDescription(game.descricao || '');
            setColor(game.cor || '#0F4C5C');
        } else {
            resetForm();
        }
    }, [game]);

    // Reset form function
    const resetForm = () => {
        setName('');
        setDeadline('');
        setDescription('');
        setColor('#0F4C5C');
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            nome: name,
            data_limite: deadline,
            descricao: description,
            cor: color
        };

        // Submit the form
        if (game) {
            onSubmit(game.id, formData);
        } else {
            onSubmit(formData);
        }
    };

    return (
        <form className="form-add" onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Deadline:</label>
                <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                />
            </div>

            <div className="full-width">
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                />
            </div>

            <div>
                <label>Color:</label>
                <div className="color-picker-container">
                    <input
                        type="color"
                        id="colorPicker"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                    <span className="color-display" style={{ backgroundColor: color }}>
                        {color}
                    </span>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit">
                    {game ? 'Update Game' : 'Add Game'}
                </button>
                <button type="button" onClick={cancelForm}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default GameForm;