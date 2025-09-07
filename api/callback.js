import request from 'request';

export default function handler(req, res) {
    const code = req.query.code || null;

    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            grant_type: 'authorization_code',
        },
        headers: {
            Authorization:
                'Basic ' +
                Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID +
                    ':' +
                    process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        json: true,
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.redirect('/?access_token=' + body.access_token);
        } else {
            res.status(400).json({ error: 'Token exchange failed' });
        }
    });
}
