# Veloop Games Platform

A complete, fully functional, and responsive React application featuring a centralized gaming economy, game catalog, and interactive playable games.

## Features

- **13 Game Catalog**: A beautifully designed showcase of 13 games with distinct categories, artwork, and playable status.
- **2 Fully Playable Games**: 
  - **Block Crush**: A dynamic block matching grid puzzle with gravity mechanics.
  - **Bubble Blast Legend**: A vertical bubble shooter chain-reaction puzzle.
- **Centralized Economy**: 
  - Uses React Context API (`EconomyContext`) to maintain a single source of truth for all currencies (Tokens, Game Coins, Gems, VEs, SVEs, Spins).
  - State is automatically persisted to `localStorage` ensuring balances survive page reloads.
- **Game Entry System**: 
  - Gated access requiring exactly 20 Tokens per game.
  - Insufficient funds correctly trigger a warning modal without navigating or double-charging.
- **Revive System**: 
  - Running out of moves triggers a "Revive" modal costing Gems, allowing users to spend premium currency to continue gameplay.
- **Game Coin Rewards & Redemption**: 
  - Completing games rewards the user with Game Coins based on their score.
  - The centralized Rewards Center allows converting Game Coins into other currencies.
- **Highly Responsive UI**: 
  - Sleek dark-mode interface built with CSS Grid/Flexbox, working flawlessly from 320px up to 1920px.
  - Features an interactive auto-scrolling game carousel with touch/mouse-drag support.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables for theming)
- **Routing**: React Router DOM (`react-router-dom`)
- **Icons**: Lucide React (`lucide-react`)

## Installation & Setup

1. **Clone or Download the Repository**
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
4. **Access the Platform:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## How to Test the Complete End-to-End Flow

1. **Start on Home:** Notice your starting Token balance (100) and Game Coin balance (0).
2. **Browse:** Click the "Play" button on **Block Crush** in the Playable Now carousel.
3. **Entry Validation:** Watch your token balance instantly deduct 20 Tokens (now 80).
4. **Play:** Interact with the Block Crush board to score points until no valid moves remain.
5. **Revive:** Choose to spend 5 Gems to revive and continue playing.
6. **Finish:** Run out of moves again and click "No Thanks" to finalize the match.
7. **Reward:** See your final score and the calculated Game Coin reward.
8. **Redeem:** Navigate to the Rewards tab and convert your newly earned Game Coins into VEs, Tokens, or Spins!

## Project Architecture & Assets

All supplied artwork is mapped correctly via `src/data/gamesConfig.ts` and loaded directly from `/public/pictures/Games/`. No placeholders or dummy images were used. 

## Building for Production

To create a highly optimized, minified production build:
```bash
npm run build
```
The output will be placed in the `dist/` directory, ready to be served by any static web host.
