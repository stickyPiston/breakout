import { Container, Rect, Text } from "asdf-games";
import { keys } from "../../constants";
import { SceneManager } from "../../scenemanager";

export class SettingsScene extends Container<Rect | Text> {
	private static instance: SettingsScene;

	private selectedIndex = 0;
	private period = 0.75;

	options = {
		volume: 1
	};

	get(property: "volume") {
		return this.options[property];
	}
	
	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const volumeText = new Text("Volume: ", { font: "30px forced", fill: "#fff" });
		volumeText.pos = { x: 160, y: 225 };
		this.add(volumeText);

		const volumeSlider = new Rect(320, 30, { fill: "#fff" });
		volumeSlider.pos = { x: 280, y: 200 };
		this.add(volumeSlider);

		const pressSpace = new Text("Press SPACE to return", { font: "24px forced", fill: "#fff" });
    pressSpace.pos = { x: 270, y: 300 };
		this.add(pressSpace);

		const instructions = new Text("Use the arrow keys to adjust the values", { font: "24px forced", fill: "#fff" });
		instructions.pos = { x: (800 - 446) / 2, y: 100 };
		this.add(instructions);
	}

	static getInstance() {
		if (!SettingsScene.instance) SettingsScene.instance = new SettingsScene();
		return SettingsScene.instance;
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);

		if (keys.action) {
			keys.reset();
			SceneManager.getInstance().setScene(0);
		}

		if (keys.y === -1 && this.selectedIndex < this.children.length - 1) {
			this.selectedIndex++;
		} else if (keys.y === 1 && this.selectedIndex > 0) {
			this.selectedIndex--;
		}

		if (keys.x === 1) {
			this.options.volume += this.options.volume < 1 ? dt : 0;
		} else if (keys.x === -1) {
			this.options.volume -= this.options.volume > 0 ? dt : 0;
		}

		if (this.options.volume < 0) this.options.volume = 0;
		if (this.options.volume > 1) this.options.volume = 1;

		(this.children[2] as Rect).w = 320 * this.options.volume;

		this.period -= dt;
		if (this.period <= 0) {
			this.children[3].style.fill = "#fff";
			if (this.period <= -0.75) this.period = 0.75;
		} else {
			this.children[3].style.fill = "#000";
		}
	}
}
