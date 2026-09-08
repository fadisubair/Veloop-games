import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEconomy } from '../context/EconomyContext';
import type { GameConfig } from '../data/gamesConfig';
import Modal from '../components/Modal';
import { AlertCircle } from 'lucide-react';

export const useGameEntry = () => {
  const navigate = useNavigate();
  const { state, deductTokens } = useEconomy();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startGame = (game: GameConfig) => {
    if (!game.playable || isProcessing) return;
    setIsProcessing(true);

    const success = deductTokens(game.entryCost);

    if (success) {
      // Small timeout to allow state to sync and prevent double clicking
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/play/${game.id}`);
      }, 50);
    } else {
      setSelectedGame(game);
      setShowErrorModal(true);
      setIsProcessing(false);
    }
  };

  const renderErrorModal = () => (
    <Modal 
      isOpen={showErrorModal} 
      onClose={() => setShowErrorModal(false)}
      title="Insufficient Tokens"
    >
      <div className="error-modal-content" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--color-danger)', marginBottom: '0.5rem' }} />
        <p>You need <strong>{selectedGame?.entryCost} Tokens</strong> to play this game.</p>
        <p style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', width: '100%' }}>
          Current balance: <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{state.tokens} Tokens</span>
        </p>
        
        <div style={{ marginTop: '1rem', width: '100%' }}>
          <button 
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }} 
            onClick={() => setShowErrorModal(false)}
          >
            Okay
          </button>
        </div>
      </div>
    </Modal>
  );

  return { startGame, renderErrorModal, isProcessing };
};
