import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gamesConfig } from '../data/gamesConfig';
import { useGameEntry } from '../hooks/useGameEntry';
import { useEconomy } from '../context/EconomyContext';
import { Target, Coins } from 'lucide-react';
import './GameDetail.css';

const GameDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useEconomy();
  const { startGame, renderErrorModal, isProcessing } = useGameEntry();
  
  const game = gamesConfig.find(g => g.id === id);

  if (!game) {
    return (
      <div className="page-container container text-center">
        <h2>Game not found</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/games')}>
          Back to Games
        </button>
      </div>
    );
  }

  const handlePlay = () => {
    if (game.playable) {
      startGame(game);
    }
  };

  return (
    <div className="game-detail-page page-container animate-fade-in container">
      <div className="game-detail-content glass-panel">
        <div className="game-detail-image-wrapper">
          <img src={game.image} alt={game.title} className="game-detail-image" />
          <div className="category-badge">{game.category}</div>
          {!game.playable && <div className="coming-soon-overlay">Coming Soon</div>}
        </div>
        
        <div className="game-detail-info">
          <h1 className="game-title text-gradient">{game.title}</h1>
          <p className="game-desc">{game.description}</p>
          
          <div className="game-meta">
            <div className="meta-item">
              <span className="meta-label">Entry Cost</span>
              <div className="meta-value tokens">
                <Target size={18} />
                <span>{game.entryCost} Tokens</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-label">Your Game Coins</span>
              <div className="meta-value coins">
                <Coins size={18} />
                <span>{state.gameCoins}</span>
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-label">Reward</span>
              <div className="meta-value coins">
                <span>Game Coins</span>
              </div>
            </div>
          </div>
          
          <div className="how-to-play">
            <h3>How to Play</h3>
            {game.id === 'block-crush' ? (
              <p>Tap groups of 2 or more adjacent blocks of the same color to crush them. Clear as many blocks as you can to score high!</p>
            ) : game.id === 'bubble-blast' ? (
              <p>Tap the grid to shoot bubbles. Match 3 or more of the same color to blast them. Clear the board to win!</p>
            ) : (
              <p>Check back later for detailed instructions when the game is released.</p>
            )}
          </div>
          
          <div className="game-actions">
            <button 
              className={`btn btn-primary play-btn ${!game.playable ? 'disabled' : ''}`} 
              onClick={handlePlay}
              disabled={!game.playable || isProcessing}
            >
              {game.playable ? 'PLAY NOW' : 'COMING SOON'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/games')}>
              Back
            </button>
          </div>
        </div>
      </div>
      
      {renderErrorModal()}
    </div>
  );
};

export default GameDetail;
