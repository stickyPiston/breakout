import { Container, Text, Rect } from "asdf-games";

export class SpectateScene extends Container<Rect | Text> {
	private static instance: SpectateScene;

	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const spectateText = new Text("YOU'RE SPECTATING", { font: "24px forced", fill: "#fff" });
		spectateText.pos = { x: 400, y: 200 };
		this.add(spectateText);

		// TODO: Connect to multiplayer
		// TODO: Get updates from the correct room
		// TODO: Draw the things.
		// TODO: Update RPC activity to spectating 
	}

	static getInstance() {
		if (!SpectateScene.instance) SpectateScene.instance = new SpectateScene();
		return SpectateScene.instance;
	}
}
