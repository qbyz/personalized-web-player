export default async function handler(req, res) {
    const code = req.query.code || null;

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
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.REDIRECT_URI,
        }),
    });

    const data = await response.json();

    if (data.error) {
        return res.status(400).json({ error: data.error_description });
    }

    // Store tokens in cookies (for simplicity)
    res.setHeader("Set-Cookie", [
        `access_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        `refresh_token=${data.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
    ]);

    // Redirect back to home (frontend will call /api/auth/token next)
    res.redirect("/");
}
