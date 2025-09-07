export default async function handler(req, res) {
    const { access_token, refresh_token } = req.cookies;

    if (!refresh_token) {
        return res.status(401).json({ error: "No refresh token" });
    }

    // If access token exists, just return it
    if (access_token) {
        return res.json({ access_token });
    }

    // Otherwise, refresh
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
                ).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    const data = await response.json();

    if (data.error) {
        return res.status(400).json({ error: data.error_description });
    }

    // Save new access token cookie
    res.setHeader(
        "Set-Cookie",
        `access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    res.json({ access_token: data.access_token });
}
