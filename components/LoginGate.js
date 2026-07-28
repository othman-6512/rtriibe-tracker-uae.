'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'rtriibe-ops-unlocked';

export default function LoginGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setUnlocked(true);
    }
    setChecked(true);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_BOARD_PASSWORD;
    if (pw === expected) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setUnlocked(true);
      setErr('');
    } else {
      setErr('Wrong password — try again.');
    }
  }

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="login-wrap">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="mark">r</div>
          <h1>rTriibe Tracker UAE</h1>
          <p>Enter the shared desk password to open the tracker.</p>
          {err && <div className="login-err">{err}</div>}
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
          <button type="submit">Unlock</button>
        </form>
      </div>
    );
  }

  return children({
    logout: () => {
      sessionStorage.removeItem(SESSION_KEY);
      setUnlocked(false);
    },
  });
}
