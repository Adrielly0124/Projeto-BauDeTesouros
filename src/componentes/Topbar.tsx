import React from 'react';
import logo from '../assets/logo.png';

export default function Topbar() {
  return (
    <header className="bt-topbar">
      <div className="bt-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={logo} alt="Baú de Tesouros" style={{ height: '50px' }} />
      </div>

    </header>
  );
}
