import React from 'react';
import { useNavigate } from 'react-router-dom';

import { gamesConfig } from '../data/gamesConfig';
import GameCarousel from '../components/GameCarousel';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const playableGames = gamesConfig.filter(g => g.playable);
  const otherGames = gamesConfig.filter(g => !g.playable).slice(0, 5);

  return (
    <div className="home-page page-container animate-fade-in">
      <section className="hero-section container">
        <div className="hero-content glass-panel">
          <h1 className="hero-title text-gradient">Play, Win, Redeem!</h1>
          <p className="hero-subtitle">
            Welcome back to Veloop Games. Play exciting games, earn Game Coins, and redeem awesome rewards!
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('/games')}>
              Explore Games
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/rewards')}>
              View Rewards
            </button>
          </div>
        </div>
      </section>

      <GameCarousel games={playableGames} title="Playable Now" />
      <GameCarousel games={otherGames} title="Coming Soon" />
    </div>
  );
};

export default Home;
