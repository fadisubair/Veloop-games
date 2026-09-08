export interface GameConfig {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  playable: boolean;
  entryCost: number;
}

export const gamesConfig: GameConfig[] = [
  {
    id: "blade-master",
    title: "Blade Master",
    description: "Master your blades and conquer the enemies in this action-packed adventure.",
    category: "Action",
    image: "/pictures/Games/1.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "nutcraft",
    title: "Nutcraft",
    description: "Gather resources and craft your way to survival in the nutty wilderness.",
    category: "Strategy",
    image: "/pictures/Games/2.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "bowlex",
    title: "Bowlex",
    description: "Strike down the pins in this exciting bowling simulation.",
    category: "Sports",
    image: "/pictures/Games/3.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "block-crush",
    title: "Block Crush",
    description: "Match and crush blocks to clear the board and achieve high scores!",
    category: "Puzzle",
    image: "/pictures/Games/4.jpeg",
    playable: true,
    entryCost: 20,
  },
  {
    id: "slice-storm",
    title: "Slice Storm",
    description: "Slice through obstacles and enemies in a fast-paced storm of blades.",
    category: "Arcade",
    image: "/pictures/Games/5.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "cosmo-warrior",
    title: "Cosmo Warrior",
    description: "Defend the galaxy against alien invaders in epic space battles.",
    category: "Shooter",
    image: "/pictures/Games/6.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "toilet-tactics",
    title: "Toilet Tactics",
    description: "Defend your base in this hilarious strategic defense game.",
    category: "Strategy",
    image: "/pictures/Games/7.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "word-hunt",
    title: "Word Hunt",
    description: "Find hidden words and expand your vocabulary in this brain teaser.",
    category: "Puzzle",
    image: "/pictures/Games/8.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "bubble-blast",
    title: "Bubble Blast Legend",
    description: "Pop bubbles and clear the screen in this legendary matching game.",
    category: "Puzzle",
    image: "/pictures/Games/9.jpeg",
    playable: true,
    entryCost: 20,
  },
  {
    id: "merge-master",
    title: "Merge Master",
    description: "Merge items to create powerful new objects and solve puzzles.",
    category: "Puzzle",
    image: "/pictures/Games/10.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "wormzy",
    title: "Wormzy",
    description: "Grow your worm and dominate the arena in this classic snake-like game.",
    category: "Arcade",
    image: "/pictures/Games/11.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "aqua-fill",
    title: "Aqua Fill",
    description: "Solve fluid dynamics puzzles to fill the containers perfectly.",
    category: "Puzzle",
    image: "/pictures/Games/12.jpeg",
    playable: false,
    entryCost: 20,
  },
  {
    id: "realm-clash",
    title: "Realm Clash",
    description: "Build your army and clash with rival realms in epic fantasy battles.",
    category: "Strategy",
    image: "/pictures/Games/13.jpeg",
    playable: false,
    entryCost: 20,
  },
];
