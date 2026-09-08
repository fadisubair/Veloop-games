import React, { useRef, useState, useEffect } from 'react';
import GameCard from './GameCard';
import type { GameConfig } from '../data/gamesConfig';
import './GameCarousel.css';

interface GameCarouselProps {
  games: GameConfig[];
  title?: string;
}

const GameCarousel: React.FC<GameCarouselProps> = ({ games, title }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll and dot indicator logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollPosition = carousel.scrollLeft;
      const itemWidth = carousel.clientWidth > 768 ? 320 : 280;
      const gap = 24; // 1.5rem gap
      const newIndex = Math.round(scrollPosition / (itemWidth + gap));
      setCurrentIndex(newIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isHovered || isDragging) return;

    const interval = setInterval(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      const itemWidth = carousel.clientWidth > 768 ? 320 : 280;
      const gap = 24;
      const totalScrollableWidth = carousel.scrollWidth - carousel.clientWidth;

      if (carousel.scrollLeft >= totalScrollableWidth - 10) {
        // Back to start
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll next
        carousel.scrollBy({ left: itemWidth + gap, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, isDragging]);

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHasMoved(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="game-carousel-section">
      {title && <h2 className="section-title container">{title}</h2>}
      <div 
        className={`carousel-container ${isDragging ? 'dragging' : ''}`}
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={() => { handleMouseLeave(); setIsHovered(false); }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClickCapture={handleClickCapture}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <div className="carousel-track">
          {games.map(game => (
            <div key={game.id} className="carousel-item">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-dots">
        {games.map((_, index) => (
          <div 
            key={index} 
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              const carousel = carouselRef.current;
              if (carousel) {
                const itemWidth = carousel.clientWidth > 768 ? 320 : 280;
                const gap = 24;
                carousel.scrollTo({ left: index * (itemWidth + gap), behavior: 'smooth' });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default GameCarousel;
