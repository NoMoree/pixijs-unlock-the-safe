import config from "../config";
import ParallaxBackground from "../prefabs/ParallaxBackground";
import { Character } from "../prefabs/Character";
import { Container, Text, Graphics } from "pixi.js";
import { centerObjects } from "../utils/misc";
import Keyboard from "../core/Keyboard";
import { SceneUtils } from "../core/App";

export default class Game extends Container {
  name = "Game";

  private keyboard = Keyboard.getInstance();

  private character!: Character;
  private background!: ParallaxBackground;

  constructor(protected utils: SceneUtils) {
    super();
  }

  async load() {

    // example use of Pixi Graphics
    const bg = new Graphics().beginFill(0x0b1354).drawRect(0, 0, window.innerWidth, window.innerHeight)

    // example use of Pixi Text
    const text = new Text("Loading...", {
      fontFamily: "Verdana",
      fontSize: 50,
      fill: "white",
    });
    text.resolution = 2;

    // example use of utils functions
    centerObjects(text);

    this.addChild(bg, text);

    await this.utils.assetLoader.loadAssets();

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === "pressed") this.onActionPress(action);
      else if (buttonState === "released") this.onActionRelease(action);
    });
  }

  async start() {
    this.removeChildren();

    this.background = new ParallaxBackground(config.backgrounds.forest);
    this.character = new Character();

    this.character.x = window.innerWidth / 2;
    this.character.y = window.innerHeight - this.character.height / 3;

    this.addChild(this.background, this.character);
  }

  /**
   * Called on every ticker update
   * @param delta 
   */
  update(delta: number) {
    // just some example update logic, reposition paralax background to character
    const x = this.character.velocity.x * delta;
    const y = this.character.velocity.y * delta;
    this.background.updatePosition(x, y);
  }

  /**
   * Called on resize of scene
   * @param width 
   * @param height 
   */
  onResize(width: number, height: number) {
    // resize handling logic here
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
    this.character.onActionPress(action);
  }

  onActionRelease(action: keyof typeof Keyboard.actions) {
    this.character.onActionRelease(action);
  }
}
