import React from 'react';
import { useEconomy } from '../context/EconomyContext';
import { User, Settings, LogOut, Award } from 'lucide-react';

const Profile: React.FC = () => {
  const { addTokens } = useEconomy();

  const getDailyReward = () => {
    addTokens(50);
    alert('You received 50 daily tokens!');
  };

  return (
    <div className="profile-page page-container animate-fade-in container">
      <div className="page-header">
        <h1 className="page-title text-gradient">Player Profile</h1>
      </div>

      <div className="profile-content max-w-2xl mx-auto">
        <div className="glass-panel p-6 rounded-xl text-center mb-6" style={{ padding: '2rem' }}>
          <div className="mx-auto w-24 h-24 bg-tertiary rounded-full flex items-center justify-center mb-4 border border-border" style={{ margin: '0 auto', width: '96px', height: '96px', borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid var(--color-border)' }}>
            <User size={48} className="text-secondary" />
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Guest Player</h2>
          <p className="text-secondary mb-4" style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>ID: VEL-83921</p>
          
          <div className="flex justify-center gap-4 mt-6" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={getDailyReward}>
              <Award size={18} />
              Claim Daily Tokens
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl" style={{ padding: '2rem' }}>
          <h3 className="text-xl font-bold mb-4 border-b border-border pb-2" style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Account Actions</h3>
          <div className="flex flex-col gap-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-secondary w-full justify-start" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Settings size={18} />
              Settings
            </button>
            <button className="btn btn-secondary w-full justify-start text-danger" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-danger)' }}>
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
