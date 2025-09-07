import React from 'react';

export default function Login() {
    return (
        <div className="login-container">
            <button
                onClick={() => (window.location.href = '../pages/api/auth/login')}
                className="login-button"
            >
                Login with Spotify
            </button>
        </div>
    );
}