import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function fetchToken() {
      const res = await fetch('/api/token');
      const data = await res.json();
      if (data.access_token) setToken(data.access_token);
    }
    fetchToken();
  }, []);

  return <>{token === '' ? <Login /> : <WebPlayback token={token} />}</>;
}

export default App;