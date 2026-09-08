import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2, Gift, User } from 'lucide-react';
import './BottomNavigation.css';

const BottomNavigation: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container container">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/games" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Gamepad2 size={24} />
          <span>Games</span>
        </NavLink>
        <NavLink to="/rewards" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Gift size={24} />
          <span>Rewards</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNavigation;
