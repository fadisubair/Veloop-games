import React from 'react';
import { useEconomy } from '../context/EconomyContext';
import { User, Coins, Target } from 'lucide-react';
import './TopBar.css';

const TopBar: React.FC = () => {
  const { state } = useEconomy();

  return (
    <header className="top-bar">
      <div className="top-bar-container container">
        <div className="top-bar-logo">
          <div className="logo-icon">V</div>
          <span className="logo-text">Veloop Games</span>
        </div>
        
        <div className="top-bar-stats">
          <div className="stat-pill tokens-pill" title="Tokens">
            <Target size={16} className="stat-icon" />
            <span>{state.tokens}</span>
          </div>
          <div className="stat-pill coins-pill" title="Game Coins">
            <Coins size={16} className="stat-icon" />
            <span>{state.gameCoins}</span>
          </div>
          <div className="profile-btn">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
