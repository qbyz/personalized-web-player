function Login() {
    const handleLogin = () => {
        window.location.href = "/api/login";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-black">
            <button
                onClick={handleLogin}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-3xl text-2xl shadow-lg transition"
            >
                Login with Spotify
            </button>
        </div>
    );
}

export default Login;