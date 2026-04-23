import gsap from "gsap";
import { Container } from "pixi.js";
import SpritesheetAnimation from "../core/SpritesheetAnimation";

import Keyboard from "../core/Keyboard";

enum Directions {
  LEFT = -1,
  RIGHT = 1,
}

type AnimState = {
  anim: string;
  soundName?: string;
  loop?: boolean;
  speed?: number;
};

/**
 * Example class showcasing the usage of animations
 */
export class Character extends Container {

  anim: SpritesheetAnimation;

  static animStates: Record<string, AnimState> = {
    idle: {
      anim: "idle",
      loop: true,
      speed: 0.3,
    },
    jump: {
      anim: "jump",
      soundName: "jump",
      loop: false,
      speed: 0.5,
    },
    walk: {
      anim: "walk",
      loop: true,
      speed: 1,
    }
  };

  config = {
    speed: 10,
    turnDuration: 0.15,
    decelerateDuration: 0.1,
    scale: 1,
    jump: {
      height: 300,
      duration: 0.3,
      ease: "sine",
    }
  };

  jumping = false;
  walking = false;

  velocity = {
    x: 0,
    y: 0,
  };

  private decelerationTween?: gsap.core.Tween;

  constructor() {
    super();

    this.anim = new SpritesheetAnimation("wizard");

    this.addChild(this.anim);

    this.anim.play(Character.animStates.idle);
  }

  public onActionPress(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case "LEFT":
        this.move(Directions.LEFT);
        break;
      case "RIGHT":
        this.move(Directions.RIGHT);
        break;
      case "JUMP":
        this.jump();
        break;

      default:
        break;
    }
  }

  public onActionRelease(action: keyof typeof Keyboard.actions) {
    if (
      (action === "LEFT" && this.velocity.x < 0) ||
      (action === "RIGHT" && this.velocity.x > 0)
    ) {
      this.stopMovement();
    }
  }

  stopMovement() {
    this.decelerationTween?.progress(1);
    this.walking = false;
    this.decelerationTween = gsap.to(this.velocity, {
      duration: this.config.decelerateDuration,
      x: 0,
      ease: "power1.in",
      onComplete: () => {
        this.anim.play(Character.animStates.idle);
      },
    });
  }

  async move(direction: Directions) {
    this.walking = true;
    this.decelerationTween?.progress(1);

    this.velocity.x = direction * this.config.speed;
    this.anim.play(Character.animStates.walk);

    gsap.to(this.scale, {
      duration: this.config.turnDuration,
      x: this.config.scale * direction,
    });
  }

  async jump() {
    if (this.jumping) return;

    const { height, duration, ease } = this.config.jump;

    this.jumping = true;
    this.anim.play(Character.animStates.jump);

    await gsap.to(this, {
      duration,
      y: `-=${height}`,
      ease: `${ease}.out`,
      yoyo: true,
      yoyoEase: `${ease}.in`,
      repeat: 1,
    });

    this.jumping = false;
    if (this.walking) this.anim.play(Character.animStates.walk);
  }
}
