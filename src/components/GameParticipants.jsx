// Fixed GameParticipantsDisplay component
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import '../assets/css/GameParticipants.css';

const GameParticipantsDisplay = () => {
    const [games, setGames] = useState([]);
    const [participants, setParticipants] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // API URL
    const API_URL = '/api';

    // Fetch games and participants
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Starting API request to:", `${API_URL}/listarGames`);

                // Fetch games
                const gamesResponse = await fetch(`${API_URL}/listarGames`);
                if (!gamesResponse.ok) {
                    const errorText = await gamesResponse.text();
                    console.error("API Error (Games):", gamesResponse.status, errorText);
                    throw new Error(`API error ${gamesResponse.status}: ${errorText}`);
                }

                const gamesData = await gamesResponse.json();
                console.log("API response (Games):", gamesData);

                if (gamesData.status === 'success') {
                    const gamesArray = gamesData.data || [];
                    setGames(gamesArray);

                    // Fetch participants for each game
                    const participantsData = {};

                    for (const game of gamesArray) {
                        try {
                            console.log(`Fetching participants for game ID: ${game.id}`);
                            const participantsResponse = await fetch(`${API_URL}/listarParticipants?game_id=${game.id}`);

                            if (participantsResponse.ok) {
                                const participantsResult = await participantsResponse.json();
                                console.log(`Participants for game ${game.id}:`, participantsResult);

                                if (participantsResult.status === 'success') {
                                    participantsData[game.id] = participantsResult.data || [];
                                } else {
                                    console.error(`Error loading participants for game ${game.id}:`, participantsResult.message);
                                    participantsData[game.id] = [];
                                }
                            } else {
                                console.error(`Failed to fetch participants for game ${game.id}`);
                                participantsData[game.id] = [];
                            }
                        } catch (err) {
                            console.error(`Error fetching participants for game ${game.id}:`, err);
                            participantsData[game.id] = [];
                        }
                    }

                    setParticipants(participantsData);
                } else {
                    setError(`Failed to load games: ${gamesData.message || 'Unknown error'}`);
                }
            } catch (err) {
                console.error("Error details:", err);
                setError("Error fetching data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Group games into current and past based on deadline
    const currentDate = new Date();

    const groupedGames = _.groupBy(games, (game) => {
        const gameDate = new Date(game.data_limite);
        return gameDate >= currentDate ? 'currentGames' : 'pastGames';
    });

    const currentGames = groupedGames.currentGames || [];
    const pastGames = groupedGames.pastGames || [];

    // Calculate text color for contrast based on background color
    const getTextColor = (bgColor) => {
        // Default color if none is provided
        if (!bgColor) return '#ffffff';

        // Convert hex to RGB
        const r = parseInt(bgColor.substr(1, 2), 16);
        const g = parseInt(bgColor.substr(3, 2), 16);
        const b = parseInt(bgColor.substr(5, 2), 16);

        // Calculate brightness
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Return black or white based on brightness
        return brightness > 128 ? '#000000' : '#ffffff';
    };

    // Function to create empty participant slots
    const createEmptySlots = (count) => {
        return Array(count).fill().map((_, index) => (
            <div key={`empty-${index}`} className="cs-participant cs-empty-slot">
                <div className="cs-participant-icon">?</div>
                <div className="cs-participant-name">TBA</div>
            </div>
        ));
    };

    // Function to open the modal with game details
    const openGameDetails = (game) => {
        setSelectedGame({
            ...game,
            participants: participants[game.id] || []
        });
        setModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setModalOpen(false);
    };

    // Function to render a single game card
    const renderGameCard = (game) => {
        // Default color if none is set
        const gameColor = game.cor || '#0F4C5C';
        const textColor = getTextColor(gameColor);
        const gameParticipants = participants[game.id] || [];

        return (
            <div key={game.id} className="cs-game-card" style={{ borderColor: gameColor }}>
                <div
                    className="cs-game-header"
                    style={{ backgroundColor: gameColor, color: textColor }}
                >
                    <h3 className="cs-game-title" style={{ color: textColor }}>{game.nome}</h3>
                    <div className="cs-game-date" style={{ color: `${textColor}CC` }}>
                        {new Date(game.data_limite).toLocaleDateString()}
                    </div>
                </div>
                <div className="cs-participants-grid">
                    {gameParticipants.map(participant => (
                        <div
                            key={participant.id}
                            className="cs-participant"
                            style={{
                                borderLeft: `3px solid ${gameColor}`,
                                borderBottom: `1px solid ${gameColor}20`
                            }}
                        >
                            <div className="cs-participant-icon">
                                {participant.imagem ? (
                                    <img
                                        src={`${API_URL}/${participant.imagem}`}
                                        alt={participant.nickname}
                                        className="cs-participant-image"
                                        style={{ border: `2px solid ${gameColor}` }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://imgur.com/J7dFzuGF.png";
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="cs-participant-icon-placeholder"
                                        style={{
                                            backgroundColor: gameColor,
                                            color: textColor
                                        }}
                                    >
                                        {participant.nickname.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="cs-participant-name">{participant.nickname}</div>
                        </div>
                    ))}
                    {createEmptySlots(Math.max(0, 5 - (gameParticipants.length || 0))).map((slot, index) => (
                        React.cloneElement(slot, {
                            key: `empty-${game.id}-${index}`,
                            style: {
                                borderLeft: `3px solid ${gameColor}40`,
                                borderBottom: `1px solid ${gameColor}10`
                            }
                        })
                    ))}
                </div>
                <div className="cs-game-actions">
                    <button
                        className="cs-details-button"
                        onClick={() => openGameDetails(game)}
                        style={{
                            backgroundColor: gameColor,
                            color: textColor
                        }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        );
    };

    // Render modal with game details
    const renderGameDetailsModal = () => {
        if (!selectedGame) return null;

        const gameColor = selectedGame.cor || '#0F4C5C';
        const textColor = getTextColor(gameColor);
        const gameParticipants = participants[selectedGame.id] || [];

        return (
            <div className={`cs-game-details-modal ${modalOpen ? 'open' : ''}`}>
                <div className="cs-modal-overlay" onClick={closeModal}></div>
                <div className="cs-modal-content">
                    <div
                        className="cs-modal-header"
                        style={{ backgroundColor: gameColor }}
                    >
                        <h2 style={{ color: textColor }}>{selectedGame.nome}</h2>
                        <button
                            className="cs-close-modal"
                            onClick={closeModal}
                            style={{ color: textColor }}
                        >
                            ×
                        </button>
                    </div>
                    <div className="cs-modal-body">
                        <div className="cs-game-info">
                            <div className="cs-info-item">
                                <h4 style={{ color: gameColor }}>Deadline</h4>
                                <p>{new Date(selectedGame.data_limite).toLocaleDateString()}</p>
                            </div>
                            <div className="cs-info-item">
                                <h4 style={{ color: gameColor }}>Description</h4>
                                <p>{selectedGame.descricao || "No description available."}</p>
                            </div>
                            <div className="cs-info-item">
                                <h4 style={{ color: gameColor }}>Participants</h4>
                                <p>Total: {gameParticipants.length || 0}</p>
                            </div>
                        </div>

                        <div className="cs-participants-section">
                            <h3 style={{ borderBottomColor: gameColor }}>Participants List</h3>
                            <div className="cs-modal-participants-list">
                                {gameParticipants && gameParticipants.length > 0 ? (
                                    gameParticipants.map(participant => (
                                        <div
                                            key={participant.id}
                                            className="cs-modal-participant"
                                            style={{ borderLeft: `3px solid ${gameColor}` }}
                                        >
                                            {participant.imagem ? (
                                                <img
                                                    src={`${API_URL}/${participant.imagem}`}
                                                    alt={participant.nickname}
                                                    className="cs-participant-image"
                                                    style={{ border: `2px solid ${gameColor}` }}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://imgur.com/J7dFzuGF.png";
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="cs-participant-icon-placeholder"
                                                    style={{
                                                        backgroundColor: gameColor,
                                                        color: textColor
                                                    }}
                                                >
                                                    {participant.nickname.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span>{participant.nickname}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="cs-no-participants">No participants registered.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="games"><div className="cs-games-container"><div className="cs-loading">Loading games and participants...</div></div></div>;
    if (error) return <div className="games">
        <div className="cs-games-container">
            <div className="cs-error-message">{error}</div>
        </div>
    </div>;

    return (
        <div className="games">
            <div className="cs-games-container">
                <h1 className="cs-main-title">Creator Splash - Participants</h1>

                <div className="cs-games-section">
                    <h2 className="cs-section-title">Current Games</h2>
                    <div className="cs-games-grid">
                        {currentGames.length > 0 ?
                            currentGames.map(game => renderGameCard(game)) :
                            <p>No current games available.</p>
                        }
                    </div>
                </div>

                <div className="cs-games-section">
                    <h2 className="cs-section-title">Past Games</h2>
                    <div className="cs-games-grid">
                        {pastGames.length > 0 ?
                            pastGames.map(game => renderGameCard(game)) :
                            <p>No past games available.</p>
                        }
                    </div>
                </div>

                {renderGameDetailsModal()}
            </div>
        </div>
    );
};

export default GameParticipantsDisplay;