import { Rect, entity, Sound, math } from "asdf-games";
import { Player } from "./player";
import { ScoreHelper } from "./helpers/score";
import { Lives } from "./helpers/lives";
import { Level } from "./helpers/level";
import { SceneManager } from "../../scenemanager";
import { PowerupManager } from "./helpers/powerup";
import { Blocks } from "./blocks";
import { Multiplayer } from "./helpers/multiplayer";
import { SettingsScene } from "../settings/index";

function playSound() {
  const index = Math.round(math.randf(1, 8));
  new Sound(
		`./res/sound/bleep_${index}.wav`,
		{ volume: SettingsScene.getInstance().get("volume") }
	).play();
}

export class Ball extends Rect {
  private static instance: Ball;

  private angle = 1 / 4 * Math.PI;
  speed = 200;
  pos = { x: 600, y: 340 };

	reset() {
    this.speed = 200 + Level.getInstance().getLevel() * 10;
		this.angle = 1/4 * Math.PI;
	}

  private constructor(/*paddle: Player, blocks: Container<Rect>*/) {
    super(10, 10, { fill: "#fff" });
  }

  static getInstance() {
    if (!Ball.instance) Ball.instance = new Ball();
    return Ball.instance;
  }

  update(dt: number) {
    if (Player.getInstance().released) {
			// TODO: Add improved ball physics
      const futurePos = {
        pos: {
          x: this.pos.x + Math.cos(this.angle) * this.speed * dt,
          y: this.pos.y + Math.sin(this.angle) * this.speed * dt
        },
        w: this.w,
        h: this.h
      };

      // Check if the ball hits the walls
      if (futurePos.pos.x <= 0) { // Left wall
        this.angle = 3 * Math.PI - this.angle;
        playSound();
      }

      if (futurePos.pos.x >= 790) { // Right wall
        this.angle = Math.PI - this.angle;
        playSound();
      }

      if (futurePos.pos.y >= 390) { // Bottom wall
        this.angle = 2 * Math.PI - this.angle;
        this.speed = 200;
        Player.getInstance().released = false;
        this.pos.y = 340;
        this.angle = 1 / 4 * Math.PI;

        new Sound(
					"./res/sound/death.wav",			
					{ volume: SettingsScene.getInstance().get("volume") }
				).play();
      
        if (Lives.getInstance().deductLife() === 0) {
					if (Multiplayer.getInstance().enabled) {
						Multiplayer.getInstance().onDone();
						Player.getInstance().disabled = true;
					} else SceneManager.getInstance().setScene(2);
        }
      }

      if (futurePos.pos.y <= 0) { // Top wall
        this.angle = 2 * Math.PI - this.angle;
        playSound();
      }

      // Check if ball hits paddle
      if (entity.hit(futurePos, Player.getInstance())) {
        this.angle = 2 * Math.PI - this.angle;
        playSound();
      }

      // Check if ball hits a block
      entity.hits(futurePos, Blocks.getInstance(), block => {
        this.angle = 2 * Math.PI - this.angle;
        // @ts-ignore
        block.dead = true;
        ScoreHelper.getInstance().addScore(100 * Level.getInstance().getLevel());
        this.speed += 10 * Level.getInstance().getLevel();
        PowerupManager.getInstance().generatePowerup(block.pos);
        playSound();
      });

      if (Player.getInstance().released) this.pos.x = futurePos.pos.x;
      if (Player.getInstance().released) this.pos.y = futurePos.pos.y;

      this.speed += dt * 5 + 2 * Level.getInstance().getLevel() * dt;

    } else { // Not released
      this.pos.x = Player.getInstance().pos.x + Player.getInstance().w / 2;
      this.pos.y = 340;
    }
  }
}
