import { Coordinates, Container, Text, Rect } from "asdf-games";
import { keys, socket } from "../../constants";
import { Discord } from "../../discord-rpc";
import { SceneManager } from "../../scenemanager";

export class SpectateScene extends Container<Rect | Text | Container<Container<Rect>>> {
	private static instance: SpectateScene;

	private period = 0.75;

	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const spectateText = new Text("YOU'RE SPECTATING", { font: "20px forced", fill: "#fff" });
		spectateText.pos = { x: 10, y: 20 };
		this.add(spectateText);

		const closeText = new Text("Press ESC to exit", { font: "20px forced", fill: "#fff" });
		closeText.pos = { x: 620, y: 20 };
		this.add(closeText);

		socket.emit("spectate", Discord.getInstance().secret);

		const multiplayerContainer = new Container<Container<Rect>>();
		multiplayerContainer.add(new Container<Rect>());
		multiplayerContainer.add(new Container<Rect>());

		socket.on("update", (raw: { uuid: string, player: string }) => {
			if (raw.player === "OP done") return;
			if (raw.player === "Game done") SceneManager.getInstance().setScene(0);

			const data = JSON.parse(raw.player) as {
				k: number[],
				p: { x: number, w: number },
				b: Coordinates[],
				u: Coordinates[]
			};

			// Reset multiplayer view
			const tempContainer = new Container<Rect>();

			// Add blocks
			data.k.forEach(index => {
				const block = new Rect(50, 10, { fill: raw.uuid === Discord.getInstance().secret ? "#fff" : "rgba(255, 255, 255, 0.5)" });
				block.pos.x = index * 57 + 3.5 - Math.floor(index / 14) * 798;
				block.pos.y = Math.floor(index / 14) * 15 + 30;
				tempContainer.add(block);
			});

			// Add opponent's paddle
			const paddle = new Rect(data.p.w, 10, { fill: raw.uuid === Discord.getInstance().secret ? "#fff" : "rgba(255, 255, 255, 0.5)" });
			paddle.pos = { x: data.p.x, y: 350 };
			tempContainer.add(paddle);

			data.b.forEach(ball => {
				const ballObject = new Rect(10, 10, { fill: raw.uuid === Discord.getInstance().secret ? "#fff" : "rgba(255, 255, 255, 0.5)" });
				ballObject.pos = ball;
				tempContainer.add(ballObject);
			});

			data.u.forEach(pos => {
				const powerup = new Rect(25, 10, { fill: raw.uuid === Discord.getInstance().secret ? "#fff" : "rgba(255, 255, 255, 0.5)" });
				powerup.pos = pos;
				tempContainer.add(powerup);
			});

			if (raw.uuid === Discord.getInstance().secret) multiplayerContainer.children[0] = tempContainer;
			else multiplayerContainer.children[1] = tempContainer;
		});

		this.add(multiplayerContainer);
	}

	static getInstance() {
		if (!SpectateScene.instance) SpectateScene.instance = new SpectateScene();
		return SpectateScene.instance;
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);

		if (keys.escape) {
			keys.reset();
			SceneManager.getInstance().setScene(0);
		}

		this.period -= dt;
		if (this.period <= 0) {
			(this.children[1] as Text).style.fill = "#fff";
			if (this.period <= -0.75) this.period = 0.75;
		} else {
			(this.children[1] as Text).style.fill = "#000";
		}
	}
}
