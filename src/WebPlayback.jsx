import React, { useState, useEffect } from 'react';
import './App.css';

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-black to-black">
                <div className="bg-white bg-opacity-80 rounded-2xl px-8 py-6 shadow-xl">
                    <b className="text-lg text-gray-800">
                        Transferring playback... your web player should appear in Spotify Connect shortly.
                    </b>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-black to-black p-4">
            <div className="w-full max-w-md bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl flex flex-col items-center p-6 space-y-6">
                {current_track.album.images[0].url && (
                    <img
                        src={current_track.album.images[0].url}
                        alt="Album cover"
                        className="rounded-xl w-64 h-64 object-cover shadow-lg"
                    />
                )}
                <div className="w-full text-center">
                    <div className="text-2xl font-bold text-white truncate">{current_track.name || <span className="text-white">No Track</span>}</div>
                    <div className="text-lg text-white truncate">{current_track.artists[0].name || <span className="text-white">No Artist</span>}</div>
                </div>
                <div className="flex justify-center gap-6 w-full">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-2 px-6 rounded-full shadow transition"
                        onClick={() => { player.previousTrack(); }}
                        aria-label="Previous Track"
                    >
                        &#60;&#60;
                    </button>
                    <button
                        className={`${
                            is_paused ? "bg-green-700 hover:bg-green-800" : "bg-green-500 hover:bg-green-600"
                        } text-white text-2xl font-bold py-2 px-8 rounded-full shadow transition`}
                        onClick={() => { player.togglePlay(); }}
                        aria-label={is_paused ? "Play" : "Pause"}
                    >
                        {is_paused ? "PLAY" : "PAUSE"}
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-2 px-6 rounded-full shadow transition"
                        onClick={() => { player.nextTrack(); }}
                        aria-label="Next Track"
                    >
                        &#62;&#62;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WebPlayback;