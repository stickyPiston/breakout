import { Text } from "asdf-games";

export class Score extends Text {
  private static instance: Score
  pos = {
    x: 300,
    y: 20
  }

  private score = 0;

  private constructor() {
    super("SCORE: 0", { font: "20px forced", fill: "#fff" });
  }

  addScore(points: number) {
    this.score += points;
  }

  getScore() {
    return this.score;
  }

	resetScore() {
		this.score = 0;
	}

  static getInstance(): Score {
    if (!Score.instance) {
      Score.instance = new Score();
    }

    return Score.instance;
  }

  update = () => {
    this.text = `SCORE: ${this.score}`;
  }
}
