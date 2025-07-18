import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

const GameList = ({ games, onEdit, onRemove }) => {
    if (games.length === 0) {
        return <p className="no-data-message">No games available. Create your first game!</p>;
    }

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return format(date, "MMMM d, yyyy", { locale: enUS });
    };

    return (
        <div className="games-list">
            {games.map((game, index) => (
                <Draggable
                    key={`game-${game.id}`}
                    draggableId={`game-${game.id}`} // Prefix with "game-" to ensure string
                    index={index}
                >
                    {(provided, snapshot) => (
                        <div
                            className={`game-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                                ...provided.draggableProps.style,
                                borderLeftColor: game.cor || '#0F4C5C'
                            }}
                        >
                            <div className="game-header">
                                <h3>{game.nome}</h3>
                                <div className="game-actions">
                                    <button
                                        className="edit-btn"
                                        onClick={() => onEdit(game)}
                                        title="Edit Game"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(game.id);
                                        }}
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
                                    <span className="label">Order:</span>
                                    <span className="value">{typeof game.ordem === 'number' ? game.ordem : index}</span>
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
                    )}
                </Draggable>
            ))}
        </div>
    );
};

export default GameList;