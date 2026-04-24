# Unlock the Safe Mini Game 
## Front-end game develope


## Using the assets provided here create a mini game in which the player has to unlock a vault safe in order to get the treasure inside.

1. The game begins with the vault door closed.
1. A random secret combination is logged in the browser console. The secret combination is a set of 3 pairs.
Each pair is a number between 1 and 9 and an alternating CW / CCW (clockwise / counterclockwise) direction.
-For example: "2 CW, 7 CCW, 5 CW". 1 means a displacement of 1 position, i.e. 60°.
1. The player can interact with the handle of the safe. You can decide how the player interacts, for example by
clicking on the left/right side of the safe, or some other way. Every interaction should cause the handle to react
and rotate by 60° with animation.
1. If the player enters the combination correctly - the safe unlocks. The door vault opens to the side and the
treasure is revealed. There is a small glitter animation over the treasure with a shine effect. After 5 seconds the
door closes and the game restarts.
1. If the player makes an error entering the secret combination - the game resets and the vault handle "spins
like crazy" several rotations. A new code is generated and the user has to start from the beginning

## Requirement
- Use [PIXI.js](https://github.com/pixijs/pixijs) (preferably version 7 or later) and [GSAP](https://gsap.com/)
- Use Typescript
- Apply an Object Oriented Programming approach.
- The game has to be responsive in different screen resolutions
- Use async await, don't use setTimeout and setInterva

## Bonus point
- Your repository must have at least 5 commits in it
- The handle has a shadow, which spins along with the vault handle.
- Add a counter on the left hand side in the keypad, indicating how much time
it took to unlock the safe. The counter should reset every time a new secret
code is generated

## Task submissio
- Your project must be public either on GitHub, Gitlab or Bitbucket.
- Your commit message convention follows the [Conventional Commit
standard](www.conventionalcommits.org/en) and your branches must be kebab case.
- Your project must contain a README.md file in the root folder that contains
instructions on installing, running and building your project

## Tip
- Read carefully through the task
twice before starting
- You can use a [PIXI boilerplate](https://github.com/DreamShotTask/pixi-minimal)
project if you like. Here is one that
can save you loads of time 😎
- The GSAP API returns promise-like
functions that can be awaited.
Time how much time the task took
you.
- Don't hesitate to ask us if you run
into issues.
- Good luck and have fun!