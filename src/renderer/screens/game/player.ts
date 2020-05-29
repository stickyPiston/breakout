import { Rect } from "asdf-games";
import { keys } from "../../constants"

export class Player extends Rect {
  private static instance: Player;

  private speed = 750;
  pos = { x: 0, y: 350 };

  released = false;
	disabled = false;
	reverted = false;

  private constructor() {
    super(125, 10, { fill: "#fff" });
  }

  static getInstance() {
    if (!Player.instance) Player.instance = new Player();
    return Player.instance;
  }

	revertControls() {
		this.reverted = !this.reverted;
	}

  update(dt: number) {
    if (!this.released && !this.disabled && keys.action) this.released = true;

    if (keys.x !== 0 && !this.disabled) {
      const futurePos = this.pos.x + (this.reverted ? -1 : 1) * keys.x * dt * this.speed;
      this.pos.x = futurePos <= 805 - this.w && futurePos >= -5 ? futurePos : this.pos.x;
    }
  }
}
