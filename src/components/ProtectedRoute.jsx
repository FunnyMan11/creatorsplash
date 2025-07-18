import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ isAuthenticated, children }) {
    const [sessionInfo, setSessionInfo] = useState({
        timeRemaining: 0,
        expiryDate: null,
        formattedTimeRemaining: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            // Função para calcular e atualizar o tempo restante
            const updateSessionTime = () => {
                const token = localStorage.getItem('token');

                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        const currentTime = Date.now() / 1000;
                        const timeRemaining = decoded.exp - currentTime;

                        if (timeRemaining > 0) {
                            // Calcula horas, minutos e segundos
                            const hours = Math.floor(timeRemaining / 3600);
                            const minutes = Math.floor((timeRemaining % 3600) / 60);
                            const seconds = Math.floor(timeRemaining % 60);

                            // Formata o tempo restante
                            const formattedTimeRemaining = `${hours}h ${minutes}m ${seconds}s`;

                            // Formata a data de expiração
                            const expiryDate = new Date(decoded.exp * 1000).toLocaleString('pt-BR');

                            setSessionInfo({
                                timeRemaining,
                                expiryDate,
                                formattedTimeRemaining
                            });
                        } else {
                            // Token expirado
                            localStorage.removeItem('token');
                            window.location.href = '/admin-login'; // Força recarregamento para atualizar estado
                        }
                    } catch (error) {
                        console.error('Erro ao decodificar o token:', error);
                    }
                }
            };

            // Atualiza imediatamente
            updateSessionTime();

            // Configura um intervalo para atualizar a cada segundo
            const intervalId = setInterval(updateSessionTime, 1000);

            return () => clearInterval(intervalId);
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return (
        <>
            {isAuthenticated && sessionInfo.timeRemaining > 0 && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '10px 15px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    zIndex: 1000,
                    fontSize: '14px'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        Sessão ativa
                    </div>
                    <div>
                        Tempo restante: {sessionInfo.formattedTimeRemaining}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                        Expira em: {sessionInfo.expiryDate}
                    </div>
                </div>
            )}
            {children}
        </>
    );
}

ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;