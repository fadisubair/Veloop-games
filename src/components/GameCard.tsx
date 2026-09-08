import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameConfig } from '../data/gamesConfig';
import { Target } from 'lucide-react';
import { useGameEntry } from '../hooks/useGameEntry';
import './GameCard.css';

interface GameCardProps {
  game: GameConfig;
  featured?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, featured = false }) => {
  const navigate = useNavigate();
  const { startGame, renderErrorModal, isProcessing } = useGameEntry();

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click navigation
    if (game.playable) {
      startGame(game);
    } else {
      navigate(`/games/${game.id}`);
    }
  };

  return (
    <div 
      className={`game-card ${featured ? 'featured' : ''}`}
      onClick={() => navigate(`/games/${game.id}`)}
    >
      <div className="game-card-image">
        <img src={game.image} alt={game.title} loading="lazy" />
        {!game.playable && (
          <div className="coming-soon-badge">Coming Soon</div>
        )}
        <div className="category-badge">{game.category}</div>
      </div>
      
      <div className="game-card-content">
        <h3 className="game-title">{game.title}</h3>
        <p className="game-desc">{game.description}</p>
        
        <div className="game-card-footer">
          <div className="entry-cost">
            <Target size={14} className="cost-icon" />
            <span>{game.entryCost}</span>
          </div>
          <button 
            className={`btn-play ${game.playable ? 'active' : 'disabled'}`}
            onClick={handlePlayClick}
            disabled={isProcessing}
          >
            {game.playable ? 'Play' : 'Details'}
          </button>
        </div>
      </div>
      {renderErrorModal()}
    </div>
  );
};

export default GameCard;
