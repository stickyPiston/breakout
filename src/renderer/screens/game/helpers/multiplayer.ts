import { Rect, Container, Coordinates } from "asdf-games";
import { socket } from "../../../constants";
import { Player } from "../player";
import { Balls } from "../balls";
import { Blocks } from "../blocks";
import { PowerupManager } from "./powerup";
import { SceneManager } from "../../../scenemanager";
import { Timer } from "./timer";

export class Multiplayer extends Container<unknown> {
	private static instance: Multiplayer;
	enabled = false;

	private listenerSet = false;

	private weDone = false;
	private OPdone = false;
	
	private constructor() {
		super();
	}

	static getInstance() {
		if (!Multiplayer.instance) Multiplayer.instance = new Multiplayer();
		return Multiplayer.instance;
	}

	resetMultiplayer() {
		this.listenerSet = false;
		this.weDone = false;
		this.OPdone = false;
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);

		if (!this.listenerSet) {
			socket.on("update", (raw: {uuid: string, player: string}) => {
				if (raw.player === "OP done" && !this.OPdone) { // Opponent has completed the level
					this.OPdone = true;
					if (this.weDone) {
						socket.removeAllListeners();
						SceneManager.getInstance().setScene(7);
					}
				} else {

					const data = JSON.parse(raw.player) as {
						k: number[],
						p: { x: number, w: number },
						b: Coordinates[],
						u: Coordinates[]
					};
	
					// Reset multiplayer view
					this.children = [];
		
					// Add blocks
					data.k.forEach(index => {
						const block = new Rect(50, 10, { fill: "rgba(255, 255, 255, 0.5)" });
						block.pos.x = index * 57 + 3.5 - Math.floor(index / 14) * 798;
						block.pos.y = Math.floor(index / 14) * 15 + 30;
						this.add(block);
					});
	
					// Add opponent's paddle
					const paddle = new Rect(data.p.w, 10, { fill: "rgba(255, 255, 255, 0.5)" });
					paddle.pos = { x: data.p.x, y: 350 };
					this.add(paddle);
	
					data.b.forEach(ball => {
						const ballObject = new Rect(10, 10, { fill: "rgba(255, 255, 255, 0.5)" });
						ballObject.pos = ball;
						this.add(ballObject);
					});

					data.u.forEach(pos => {
						const powerup = new Rect(25, 10, { fill: "rgba(255, 255, 255, 0.5)" });
						powerup.pos = pos;
						this.add(powerup);
					});
				}
			});

			this.listenerSet = true;
		}
	}

	onDone() {
		if (this.OPdone && this.weDone) {
			socket.emit("update", "Game done");
			socket.removeAllListeners();
			SceneManager.getInstance().setScene(7);
		} else if (!this.weDone) {
			Timer.getInstance().stopTimer();
			socket.emit("update", "OP done");
			this.weDone = true;
			this.onDone();
		}
	}

	emit() {
		if (this.enabled) {
			const k = Blocks.getInstance().children.map(block => block.index);
			const p = { x: Math.floor(Player.getInstance().pos.x), w: Player.getInstance().w } ;
			const b = Balls.getInstance().children.map(ball => ({ x: Math.round(ball.pos.x), y: Math.round(ball.pos.y) }));
			const u = PowerupManager.getInstance().children.map(powerup => ({ x: Math.round(powerup.pos.x), y: Math.round(powerup.pos.y) }));

			socket.emit("update", JSON.stringify({ k, p, b, u }));
		}
	}

}
