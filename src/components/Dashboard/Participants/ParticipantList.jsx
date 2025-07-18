import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const ParticipantList = ({ participants, onEdit, onRemove, API_URL }) => {
    if (participants.length === 0) {
        return <p className="no-data-message">No participants available for this game.</p>;
    }

    return (
        <div className="participants-list">
            {participants.map((participant, index) => (
                <Draggable
                    key={participant.id.toString()}
                    draggableId={participant.id.toString()}
                    index={index}
                >
                    {(provided, snapshot) => (
                        <div
                            className={`participant-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                                ...provided.draggableProps.style
                            }}
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
                                <p>Order: {typeof participant.ordem === 'number' ? participant.ordem : index}</p>
                            </div>
                            <div className="participant-actions">
                                <button onClick={() => onEdit(participant)}>Edit</button>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(participant.id);
                                }}>Remove</button>
                            </div>

                            {/* Explicit drag handle */}
                            <div
                                className="participant-drag-handle"
                                {...provided.dragHandleProps}
                                title="Drag to reorder"
                            >
                                <i className="fas fa-grip-lines"></i>
                            </div>
                        </div>
                    )}
                </Draggable>
            ))}
        </div>
    );
};

export default ParticipantList;