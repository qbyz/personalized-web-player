function Login() {
    const handleLogin = () => {
        window.location.href = "/api/auth/login";
    };

    return (
        <div className="login">
            <button onClick={handleLogin}>Login with Spotify</button>
        </div>
    );
}

export default Login;
