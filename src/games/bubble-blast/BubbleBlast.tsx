import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEconomy } from '../../context/EconomyContext';
import Modal from '../../components/Modal';
import './BubbleBlast.css';

const COLS = 8;
const ROWS = 10;
const START_ROWS = 4;
const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
const TARGET_SCORE = 2000;
const REVIVE_COST = 10;

interface Bubble {
  x: number;
  y: number;
  color: string;
  id: string;
}

const BubbleBlast: React.FC = () => {
  const navigate = useNavigate();
  const { deductReward, addGameCoins } = useEconomy();
  
  const [grid, setGrid] = useState<(Bubble | null)[][]>([]);
  const [currentBubble, setCurrentBubble] = useState<string>(COLORS[0]);
  const [nextBubble, setNextBubble] = useState<string>(COLORS[1]);
  
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(30);
  
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [rewardEarned, setRewardEarned] = useState(0);
  const [isShooting, setIsShooting] = useState(false);

  const initializeGame = useCallback(() => {
    const newGrid: (Bubble | null)[][] = Array(COLS).fill(null).map(() => Array(ROWS).fill(null));
    
    for (let y = 0; y < START_ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        newGrid[x][y] = {
          x,
          y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          id: `bubble-${x}-${y}-${Math.random()}`
        };
      }
    }
    
    setGrid(newGrid);
    setCurrentBubble(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setNextBubble(COLORS[Math.floor(Math.random() * COLORS.length)]);
    setScore(0);
    setMoves(30);
    setGameOver(false);
    setVictory(false);
    setShowReviveModal(false);
    setShowResultModal(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleColumnClick = (colIndex: number) => {
    if (gameOver || victory || isShooting || moves <= 0) return;
    
    setIsShooting(true);
    
    // Find the lowest empty spot in this column
    let targetY = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (grid[colIndex][y] !== null) {
        targetY = y + 1;
        break;
      }
    }
    
    // If column is full, can't shoot here
    if (targetY >= ROWS) {
      setIsShooting(false);
      return;
    }
    
    // Simulate shooting delay
    setTimeout(() => {
      const newGrid = [...grid.map(col => [...col])];
      const newBubble: Bubble = {
        x: colIndex,
        y: targetY,
        color: currentBubble,
        id: `bubble-${colIndex}-${targetY}-${Math.random()}`
      };
      
      newGrid[colIndex][targetY] = newBubble;
      
      // Check for matches
      const matchSet = new Set<string>();
      findMatches(colIndex, targetY, currentBubble, newGrid, matchSet);
      
      let moveScore = 0;
      
      if (matchSet.size >= 3) {
        // Pop matches
        matchSet.forEach(coord => {
          const [cx, cy] = coord.split('-').map(Number);
          newGrid[cx][cy] = null;
        });
        
        moveScore += matchSet.size * 20;
        
        // Remove floating bubbles
        const connectedSet = new Set<string>();
        for (let x = 0; x < COLS; x++) {
          if (newGrid[x][0]) {
            findConnected(x, 0, newGrid, connectedSet);
          }
        }
        
        let droppedCount = 0;
        for (let x = 0; x < COLS; x++) {
          for (let y = 0; y < ROWS; y++) {
            if (newGrid[x][y] && !connectedSet.has(`${x}-${y}`)) {
              newGrid[x][y] = null; // Drop it
              droppedCount++;
            }
          }
        }
        
        if (droppedCount > 0) {
           moveScore += droppedCount * 50; // Bonus for drops
        }
      }
      
      setGrid(newGrid);
      setScore(prev => prev + moveScore);
      setMoves(prev => prev - 1);
      
      // Setup next turn
      setCurrentBubble(nextBubble);
      setNextBubble(COLORS[Math.floor(Math.random() * COLORS.length)]);
      setIsShooting(false);
      
      // Check win/loss
      const currentScore = score + moveScore;
      
      // Check if grid is cleared
      const isCleared = newGrid.every(col => col.every(cell => cell === null));
      
      if (currentScore >= TARGET_SCORE || isCleared) {
        setVictory(true);
        setTimeout(() => handleGameEnd(true), 500);
      } else if (moves - 1 <= 0 || targetY >= ROWS - 1) { // Out of moves or reached bottom
        setGameOver(true);
        setTimeout(() => setShowReviveModal(true), 500);
      }
      
    }, 150); // 150ms animation delay
  };

  const findMatches = (x: number, y: number, color: string, currentGrid: (Bubble | null)[][], visited: Set<string>) => {
    const key = `${x}-${y}`;
    if (visited.has(key)) return;
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
    
    const bubble = currentGrid[x][y];
    if (!bubble || bubble.color !== color) return;
    
    visited.add(key);
    
    // Check 4 directions
    findMatches(x + 1, y, color, currentGrid, visited);
    findMatches(x - 1, y, color, currentGrid, visited);
    findMatches(x, y + 1, color, currentGrid, visited);
    findMatches(x, y - 1, color, currentGrid, visited);
  };

  const findConnected = (x: number, y: number, currentGrid: (Bubble | null)[][], visited: Set<string>) => {
    const key = `${x}-${y}`;
    if (visited.has(key)) return;
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
    
    const bubble = currentGrid[x][y];
    if (!bubble) return;
    
    visited.add(key);
    
    findConnected(x + 1, y, currentGrid, visited);
    findConnected(x - 1, y, currentGrid, visited);
    findConnected(x, y + 1, currentGrid, visited);
    findConnected(x, y - 1, currentGrid, visited);
  };

  const handleRevive = () => {
    const success = deductReward('gems', REVIVE_COST);
    if (success) {
      setShowReviveModal(false);
      setGameOver(false);
      setMoves(prev => prev + 15); // Give 15 more moves
      
      // Clear bottom 3 rows if they are full
      const newGrid = [...grid.map(col => [...col])];
      for (let x = 0; x < COLS; x++) {
        for (let y = ROWS - 3; y < ROWS; y++) {
          newGrid[x][y] = null;
        }
      }
      setGrid(newGrid);
    } else {
      alert("Not enough Gems to revive!");
    }
  };

  const handleGameEnd = (isVictory: boolean) => {
    const reward = Math.floor(score / 40) + (isVictory ? 150 : 0);
    setRewardEarned(reward);
    addGameCoins(reward);
    setShowResultModal(true);
  };

  return (
    <div className="bubble-blast-game">
      <div className="game-header">
        <button className="btn-back" onClick={() => navigate(-1)}>&larr; Back</button>
        <div className="game-stats">
          <div className="score-box">
            <span className="score-label">MOVES</span>
            <span className="score-value text-accent">{moves}</span>
          </div>
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
        <div className="bubble-board">
          {/* Columns for clicking */}
          <div className="board-columns">
            {Array(COLS).fill(0).map((_, i) => (
              <div 
                key={i} 
                className="board-column" 
                onClick={() => handleColumnClick(i)}
              />
            ))}
          </div>
          
          {/* Bubbles */}
          {grid.map((column, x) => (
            column.map((bubble, y) => (
              bubble ? (
                <div
                  key={bubble.id}
                  className="bubble"
                  style={{
                    backgroundColor: bubble.color,
                    left: `${(x / COLS) * 100}%`,
                    top: `${(y / ROWS) * 100}%`,
                    width: `${100 / COLS}%`,
                    height: `${100 / ROWS}%`
                  }}
                >
                  <div className="bubble-inner" />
                </div>
              ) : null
            ))
          ))}
        </div>
      </div>
      
      <div className="shooter-area">
        <div className="shooter-container">
          <div className="next-bubble">
             <div className="bubble-preview" style={{ backgroundColor: nextBubble }} />
             <span className="next-label">NEXT</span>
          </div>
          <div className="current-bubble">
             <div className="bubble-preview main" style={{ backgroundColor: currentBubble }} />
             <span className="next-label text-primary">SHOOT</span>
          </div>
        </div>
      </div>

      <Modal isOpen={showReviveModal} onClose={() => handleGameEnd(false)} title="Game Over" hideCloseBtn={true}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Out of moves!</h2>
          <p className="mb-6 text-secondary">Your Score: <span className="text-primary font-bold">{score}</span></p>
          
          <div className="revive-box mb-6 p-4 bg-tertiary rounded-lg border border-border">
            <p className="mb-2">Get 15 more moves?</p>
            <div className="flex items-center justify-center gap-2 text-xl font-bold">
              Cost: <span className="text-accent">{REVIVE_COST} Gems</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="btn btn-primary w-full py-3" onClick={handleRevive}>
              REVIVE (+15 Moves)
            </button>
            <button className="btn btn-secondary w-full" onClick={() => handleGameEnd(false)}>
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
            <button className="btn btn-primary w-full" onClick={initializeGame}>
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

export default BubbleBlast;
