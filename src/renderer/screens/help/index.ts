import { Container, Text, Rect } from "asdf-games";
import { SceneManager } from "../../scenemanager";
import { keys } from "../../constants";

export class HelpScene extends Container<Text | Rect> {
  private static instance: HelpScene;
  private period = 0.75;

  private constructor() {
    super();

    // Add black background
    const bg = new Rect(800, 400, { fill: "#000" });
    this.add(bg);

    const aim = new Text("The aim of the game is to break all blocks.", { font: "24px forced", fill: "#fff" });
    aim.pos = { x: 80, y: 75 };
    this.add(aim);

    const breakText = new Text("Blocks break when the ball hits them.", { font: "24px forced", fill: "#fff" });
    breakText.pos = { x: 80, y: 100 };
    this.add(breakText);

    const ballControl = new Text("You can control the ball by letting it bounce on the paddle.", { font: "24px forced", fill: "#fff" });
    ballControl.pos = { x: 80, y: 125 };
    this.add(ballControl);

    const paddle = new Text("Move the paddle by pressing the left and right arrow keys.", { font: "24px forced", fill: "#fff" });
    paddle.pos = { x: 80, y: 150 };
    this.add(paddle);

    const dying = new Text("If the ball hits the bottom wall, you lose a live.", { font: "24px forced", fill: "#fff" });
    dying.pos = { x: 80, y: 175 };
    this.add(dying);

    const release = new Text("Press SPACE to shoot the ball and get back in the game..", { font: "24px forced", fill: "#fff" });
    release.pos = { x: 80, y: 200 };
    this.add(release);

    // Add instructions
    const pressSpace = new Text("Press SPACE to return", { font: "24px forced", fill: "#fff" });
    pressSpace.pos = { x: 270, y: 300 };
    this.add(pressSpace);
  }

  static getInstance() {
    if (!HelpScene.instance) HelpScene.instance = new HelpScene();
    return HelpScene.instance;
  }

  update = (dt: number, t: number) => {
    super.update(dt, t);

    if (keys.action) {
      keys.reset();
      SceneManager.getInstance().setScene(0);
    }

    this.period -= dt;
    if (this.period <= 0) {
      this.children[7].style.fill = "#fff";
      if (this.period <= -0.75) this.period = 0.75;
    } else {
      this.children[7].style.fill = "#000";
    }
    
  }
}
