import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      setToken(accessToken);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  return <>{token === '' ? <Login /> : <WebPlayback token={token} />}</>;
}

export default App;
