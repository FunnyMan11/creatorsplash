import React from 'react';

const UserProfile = ({ userData, API_URL }) => {
    return (
        <div className="user-profile">
            <img
                src={userData.profile_image ? `${API_URL}/${userData.profile_image}` : "https://imgur.com/J7dFzuGF.png"}
                alt={userData.username}
                className="user-avatar"
            />
            <div className="user-info">
                <h3>{userData.full_name || userData.username}</h3>
                <p>{userData.role_name || "Administrator"}</p>
            </div>
        </div>
    );
};

export default UserProfile;