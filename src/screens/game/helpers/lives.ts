import { Text } from "asdf-games";

export class Lives extends Text {
  private static instance: Lives
  pos = {
    x: 10,
    y: 20
  }

  private lives = 2;

  private constructor() {
    super("LIVES: 2", { font: "20px forced", fill: "#fff" });
  }

  deductLife() {
    this.lives--;
    return this.lives;
  }

  addLife() {
    this.lives++;
    return this.lives;
  }

	getLives() {
		return this.lives;
	}

	setLives(lives: number) {
		this.lives = lives;
	}

  static getInstance(): Lives {
    if (!Lives.instance) {
      Lives.instance = new Lives();
    }

    return Lives.instance;
  }

  update = () => {
    this.text = `LIVES: ${this.lives}`;
  }
}
