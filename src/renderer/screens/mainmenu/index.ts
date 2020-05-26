import { Container, Text, Rect, Sound } from "asdf-games";
import { keys } from "../../constants";
import { SceneManager } from "../../scenemanager";
import { SettingsScene } from "../settings/index";

export class MainMenu extends Container<Rect | Text> {
  private static instance: MainMenu;

  private period = 0.75;
  private selectedIndex = 0;

  private constructor() {
    super();

    // Add black background
    const bg = new Rect(800, 400, { fill: "#000" });
    this.add(bg);

    // Add title
    const title = new Text("BREAKOUT", { font: "24px pixelmania", fill: "#fff" });
    title.pos = { x: (800 - 300) / 2, y: 75 };
    this.add(title);

    // Add press space to start text
    const pressS = new Text("> Play singleplayer mode", { font: "24px forced", fill: "#fff" });
    pressS.pos = { x: (800 - 270) / 2, y: 150 };
    this.add(pressS);

    const pressM = new Text("Play multiplayer mode", { font: "24px forced", fill: "#fff" });
    pressM.pos = { x: (800 - 243) / 2, y: 190 };
    this.add(pressM);

    const pressH = new Text("Help", { font: "24px forced", fill: "#fff" });
    pressH.pos = { x: (800 - 70) / 2, y: 230};
    this.add(pressH);

    const pressT = new Text("Settings", { font: "24px forced", fill: "#fff" });
    pressT.pos = { x: (800 - 120) / 2, y: 270};
    this.add(pressT);

		const highscores = new Text("Highscores", { font: "24px forced", fill: "#fff" });
		highscores.pos = { x: 330, y: 310 };
		this.add(highscores);

    const credit = new Text("This game is made by Job Vonk", { font: "18px forced", fill: "#fff" });
    credit.pos = { x: 20, y: 360 };
    this.add(credit);
  }

  static getInstance() {
    if (!MainMenu.instance) MainMenu.instance = new MainMenu();
    return MainMenu.instance;
  }

  update(dt: number, t: number) {
    super.update(dt, t);

		// Move the cursor down or up the menu
    if (keys.y === 1 && this.selectedIndex < 4) {

			new Sound(
				"./res/sound/menu_move.wav",
				{ volume: SettingsScene.getInstance().get("volume") }
			).play();

      keys.reset();
      this.children[this.selectedIndex + 2].style.fill = "#fff";
      (this.children[this.selectedIndex + 2] as Text).text = (this.children[this.selectedIndex + 2] as Text).text.replace("> ", "");
      this.selectedIndex++;
      (this.children[this.selectedIndex + 2] as Text).text = "> " + (this.children[this.selectedIndex + 2] as Text).text;

    } else if (keys.y === -1 && this.selectedIndex > 0) {

			new Sound(
				"./res/sound/menu_move.wav",
				{ volume: SettingsScene.getInstance().get("volume") }
			).play();

      keys.reset();
      this.children[this.selectedIndex + 2].style.fill = "#fff";
      (this.children[this.selectedIndex + 2] as Text).text = (this.children[this.selectedIndex + 2] as Text).text.replace("> ", "");
      this.selectedIndex--;
      (this.children[this.selectedIndex + 2] as Text).text = "> " + (this.children[this.selectedIndex + 2] as Text).text;

    }
    
		// If space bar is pressed continue to corresponding scene
    if (keys.action) {
      keys.reset();

      // Perform action corresponding to menu item
      if (this.selectedIndex === 1) 
        SceneManager.getInstance().setScene(3);
      else if (this.selectedIndex === 0)
         SceneManager.getInstance().setScene(4);
      else if (this.selectedIndex === 2)
        SceneManager.getInstance().setScene(1);
			else if (this.selectedIndex === 3)
				SceneManager.getInstance().setScene(8);
			else if (this.selectedIndex === 4)
				SceneManager.getInstance().setScene(9);
    }

    // Periodically toggle text
    this.period -= dt;

    if (this.period <= 0) {
      this.children[this.selectedIndex + 2].style.fill = "#fff";
      if (this.period <= -0.75) this.period = 0.75;
    } else {
      this.children[this.selectedIndex + 2].style.fill = "#000";
    } 
  }
}
