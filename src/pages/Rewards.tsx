import React, { useState } from 'react';
import { useEconomy } from '../context/EconomyContext';
import Modal from '../components/Modal';
import { Coins, AlertCircle, CheckCircle } from 'lucide-react';
import './Rewards.css';

const rewardItems = [
  { id: '100-tokens', name: '100 Tokens', type: 'tokens', amount: 100, cost: 500, image: '/pictures/Games/multi_token.jpeg' },
  { id: '50-gems', name: '50 Gems', type: 'gems', amount: 50, cost: 1000, image: '/pictures/Games/multi_gems.jpeg' },
  { id: '10-ves', name: '10 VEs', type: 'ves', amount: 10, cost: 2000, image: '/pictures/Games/multi_VEs.jpeg' },
  { id: '5-sves', name: '5 SVEs', type: 'sves', amount: 5, cost: 5000, image: '/pictures/Games/multi_SVEs.jpeg' },
  { id: '3-spins', name: '3 Spins', type: 'spins', amount: 3, cost: 300, image: '/pictures/Games/signle_spin.jpeg' },
];

const Rewards: React.FC = () => {
  const { state, deductGameCoins, addReward } = useEconomy();
  const [selectedReward, setSelectedReward] = useState<typeof rewardItems[0] | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRedeemClick = (reward: typeof rewardItems[0]) => {
    setSelectedReward(reward);
    setShowConfirmModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;
    
    const success = deductGameCoins(selectedReward.cost);
    
    if (success) {
      addReward(selectedReward.type as any, selectedReward.amount);
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
    
    setShowConfirmModal(false);
    setShowResultModal(true);
  };

  return (
    <div className="rewards-page page-container animate-fade-in container">
      <div className="page-header">
        <h1 className="page-title text-gradient">Rewards Center</h1>
        <p className="page-subtitle">Exchange your Game Coins for premium rewards!</p>
      </div>

      <div className="balances-section glass-panel">
        <div className="balance-item main-balance">
          <Coins size={32} className="balance-icon text-warning" />
          <div className="balance-info">
            <span className="balance-label">Your Game Coins</span>
            <span className="balance-value">{state.gameCoins}</span>
          </div>
        </div>
        <div className="other-balances">
          <div className="mini-balance">Tokens: <span>{state.tokens}</span></div>
          <div className="mini-balance">Gems: <span>{state.gems}</span></div>
          <div className="mini-balance">VEs: <span>{state.ves}</span></div>
          <div className="mini-balance">SVEs: <span>{state.sves}</span></div>
          <div className="mini-balance">Spins: <span>{state.spins}</span></div>
        </div>
      </div>

      <div className="rewards-grid">
        {rewardItems.map(reward => (
          <div key={reward.id} className="reward-card glass-panel">
            <div className="reward-image-wrapper">
              <img src={reward.image} alt={reward.name} />
            </div>
            <div className="reward-content">
              <h3 className="reward-name">{reward.name}</h3>
              <div className="reward-cost">
                <Coins size={16} className="text-warning" />
                <span>{reward.cost} Coins</span>
              </div>
              <button 
                className={`btn w-full ${state.gameCoins >= reward.cost ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleRedeemClick(reward)}
              >
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      <Modal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Redemption"
      >
        {selectedReward && (
          <div className="text-center">
            <p className="mb-4">Are you sure you want to redeem <strong>{selectedReward.name}</strong> for <strong>{selectedReward.cost} Game Coins</strong>?</p>
            <div className="modal-actions grid-2">
              <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirmRedeem}>Confirm</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Result Modal */}
      <Modal 
        isOpen={showResultModal} 
        onClose={() => setShowResultModal(false)}
        title={isSuccess ? "Success!" : "Redemption Failed"}
      >
        <div className="error-modal-content">
          {isSuccess ? (
            <>
              <CheckCircle size={48} className="text-success mb-2" />
              <p>You successfully redeemed <strong>{selectedReward?.name}</strong>!</p>
              <p className="current-balance">New Balance: <span>{state.gameCoins} Coins</span></p>
            </>
          ) : (
            <>
              <AlertCircle size={48} className="text-danger mb-2" />
              <p>You do not have enough Game Coins.</p>
              <div className="insufficient-details mt-4">
                <p>Required: <strong>{selectedReward?.cost}</strong></p>
                <p>You have: <strong>{state.gameCoins}</strong></p>
              </div>
            </>
          )}
          <div className="modal-actions mt-4 w-full">
            <button className="btn btn-primary w-full" onClick={() => setShowResultModal(false)}>
              Okay
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Rewards;
