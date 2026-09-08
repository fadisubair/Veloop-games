import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar';
import BottomNavigation from './components/BottomNavigation';
import Home from './pages/Home';
import GamesList from './pages/GamesList';
import GameDetail from './pages/GameDetail';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import BlockCrush from './games/block-crush/BlockCrush';
import BubbleBlast from './games/bubble-blast/BubbleBlast';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <TopBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/play/block-crush" element={<BlockCrush />} />
          <Route path="/play/bubble-blast" element={<BubbleBlast />} />
        </Routes>
      </main>
      <BottomNavigation />
    </>
  );
};

export default App;
