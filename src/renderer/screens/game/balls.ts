import { Container } from "asdf-games";
import { Ball } from "./ball";
import { Player } from "./player";
import { Lives } from "./helpers/lives";
import { Multiplayer } from "./helpers/multiplayer";
import { SceneManager } from "../../scenemanager";

export class Balls extends Container<Ball> {
	private static instance: Balls;

	private constructor() { super() }

	static getInstance() {
		if (!Balls.instance) Balls.instance = new Balls();
		return Balls.instance;
	}

	reset() {
		this.children = [new Ball()];
	}

	addBall() {
		this.add(new Ball())
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);

		if (this.children.length === 0) {
			// There are no ball left. Deduct a life or trigger game over

			this.reset();
			Player.getInstance().released = false;
			
			if (Lives.getInstance().deductLife() === 0) {
				if (Multiplayer.getInstance().enabled) {
					Multiplayer.getInstance().onDone();
					Player.getInstance().disabled = true;
				} else SceneManager.getInstance().setScene(2);
			}
		}
	}
}

