import React, { useState, useEffect } from 'react';
import ParticipantForm from './ParticipantForm';

const Participants = ({
                          games,
                          userPermissions,
                          token,
                          setMessage,
                          API_URL
                      }) => {
    const [selectedGameId, setSelectedGameId] = useState('');
    const [participants, setParticipants] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);

    // Load participants when the game is selected
    useEffect(() => {
        if (selectedGameId) {
            fetchParticipants(selectedGameId);
        } else {
            setParticipants([]);
        }
    }, [selectedGameId]);

    // Fetch participants function
    const fetchParticipants = async (gameId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/listarParticipants?game_id=${gameId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching participants: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                console.log("Participants loaded:", data.data);
                setParticipants(data.data || []);
            } else {
                setMessage({ text: data.message || 'Error loading participants', type: 'error' });
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
            setMessage({ text: 'Error loading participants', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // Add participant
    const addParticipant = async (formData) => {
        if (!userPermissions.can_manage_participants) {
            setMessage({ text: 'You do not have permission to add participants', type: 'error' });
            return;
        }

        try {
            // Add game_id to FormData if it's not already there
            if (!formData.has('game_id')) {
                formData.append('game_id', selectedGameId);
            }

            const response = await fetch(`${API_URL}/adicionarParticipant`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error adding participant: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Participant successfully added!', type: 'success' });
                fetchParticipants(selectedGameId);
                setFormVisible(false);
                setEditingParticipant(null);
            } else {
                setMessage({ text: data.message || 'Error adding participant', type: 'error' });
            }
        } catch (error) {
            console.error('Error adding participant:', error);
            setMessage({ text: 'Error adding participant: ' + error.message, type: 'error' });
        }
    };

    // Update participant
    const updateParticipant = async (id, formData) => {
        if (!userPermissions.can_manage_participants) {
            setMessage({ text: 'You do not have permission to edit participants', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/atualizarParticipant?id=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Error updating participant: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Participant successfully updated!', type: 'success' });
                fetchParticipants(selectedGameId);
                setFormVisible(false);
                setEditingParticipant(null);
            } else {
                setMessage({ text: data.message || 'Error updating participant', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating participant:', error);
            setMessage({ text: 'Error updating participant: ' + error.message, type: 'error' });
        }
    };

    // Remove participant
    const removeParticipant = async (id) => {
        if (!window.confirm('Are you sure you want to remove this participant?')) {
            return;
        }

        if (!userPermissions.can_manage_participants) {
            setMessage({ text: 'You do not have permission to remove participants', type: 'error' });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/removerParticipant?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error removing participant: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Participant successfully removed!', type: 'success' });
                fetchParticipants(selectedGameId);
            } else {
                setMessage({ text: data.message || 'Error removing participant', type: 'error' });
            }
        } catch (error) {
            console.error('Error removing participant:', error);
            setMessage({ text: 'Error removing participant: ' + error.message, type: 'error' });
        }
    };

    // Start editing participant
    const startEditParticipant = (participant) => {
        setEditingParticipant(participant);
        setFormVisible(true);
    };

    // Cancel form
    const cancelForm = () => {
        setEditingParticipant(null);
        setFormVisible(false);
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
        const draggedOverItem = participants[index];

        // If the item is dragged over itself, ignore
        if (draggedItem === index) {
            return;
        }

        // Filter out the currently dragged item
        let newParticipants = [...participants];
        const draggedItemContent = newParticipants[draggedItem];
        // Remove draggedItem
        newParticipants.splice(draggedItem, 1);
        // Add it back at the new position
        newParticipants.splice(index, 0, draggedItemContent);

        setDraggedItem(index);
        setParticipants(newParticipants);
    };

    // Drag drop handler - finalize the move
    const handleDrop = (e) => {
        e.preventDefault();

        // Save the new order to the server
        saveParticipantsOrder();
    };

    // Save participants order
    const saveParticipantsOrder = async () => {
        if (!userPermissions.can_manage_participants) {
            setMessage({ text: 'You do not have permission to reorder participants', type: 'error' });
            return;
        }

        try {
            const participantIds = participants.map(p => p.id);
            console.log("Saving new participant order:", participantIds);

            const response = await fetch(`${API_URL}/salvarOrdemParticipants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameId: selectedGameId,
                    participantIds: participantIds
                })
            });

            if (!response.ok) {
                throw new Error(`Error saving participants order: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status === 'success') {
                setMessage({ text: 'Participants order updated successfully!', type: 'success' });
            } else {
                setMessage({ text: data.message || 'Error saving participants order', type: 'error' });
            }
        } catch (error) {
            console.error('Error saving participants order:', error);
            setMessage({ text: 'Error saving participants order: ' + error.message, type: 'error' });
        }
    };

    return (
        <div className="participants-container">
            <h2 className="dashboard-section-title">Participant Management</h2>

            <div className="game-selector">
                <label>Select a Game:</label>
                <select
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                >
                    <option value="">-- Select a Game --</option>
                    {games.map((game) => (
                        <option key={game.id} value={game.id}>
                            {game.nome}
                        </option>
                    ))}
                </select>
            </div>

            {selectedGameId && (
                <>
                    {!formVisible && userPermissions.can_manage_participants && (
                        <div className="btn-add-container">
                            <button className="btn-add" onClick={() => setFormVisible(true)}>
                                <i className="fas fa-plus"></i> Add New Participant
                            </button>
                        </div>
                    )}

                    {formVisible && (
                        <ParticipantForm
                            participant={editingParticipant}
                            selectedGameId={selectedGameId}
                            onSubmit={editingParticipant ? updateParticipant : addParticipant}
                            cancelForm={cancelForm}
                            API_URL={API_URL}
                        />
                    )}

                    {isLoading ? (
                        <div className="loading">
                            <span>Loading participants...</span>
                        </div>
                    ) : (
                        <div className="participants-list">
                            {participants.length === 0 ? (
                                <p className="no-data-message">No participants available for this game.</p>
                            ) : (
                                participants.map((participant, index) => (
                                    <div
                                        key={`participant-${participant.id}-${index}`}
                                        className="participant-card"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDrop={handleDrop}
                                        style={{ cursor: 'grab' }}
                                    >
                                        <div className="participant-image">
                                            {participant.imagem ? (
                                                <img
                                                    src={`${API_URL}/${participant.imagem}`}
                                                    alt={participant.nickname}
                                                    className="participant-avatar"
                                                />
                                            ) : (
                                                <div className="participant-avatar-placeholder">
                                                    {participant.nickname.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="participant-info">
                                            <h3>{participant.nickname}</h3>
                                            <p>Position: {index + 1}</p>
                                        </div>
                                        <div className="participant-actions">
                                            <button onClick={() => startEditParticipant(participant)}>Edit</button>
                                            <button onClick={() => removeParticipant(participant.id)}>Remove</button>
                                        </div>

                                        <div className="participant-drag-handle">
                                            <i className="fas fa-grip-lines"></i>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {!selectedGameId && (
                <p className="select-game-message">Please select a game to manage its participants</p>
            )}
        </div>
    );
};

export default Participants;