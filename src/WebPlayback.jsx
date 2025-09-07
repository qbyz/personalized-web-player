import React, { useState, useEffect } from 'react';

const track = {
    name: "",
    album: {
        images: [{ url: "" }]
    },
    artists: [{ name: "" }]
};

function WebPlayback(props) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', async ({ device_id }) => {
                console.log('Ready with Device ID', device_id);

                // Auto-transfer playback to this device
                await fetch('https://api.spotify.com/v1/me/player', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${props.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        device_ids: [device_id],
                        play: true
                    })
                });
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', state => {
                if (!state) return;

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    setActive(!!state);
                });
            });

            player.connect();
        };
    }, [props.token]);

    if (!is_active) {
        return (
            <div className="container">
                <div className="main-wrapper">
                    <b>Instance not active. Transferring playback...</b>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <div className="main-wrapper">
                    <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>

                        <button className="btn-spotify" onClick={() => { player.previousTrack(); }}>&lt;&lt;</button>
                        <button className="btn-spotify" onClick={() => { player.togglePlay(); }}>{is_paused ? "PLAY" : "PAUSE"}</button>
                        <button className="btn-spotify" onClick={() => { player.nextTrack(); }}>&gt;&gt;</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default WebPlayback;
