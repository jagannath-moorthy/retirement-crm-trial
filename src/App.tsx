


import Navigation from './components/Navigation';
import CommunityManager from './components/CommunityManager';
import ClientManager from './components/ClientManager';
import ClientDetails from './components/ClientDetails';
import CommunityDetails from './components/CommunityDetails';


import { useState } from 'react';

function App() {
  const [view, setView] = useState('home');
  const [clientDetailsId, setClientDetailsId] = useState<string | null>(null);
  const [communityDetailsId, setCommunityDetailsId] = useState<string | null>(null);

  // Simple menu handler for demo; in a real app, use React Router
  const handleNav = (key: string) => {
    setView(key);
    setClientDetailsId(null);
  };

  // Handler to show client details page
  const handleShowClientDetails = (id: string) => {
    setClientDetailsId(id);
    setView('clientdetails');
  };

  // Handler to show community details page
  const handleShowCommunityDetails = (id: string) => {
    setCommunityDetailsId(id);
    setView('communitydetails');
  };

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
          <ClientManager onShowDetails={handleShowClientDetails} />
        ) : view === 'clientdetails' && clientDetailsId ? (
          <ClientDetails id={clientDetailsId} onBack={() => handleNav('client')} onShowCommunityDetails={handleShowCommunityDetails} />
        ) : view === 'communitydetails' && communityDetailsId ? (
          <CommunityDetails id={communityDetailsId} onBack={() => handleNav('clientdetails')} />
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
