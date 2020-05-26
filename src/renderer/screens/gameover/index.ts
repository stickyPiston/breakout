import { Container, Text, Rect } from "asdf-games";
import { SceneManager } from "../../scenemanager";
import { keys } from "../../constants";
import { Score } from "../../utils/score";

export class GameOverScene extends Container<Text | Rect | Score> {
  private period = 0.75;

  private constructor() {
    super();

    // Add black background
    const bg = new Rect(800, 400, { fill: "#000" });
    this.add(bg);

    // Add Game over title
    const gameOverText = new Text("GAME OVER!", { font: "48px forced", fill: "#fff" });
    gameOverText.pos = { x: 263, y: 100 };
    this.add(gameOverText);

    // Add instructions
    const pressSpace = new Text("Press SPACE to return", { font: "24px forced", fill: "#fff" });
    pressSpace.pos = { x: 270, y: 350 };
    this.add(pressSpace);

		this.add(Score.getInstance());
  }

  static getInstance() {
    return new GameOverScene();
  }

  update = (dt: number, t: number) => {
    super.update(dt, t);

    // If the space bar is pressed, continue to the next scene.
    if (keys.action) {
      keys.reset();
      SceneManager.getInstance().setScene(0);
    }

    // Periodically toggle text
    this.period -= dt;

    if (this.period <= 0) {
      (this.children[2] as Text).style.fill = "#000";
      if (this.period <= -0.75) this.period = 0.75;
    } else {
      (this.children[2] as Text).style.fill = "#fff";
    }
  }
}
