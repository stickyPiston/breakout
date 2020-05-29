import { Rect, Sound, math } from "asdf-games";
import { Player } from "./player";
import { ScoreHelper } from "./helpers/score";
import { Level } from "./helpers/level";
import { PowerupManager } from "./helpers/powerup";
import { Blocks } from "./blocks";
import { SettingsScene } from "../settings/index";

function playSound() {
  const index = Math.round(math.randf(1, 8));
  new Sound(
		`./res/sound/bleep_${index}.wav`,
		{ volume: SettingsScene.getInstance().get("volume") }
	).play();
}

export class Ball extends Rect {
  private angle = Math.PI + 3 / 4 * Math.PI;
	private lastHitItem!: "paddle" | "wall" | "block";
	private lastHitTime = Date.now();
  speed = 200;

  pos = { x: 600, y: 200 };

  constructor() {
    super(10, 10, { fill: "#fff" });
  }

	reset() {
		this.angle = Math.PI + 3 / 4 * Math.PI;
	}

  update(dt: number) {
    if (Player.getInstance().released) {

      const futurePos = {
				x: this.pos.x + Math.cos(this.angle) * this.speed * dt,
				y: this.pos.y + Math.sin(this.angle) * this.speed * dt
      };

			const paddle = Player.getInstance();
			const yb = futurePos.y;
			const yp = paddle.pos.y;
			const hb = this.h;
			const wb = this.w;
			const xb = futurePos.x;
			const xp = paddle.pos.x;
			const hp = paddle.h;
			const wp = paddle.w;
			const wl = 800;
			const hl = 400;

      // Check if the ball hits the walls
      if (xb <= 0) { // Left wall
        this.angle = 3 * Math.PI - this.angle;
				this.pos.x = 0;
				console.log(this.angle / Math.PI);
        playSound();
      }

      if (xb >= wl - wb) { // Right wall
        this.angle = Math.PI - this.angle;
				if (this.angle < 0) this.angle = 2 * Math.PI + this.angle;
				this.pos.x = wl - 1;
				console.log(this.angle / Math.PI);
        playSound();
      }

      if (yb >= hl - hb) { // Bottom wall
        this.angle = 2 * Math.PI - this.angle;
        this.speed = 200;

        new Sound(
					"./res/sound/death.wav",			
					{ volume: SettingsScene.getInstance().get("volume") }
				).play();
				// @ts-ignore
				this.dead = true;
      }

      if (yb <= 0) { // Top wall
				if (Date.now() - this.lastHitTime > 100 || this.lastHitItem !== "wall") {
					this.angle = 2 * Math.PI - this.angle;
					this.lastHitItem = "wall";
					this.lastHitTime = Date.now();
					console.log(this.angle / Math.PI);
					playSound();
				}
      }

      // Check if ball hits paddle

			function checkHit(ball: Ball, xp: number, yp: number, hp: number, wp: number, hitPlayer: boolean) {
				let hit = false;

				const lastAngle = ball.angle;

				// Top bound
				if (yb <= yp && yb + hb >= yp && xb + wb >= xp && xb + wb <= xp + wp) {
					const posOnPaddle = xb - xp;

					if (hitPlayer && posOnPaddle < 35) ball.angle = ball.angle + 5 / 6 * Math.PI;
					else if (hitPlayer && posOnPaddle > 90)	ball.angle = ball.angle + 5 / 6 * Math.PI;
					else ball.angle = 2 * Math.PI - ball.angle;

					hit = true;
				} else if (xb <= xp && xb + wb >= xp && yb + hb >= yp && yb + hb <= yp + hp) {
					ball.angle = Math.PI - ball.angle;
					hit = true;
				} else if (yb <= yp + hp && yb + hb >= yp + hp && xb >= xp && xb <= xp + wp) {
					ball.angle = 2 * Math.PI - ball.angle;
					hit = true;
				} else if (xb <= xp + wp && xb + wb >= xp + wp && yb + hb >= yp && yb + hb <= yp + hp) {
					ball.angle = 3 * Math.PI - ball.angle;
					hit = true;
				}

				if (hit) {
					playSound();

					if (ball.angle > 2) ball.angle -= 2 * Math.PI;
					if (ball.angle < 0) ball.angle += 2 * Math.PI;

					if (Date.now() - ball.lastHitTime < 1000 && hitPlayer) {
						if (ball.lastHitItem === "paddle") ball.angle = lastAngle;
					}

					if (hitPlayer && ball.angle < Math.PI) ball.angle += 1 / 2 * Math.PI; 

					console.log(ball.angle / Math.PI);

					ball.lastHitItem = hitPlayer ? "paddle" : "block";
					ball.lastHitTime = Date.now();

					return true;
				} else {
					return false;
				}
			}

			checkHit(this, xp, yp, hp, wp, true);

			Blocks.getInstance().children.forEach(block => {
				if (checkHit(this, block.pos.x, block.pos.y, block.h, block.w, false)) {
					// @ts-ignore
					block.dead = true;
					ScoreHelper.getInstance().addScore(100 * Level.getInstance().getLevel());
					this.speed += 10 * Level.getInstance().getLevel();
					PowerupManager.getInstance().generatePowerup(block.pos);
				}
			});

      if (paddle.released) this.pos.x = futurePos.x;
      if (paddle.released) this.pos.y = futurePos.y;

      this.speed += dt * 5 + 2 * Level.getInstance().getLevel() * dt;

    } else { // Not released
      this.pos.x = Player.getInstance().pos.x + Player.getInstance().w / 2;
      this.pos.y = 340;
    }
  }
}
