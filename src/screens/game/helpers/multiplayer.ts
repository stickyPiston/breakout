import { Rect, Container, Coordinates } from "asdf-games";
import { socket } from "../../../constants";
import { Player } from "../player";
import { Ball } from "../ball";
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
						SceneManager.getInstance().setScene(9);
					}
				} else {

					const data = JSON.parse(raw.player) as {
						k: number[],
						p: { x: number, w: number },
						b: Coordinates,
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
	
					const ball = new Rect(10, 10, { fill: "rgba(255, 255, 255, 0.5)" });
					ball.pos = data.b;
					this.add(ball);

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
			socket.removeAllListeners();
			SceneManager.getInstance().setScene(9);
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
			const b = { x: Math.round(Ball.getInstance().pos.x), y: Math.round(Ball.getInstance().pos.y) };
			const u = PowerupManager.getInstance().children.map(powerup => ({ x: Math.round(powerup.pos.x), y: Math.round(powerup.pos.y) }));

			socket.emit("update", JSON.stringify({ k, p, b, u }));
		}
	}

}
