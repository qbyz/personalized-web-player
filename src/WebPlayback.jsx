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
        const setAppHeight = () => {
            document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
        };
        setAppHeight();
        window.addEventListener('resize', setAppHeight);
        return () => window.removeEventListener('resize', setAppHeight);
    }, []);


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
            <div className="h-[var(--app-height)] flex items-center justify-center bg-gradient-to-br from-green-400 via-black to-black">
                <div className="bg-cardbg bg-opacity-80 rounded-2xl px-8 py-6 shadow-xl">
                    <b className="text-lg text-white">
                        Transferring playback... your web player should appear in Spotify Connect shortly.
                    </b>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[var(--app-height)]  flex items-center justify-center bg-gradient-to-br from-green-400 via-black to-black p-4">
            <div className="w-full max-w-md bg-cardbg bg-opacity-90 rounded-2xl shadow-2xl flex flex-col items-center p-6 space-y-6">
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
                <div className="flex justify-center gap-3 w-full">
                    <button
                        className="bg-green-500 hover:bg-hovergreen text-white text-2xl font-bold py-2 px-6 rounded-full shadow transition"
                        onClick={() => { player.previousTrack(); }}
                        aria-label="Previous Track"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-8 h-8">
                            <polygon points="14,16 26,27 26,5" fill="#243642" opacity="0.7"/>
                            <polygon points="6,16 18,27 18,5" fill="#243642"/>
                        </svg>
                    </button>
                    <button
                        className={`${
                            is_paused ? "bg-green-700 hover:bg-hovergreen" : "bg-green-500 hover:bg-hovergreen"
                        } text-cardbg text-2xl font-bold py-2 px-8 rounded-full shadow transition`}
                        onClick={() => { player.togglePlay(); }}
                        aria-label={is_paused ? "Play" : "Pause"}
                    >
                        {is_paused ? "PLAY" : "PAUSE"}
                    </button>
                    <button
                        className="bg-green-500 hover:bg-hovergreen text-white text-2xl font-bold py-2 px-6 rounded-full shadow transition"
                        onClick={() => { player.nextTrack(); }}
                        aria-label="Next Track"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-8 h-8">
                            <polygon points="18,16 6,5 6,27" fill="#243642" opacity="0.7"/>
                            <polygon points="26,16 14,5 14,27" fill="#243642"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default WebPlayback;