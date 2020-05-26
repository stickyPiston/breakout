import { Container, Coordinates, Rect, math, entity, Sound } from "asdf-games";
import { Player } from "../player";
import { Blocks } from "../blocks";
import { Ball } from "../ball";
import { Lives } from "./lives";
import { ScoreHelper } from "./score";
import { Background } from "../background";
import { SettingsScene } from "../../settings/index";

export class PowerupManager extends Container<Rect> {
  private static instance: PowerupManager;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!PowerupManager.instance) PowerupManager.instance = new PowerupManager();
    return PowerupManager.instance;
  }

  resetPowerups() {
    this.children = [];
  }

  generatePowerup(pos: Coordinates) {
    if (math.randOneIn(9)) {  
      const powerup = new Powerup();
      powerup.pos = { x: pos.x + 12, y: pos.y };
      this.add(powerup);
    }
  }
}

export class Powerup extends Rect {
  type: string;

  constructor() {
    super(25, 10, { fill: "#fff" });
    this.type = math.randOneFrom(["long", "small", "delBlock", "life", "fasterBall", "slowerBall"]);
  }

  private powerupEffect() {
		// TODO: Add revert controls powerup
		// TODO: Add mini powerup against opponent in multiplayer.
    if (this.type === "long") Player.getInstance().w = 150;
    if (this.type === "small") Player.getInstance().w = 50;
    // @ts-ignore
    if (this.type === "delBlock") math.randOneFrom(Blocks.getInstance().children).dead = true;
    if (this.type === "life") Lives.getInstance().addLife();
    if (this.type === "fasterBall") Ball.getInstance().speed += 150;
    if (this.type === "slowerBall") Ball.getInstance().speed = 250;
  }

  update(dt: number) {
    this.pos.y += dt * 150;

    if (entity.hit(this, Player.getInstance())) {
      // @ts-ignore
      this.dead = true;
      new Sound(
				"./res/sound/powerup.wav",
				{ volume: SettingsScene.getInstance().get("volume") }
			).play();
			ScoreHelper.getInstance().addScore(50);
      Background.getInstance().setColor("#fff");
      this.powerupEffect();
    }
  }
}
