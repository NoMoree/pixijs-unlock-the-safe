# Unlock the Safe - PixiJS Mini Game

A small web game where you crack a vault safe by entering a random combination. Built with PixiJS v8, GSAP, and TypeScript. The project follows a state‑machine and block pattern (inspired by slot‑machine architecture) to keep the code clean and testable.

## How to play

- The safe starts **closed**.
- A secret combination is printed in the browser console (example: `2 CW → 7 CCW → 5 CW`).
- Turn the handle left (CCW) or right (CW) using:
  - **Click/tap** on the left/right half of the screen,
  - **Keyboard** `←` / `A` (left) and `→` / `D` (right).
- Each correct step rotates the handle by 60°.
- After completing all pairs **in the right order**, the door opens with a smooth horizontal animation, treasure appears with a glitter effect, and the timer stops.
- If you make a mistake, the handle spins wildly, a new code is generated, and the timer resets.

## Features

- **Fully responsive** - scales with window size (reference resolution 2400×1108).
- **Timer** - counts seconds from the moment a new code is shown; resets on error or after a successful unlock.
- **Handle shadow** - rotates with the handle during normal play, but stays upright and shrinks when the door opens/closes.
- **No `setTimeout`/`setInterval`** - all delays use GSAP promises.
- **State + Block pattern** - the game is split into `SetupState`, `GamePlayState`, `WinSequenceState`; each state runs a chain of `Block`s (asset loading, door open, treasure shine, reset, etc.).
- **All settings in one place** - `PIXI_CONFIG.ts` holds door offsets, animation durations, password rules, timer position, and shine parameters.

## Install & run

```bash
npm install
npm run start
```

- The game will open at http://localhost:3000.

## Build

```bash
npm run build
```

## Project structure (simplified)

- `src/GAME.ts` - global app, state machine, event bus.
- `src/PIXI_CONFIG.ts` - central configuration.
- `src/prefabs/SafeDoor.ts` - door + handle with all animations.
- `src/structure/` - state abstract class, Block abstract class, concrete states and blocks.
- `src/game/models/` - game state (combination, timer).
- `src/utils/` - helpers for scaling, combination generation, debugging.

## Credits

- Pixi.js for rendering, GSAP for buttery animations.
- The Pixi minimal boilerplate gave a good starting point.
- The block‑state idea came from a previous slot‑machine project (cleaned up for this safe game).

## Notes
- You can find game requirements in [GameRequirements.md](./GameRequirements.md)
- 👉 [fork of DreamShotTask/pixi-minimal](https://github.com/DreamShotTask/pixi-minimal/) which is  [fork of Hafaux's neat](https://github.com/Hafaux/pixi-framework) (feats scene management and Spine animations)

---
---
# Enjoy cracking the safe!
---
---
