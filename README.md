# Snake Game v2.00

A modern, retro-inspired Snake game built with vanilla JavaScript and Canvas API. Features smooth animations, immersive audio, and a polished user interface inspired by the classic Nokia Snake experience.

**[Play Live Demo](https://definitelyavi.github.io/snake-game-v2.00)**

## Features

- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes with varying speeds
- **Smooth Animations**: Keyframe-based animations for snake movement and visual effects
- **Retro Audio System**: Background music and sound effects with volume controls
- **Responsive Design**: Canvas-based rendering with adaptive UI
- **Score Persistence**: High score tracking using localStorage
- **Game State Management**: Comprehensive game over conditions and restart functionality

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Graphics**: Canvas API for 2D rendering
- **Audio**: Howler.js for cross-browser audio management
- **Storage**: localStorage for persistent data
- **Styling**: Custom CSS with VT323 retro font

## Architecture

```
├── assets/
│   ├── images/          # Sprite assets and UI elements
│   └── sounds/          # Audio files for game effects
├── scripts/
│   └── game.js          # Core game logic and rendering
├── styles/
│   └── main.css         # Retro styling and responsive design
└── index.html           # Game structure and canvas setup
```

## Game Mechanics

The game implements classic Snake mechanics with modern enhancements including collision detection, score calculation, and progressive difficulty scaling. The rendering system uses efficient canvas operations for smooth 60fps gameplay.

## Quick Start

```bash
git clone https://github.com/definitelyavi/snake-game-v2.00.git
cd snake-game-v2.00
# Open index.html in your browser or serve with a local server
```

## Author

**Jashandeep Singh** [@definitelyavi](https://github.com/definitelyavi)

---

*Classic gameplay meets modern web development*
