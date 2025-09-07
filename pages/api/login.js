export default function handler(req, res) {
    const generateRandomString = (length) => {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    const state = generateRandomString(16);
    const scope = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: process.env.REDIRECT_URI,
        state,
    });

    res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
}
