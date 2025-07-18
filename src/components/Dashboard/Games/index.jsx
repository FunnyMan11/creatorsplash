import React, { useState, useEffect } from 'react';
import GameForm from './GameForm';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Games = ({
                   userPermissions,
                   token,
                   setMessage,
                   API_URL
               }) => {
    const [games, setGames] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);

    // Load games on component mount
    useEffect(() => {
        fetchGames();
    }, []);

    // Fetch games function
    const fetchGames = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/listarGames`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching games: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                console.log("Games loaded:", data.data);
                setGames(data.data || []);
            } else {
                setMessage({ text: data.message || 'Error loading games', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            setMessage({ text: 'Error loading games', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Add game
    const addGame = async (formData) => {
        if (!userPermissions.can_manage_games) {
            setMessage({ text: 'You do not have permission to add games', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/adicionarGame`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error adding game: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Game successfully added!', type: 'success' });
                fetchGames();
                setFormVisible(false);
                setEditingGame(null);
            } else {
                setMessage({ text: data.message || 'Error adding game', type: 'error' });
            }
        } catch (error) {
            console.error('Error adding game:', error);
            setMessage({ text: 'Error adding game: ' + error.message, type: 'error' });
        }
    };

    // Update game
    const updateGame = async (id, formData) => {
        if (!userPermissions.can_manage_games) {
            setMessage({ text: 'You do not have permission to edit games', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/atualizarGame?id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error updating game: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Game successfully updated!', type: 'success' });
                fetchGames();
                setFormVisible(false);
                setEditingGame(null);
            } else {
                setMessage({ text: data.message || 'Error updating game', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating game:', error);
            setMessage({ text: 'Error updating game: ' + error.message, type: 'error' });
        }
    };

    // Remove game
    const removeGame = async (id) => {
        if (!window.confirm('Are you sure you want to remove this game? This will also remove all associated participants.')) {
            return;
        }

        if (!userPermissions.can_manage_games) {
            setMessage({ text: 'You do not have permission to remove games', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/removerGame?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error removing game: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Game successfully removed!', type: 'success' });
                fetchGames();
            } else {
                setMessage({ text: data.message || 'Error removing game', type: 'error' });
            }
        } catch (error) {
            console.error('Error removing game:', error);
            setMessage({ text: 'Error removing game: ' + error.message, type: 'error' });
        }
    };

    // Start editing game
    const startEditGame = (game) => {
        setEditingGame(game);
        setFormVisible(true);
    };

    // Cancel form
    const cancelForm = () => {
        setEditingGame(null);
        setFormVisible(false);
    };

    // Format date function
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, "MMMM d, yyyy", { locale: enUS });
        } catch (e) {
            return dateString;
        }
    };

    // Drag start handler
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = "move";
        // Make the ghost drag image transparent
        setTimeout(() => {
            e.target.style.opacity = "0.4";
        }, 0);
    };

    // Drag end handler
    const handleDragEnd = (e) => {
        e.target.style.opacity = "1";
    };

    // Drag over handler
    const handleDragOver = (e, index) => {
        e.preventDefault();
        const draggedOverItem = games[index];

        // If the item is dragged over itself, ignore
        if (draggedItem === index) {
            return;
        }

        // Filter out the currently dragged item
        let newGames = [...games];
        const draggedItemContent = newGames[draggedItem];
        // Remove draggedItem
        newGames.splice(draggedItem, 1);
        // Add it back at the new position
        newGames.splice(index, 0, draggedItemContent);

        setDraggedItem(index);
        setGames(newGames);
    };

    // Drag drop handler - finalize the move
    const handleDrop = (e) => {
        e.preventDefault();

        // Save the new order to the server
        saveGamesOrder();
    };

    // Save games order
    const saveGamesOrder = async () => {
        if (!userPermissions.can_manage_games) {
            setMessage({ text: 'You do not have permission to reorder games', type: 'error' });
            return;
        }

        try {
            const gameIds = games.map(game => game.id);
            console.log("Saving new order:", gameIds);

            const response = await fetch(`${API_URL}/salvarOrdemGames`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameIds: gameIds
                })
            });

            if (!response.ok) {
                throw new Error(`Error saving games order: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Games order updated successfully!', type: 'success' });
            } else {
                setMessage({ text: data.message || 'Error saving games order', type: 'error' });
            }
        } catch (error) {
            console.error('Error saving games order:', error);
            setMessage({ text: 'Error saving games order: ' + error.message, type: 'error' });
        }
    };

    return (
        <div className="games-container">
            <h2 className="dashboard-section-title">Game Management</h2>

            {!formVisible && userPermissions.can_manage_games && (
                <div className="btn-add-container">
                    <button className="btn-add" onClick={() => setFormVisible(true)}>
                        <i className="fas fa-plus"></i> Add New Game
                    </button>
                </div>
            )}

            {formVisible && (
                <GameForm
                    game={editingGame}
                    onSubmit={editingGame ? updateGame : addGame}
                    cancelForm={cancelForm}
                />
            )}

            {isLoading ? (
                <div className="loading">
                    <span>Loading games...</span>
                </div>
            ) : (
                <div className="games-list">
                    {games.length === 0 ? (
                        <p className="no-data-message">No games available. Create your first game!</p>
                    ) : (
                        games.map((game, index) => (
                            <div
                                key={`game-${game.id}-${index}`}
                                className="game-card"
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDrop={handleDrop}
                                style={{
                                    borderLeftColor: game.cor || '#0F4C5C',
                                    cursor: 'grab'
                                }}
                            >
                                <div className="game-header">
                                    <h3>{game.nome}</h3>
                                    <div className="game-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => startEditGame(game)}
                                            title="Edit Game"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => removeGame(game.id)}
                                            title="Delete Game"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="game-details">
                                    <div className="game-detail">
                                        <span className="label">Deadline:</span>
                                        <span className="value">{formatDate(game.data_limite)}</span>
                                    </div>

                                    <div className="game-detail">
                                        <span className="label">Position:</span>
                                        <span className="value">{index + 1}</span>
                                    </div>
                                </div>

                                {game.descricao && (
                                    <div className="game-description">
                                        <p>{game.descricao}</p>
                                    </div>
                                )}

                                <div className="game-color-indicator">
                                    <span className="color-label">Color:</span>
                                    <span
                                        className="color-preview"
                                        style={{ backgroundColor: game.cor || '#0F4C5C' }}
                                        title={game.cor}
                                    ></span>
                                </div>

                                <div className="game-drag-handle">
                                    <i className="fas fa-grip-lines"></i>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Games;