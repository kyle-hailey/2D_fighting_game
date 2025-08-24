# 2D Fighting Game

A browser-based 2D fighting game built with Phaser 3.

## Features

- Local multiplayer (2 players)
- Basic character movement (walk, jump, attack)
- Health system with cooldowns
- Simple hit detection
- Customizable sprites and backgrounds

## Controls

### Player 1 (Left Side)
- Left Arrow: Move Left
- Right Arrow: Move Right
- Up Arrow: Jump
- Space: Attack

### Player 2 (Right Side)
- A: Move Left
- D: Move Right
- W: Jump
- Space: Attack

## Project Structure

```
2D fighting game/
├── index.html       # Main HTML file
├── game.js          # Game logic
├── assets/          # Game assets (sprites, backgrounds)
└── package.json     # Project dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## Development

The game uses Phaser 3 for game development and Socket.io for multiplayer functionality (to be implemented).

## Assets

You'll need to create or obtain the following assets:
- Character sprites (32x64 pixels)
- Background images
- Animation frames for idle, walk, attack, and hit states

## Next Steps

1. Implement character selection system
2. Add more attack animations and combos
3. Implement cooldown system for different attacks
4. Add character-specific abilities
5. Implement online multiplayer functionality
6. Add sound effects and music
7. Create a character selection screen
8. Add victory/defeat screens
