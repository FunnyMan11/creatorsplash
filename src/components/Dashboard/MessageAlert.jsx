import React, { useEffect, useState } from 'react';

const MessageAlert = ({ message, type, autoHideDuration = 5000 }) => {
    const [visible, setVisible] = useState(!!message);

    useEffect(() => {
        setVisible(!!message);

        if (message) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, autoHideDuration);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [message, autoHideDuration]);

    if (!visible || !message) return null;

    return (
        <div className={`message ${type}`}>
            {message}
            <button className="close-btn" onClick={() => setVisible(false)}>×</button>
        </div>
    );
};

export default MessageAlert;