


import Navigation from './components/Navigation';
import CommunityManager from './components/CommunityManager';
import ClientManager from './components/ClientManager';


import { useState } from 'react';

function App() {
  const [view, setView] = useState('home');

  // Simple menu handler for demo; in a real app, use React Router
  const handleNav = (key: string) => setView(key);

  return (
    <>
      <Navigation />
      <main className="container">
        <nav className="mb-4">
          <button className="btn btn-outline-primary me-2" onClick={() => handleNav('community')}>Communities</button>
          <button className="btn btn-outline-success me-2" onClick={() => handleNav('client')}>Clients</button>
          <button className="btn btn-outline-secondary me-2" onClick={() => handleNav('home')}>Home</button>
        </nav>
        {view === 'community' ? (
          <CommunityManager />
        ) : view === 'client' ? (
          <ClientManager />
        ) : (
          <>
            <h2>Welcome to the Retirement Community CRM</h2>
            <p>Select a menu item to get started.</p>
          </>
        )}
      </main>
    </>
  );
}

export default App;
