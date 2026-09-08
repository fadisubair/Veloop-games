import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEconomy } from '../../context/EconomyContext';
import Modal from '../../components/Modal';
import './BlockCrush.css';

const GRID_SIZE = 8;
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const TARGET_SCORE = 1500;
const REVIVE_COST = 5; // 5 Gems for revive

interface Block {
  x: number;
  y: number;
  color: string;
  id: string;
}

const BlockCrush: React.FC = () => {
  const navigate = useNavigate();
  const { state, deductReward, addGameCoins } = useEconomy();
  
  const [grid, setGrid] = useState<(Block | null)[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(0);

  // Initialize game
  const initializeGrid = useCallback(() => {
    const newGrid: (Block | null)[][] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      newGrid[x] = [];
      for (let y = 0; y < GRID_SIZE; y++) {
        newGrid[x][y] = {
          x,
          y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          id: `${x}-${y}-${Math.random()}`
        };
      }
    }
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setVictory(false);
    setShowReviveModal(false);
    setShowResultModal(false);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  // Check for valid moves
  const hasValidMoves = useCallback((currentGrid: (Block | null)[][]) => {
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        const block = currentGrid[x][y];
        if (!block) continue;
        
        // Check right
        if (x + 1 < GRID_SIZE && currentGrid[x+1][y]?.color === block.color) return true;
        // Check bottom
        if (y + 1 < GRID_SIZE && currentGrid[x][y+1]?.color === block.color) return true;
      }
    }
    return false;
  }, []);

  // Handle block click
  const handleBlockClick = (x: number, y: number) => {
    if (gameOver || victory || showReviveModal || showResultModal) return;
    
    const block = grid[x][y];
    if (!block) return;

    const blocksToRemove = getAdjacentBlocks(x, y, block.color, grid, new Set());
    
    if (blocksToRemove.size > 1) {
      // Calculate score (n * n * 10)
      const moveScore = blocksToRemove.size * blocksToRemove.size * 10;
      setScore(prev => prev + moveScore);
      
      const newGrid = [...grid.map(col => [...col])];
      
      // Remove blocks
      blocksToRemove.forEach(coord => {
        const [cx, cy] = coord.split('-').map(Number);
        newGrid[cx][cy] = null;
      });
      
      // Gravity (blocks fall down)
      for (let col = 0; col < GRID_SIZE; col++) {
        const columnBlocks = newGrid[col].filter(b => b !== null) as Block[];
        const newColumn = new Array(GRID_SIZE).fill(null);
        // Fill from bottom
        for (let i = 0; i < columnBlocks.length; i++) {
          const b = columnBlocks[columnBlocks.length - 1 - i];
          b.y = GRID_SIZE - 1 - i;
          newColumn[GRID_SIZE - 1 - i] = b;
        }
        newGrid[col] = newColumn;
      }
      
      // Shift left if empty column
      let emptyCols = 0;
      for (let col = 0; col < GRID_SIZE - emptyCols; col++) {
        const isEmpty = newGrid[col].every(b => b === null);
        if (isEmpty) {
          // Shift all remaining columns left
          for (let shift = col; shift < GRID_SIZE - 1; shift++) {
            newGrid[shift] = newGrid[shift + 1];
            // Update x coordinates
            newGrid[shift].forEach(b => { if (b) b.x = shift; });
          }
          // Empty the last column
          newGrid[GRID_SIZE - 1] = new Array(GRID_SIZE).fill(null);
          col--; // Re-check this column
          emptyCols++;
        }
      }

      setGrid(newGrid);
      
      // Check win/loss
      if (score + moveScore >= TARGET_SCORE) {
        setVictory(true);
        handleGameEnd(true);
      } else if (!hasValidMoves(newGrid)) {
        setGameOver(true);
        setTimeout(() => setShowReviveModal(true), 500);
      }
    }
  };

  const getAdjacentBlocks = (x: number, y: number, color: string, currentGrid: (Block | null)[][], visited: Set<string>): Set<string> => {
    const key = `${x}-${y}`;
    if (visited.has(key)) return visited;
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return visited;
    
    const block = currentGrid[x][y];
    if (!block || block.color !== color) return visited;
    
    visited.add(key);
    
    getAdjacentBlocks(x + 1, y, color, currentGrid, visited);
    getAdjacentBlocks(x - 1, y, color, currentGrid, visited);
    getAdjacentBlocks(x, y + 1, color, currentGrid, visited);
    getAdjacentBlocks(x, y - 1, color, currentGrid, visited);
    
    return visited;
  };

  const handleRevive = () => {
    const success = deductReward('gems', REVIVE_COST);
    if (success) {
      setShowReviveModal(false);
      setGameOver(false);
      // Spawn some new random blocks at the bottom to allow continuing
      const newGrid = [...grid.map(col => [...col])];
      let blocksAdded = false;
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!newGrid[x][GRID_SIZE - 1]) {
           newGrid[x][GRID_SIZE - 1] = {
             x,
             y: GRID_SIZE - 1,
             color: COLORS[Math.floor(Math.random() * COLORS.length)],
             id: `revive-${x}-${Math.random()}`
           };
           blocksAdded = true;
        }
      }
      // If the bottom row was full but game over, replace a random block
      if (!blocksAdded) {
         const rx = Math.floor(Math.random() * GRID_SIZE);
         const ry = Math.floor(Math.random() * GRID_SIZE);
         if (newGrid[rx][ry]) {
            newGrid[rx][ry]!.color = COLORS[Math.floor(Math.random() * COLORS.length)];
         }
      }
      setGrid(newGrid);
    } else {
      alert("Not enough Gems to revive!");
    }
  };

  const handleNoThanks = () => {
    setShowReviveModal(false);
    handleGameEnd(false);
  };

  const handleGameEnd = (isVictory: boolean) => {
    // Base reward based on score
    const reward = Math.floor(score / 50) + (isVictory ? 100 : 0);
    setRewardEarned(reward);
    addGameCoins(reward);
    setShowResultModal(true);
  };

  return (
    <div className="block-crush-game">
      <div className="game-header">
        <button className="btn-back" onClick={() => navigate(-1)}>&larr; Back</button>
        <div className="game-stats">
          <div className="score-box">
            <span className="score-label">SCORE</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="target-box">
            <span className="score-label">TARGET</span>
            <span className="score-value">{TARGET_SCORE}</span>
          </div>
        </div>
      </div>
      
      <div className="game-board-container">
        <div className="game-board">
          {grid.map((column, x) => (
            column.map((block, y) => (
              block ? (
                <div
                  key={block.id}
                  className="game-block"
                  style={{
                    backgroundColor: block.color,
                    left: `${(x / GRID_SIZE) * 100}%`,
                    top: `${(y / GRID_SIZE) * 100}%`,
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`
                  }}
                  onClick={() => handleBlockClick(x, y)}
                >
                  <div className="block-inner"></div>
                </div>
              ) : null
            ))
          ))}
        </div>
      </div>

      <Modal isOpen={showReviveModal} onClose={handleNoThanks} title="Game Over" hideCloseBtn={true}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No more moves!</h2>
          <p className="mb-6 text-secondary">Your Score: <span className="text-primary font-bold">{score}</span></p>
          
          <div className="revive-box mb-6 p-4 bg-tertiary rounded-lg border border-border">
            <p className="mb-2">Continue playing?</p>
            <div className="flex items-center justify-center gap-2 text-xl font-bold">
              Cost: <span className="text-accent">{REVIVE_COST} Gems</span>
            </div>
            <p className="text-sm text-secondary mt-2">You have {state.gems} Gems</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="btn btn-primary w-full py-3" onClick={handleRevive}>
              REVIVE
            </button>
            <button className="btn btn-secondary w-full" onClick={handleNoThanks}>
              NO THANKS
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showResultModal} onClose={() => navigate('/games')} title="Game Result" hideCloseBtn={true}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold mb-2 ${victory ? 'text-success' : 'text-primary'}`}>
            {victory ? 'VICTORY!' : 'WELL PLAYED'}
          </h2>
          <p className="mb-6 text-xl">Final Score: <strong>{score}</strong></p>
          
          <div className="reward-box mb-6 p-6 glass-panel flex flex-col items-center">
            <span className="text-secondary mb-2">You earned</span>
            <div className="text-4xl font-bold text-warning mb-2">+{rewardEarned}</div>
            <span className="font-bold">Game Coins</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="btn btn-primary w-full" onClick={initializeGrid}>
              PLAY AGAIN
            </button>
            <button className="btn btn-secondary w-full" onClick={() => navigate('/games')}>
              BACK TO GAMES
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlockCrush;
