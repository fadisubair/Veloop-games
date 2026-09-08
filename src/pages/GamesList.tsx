import React from 'react';
import { gamesConfig } from '../data/gamesConfig';
import GameCard from '../components/GameCard';
import './GamesList.css';

const GamesList: React.FC = () => {
  return (
    <div className="games-page page-container animate-fade-in container">
      <div className="page-header">
        <h1 className="page-title text-gradient">All Games</h1>
        <p className="page-subtitle">Discover our collection of exciting games.</p>
      </div>
      
      <div className="games-grid">
        {gamesConfig.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};

export default GamesList;
