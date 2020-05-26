import { Text } from "asdf-games";

export class ScoreHelper extends Text {
  private static instance: ScoreHelper;

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

  static getInstance() {
    if (!ScoreHelper.instance) ScoreHelper.instance = new ScoreHelper();
    return ScoreHelper.instance;
  }

  update = () => {
    this.text = `SCORE: ${this.score}`;
  }
}
