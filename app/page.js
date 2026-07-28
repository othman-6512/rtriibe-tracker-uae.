'use client';

import LoginGate from '../components/LoginGate';
import Board from '../components/Board';

export default function Page() {
  return <LoginGate>{({ logout }) => <Board onLogout={logout} />}</LoginGate>;
}
