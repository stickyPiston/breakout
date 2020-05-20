import { Container, Text, Rect } from "asdf-games";
import { keys } from "../../constants";
import { SceneManager } from "../../scenemanager";

export class WinScene extends Container<Text | Rect> {
	private static instance: WinScene;

	private period = 0.75;

	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const winText = new Text("YOU WIN", { font: "48px pixelmania", fill: "#fff" });
		winText.pos = { x: (800 - 460) / 2, y: 200 };
		this.add(winText);
		
    // Add instructions
    const pressSpace = new Text("Press SPACE to return", { font: "24px forced", fill: "#fff" });
    pressSpace.pos = { x: 270, y: 300 };
    this.add(pressSpace);
	}

	static getInstance() {
		if (!WinScene.instance) WinScene.instance = new WinScene();
		return WinScene.instance;
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);
	
    if (keys.action) {
      keys.reset();
      SceneManager.getInstance().setScene(0);
    }
			
    this.period -= dt;
    if (this.period <= 0) {
      this.children[2].style.fill = "#fff";
      if (this.period <= -0.75) this.period = 0.75;
    } else {
      this.children[2].style.fill = "#000";
    }
	}
}
