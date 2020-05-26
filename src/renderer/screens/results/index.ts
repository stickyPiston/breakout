import { Container, Rect, Text } from "asdf-games";
import { socket, keys } from "../../constants";
import { SceneManager } from "../../scenemanager";
import { Multiplayer } from "../game/helpers/multiplayer";
import { Score } from "../../utils/score";

export class ResultsScene extends Container<Rect | Text | Score> {
	private period = 0.75;

	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const score = Score.getInstance();

		socket.on("update", (data: { uuid: string, player: number | string}) => {
			if (typeof data.player === "number") {
				const winningText = new Text(data.player > score.getScore() ? "YOU LOSE" : "YOU WIN", { font : "48px pixelmania", fill: "#fff" });
				winningText.pos = { x: data.player > score.getScore() ? (800 - 540) / 2 : (800 - 450) / 2, y: 100 };
				this.add(winningText);

				this.add(score);

				const opponentScoreText = new Text(`OPPONENT'S SCORE: ${data.player}`, { font: "24px forced", fill : "#fff" });
				opponentScoreText.pos = { x: 255, y: 170 };
				this.add(opponentScoreText);

    		// Add instructions
    		const pressSpace = new Text("Press SPACE to return", { font: "24px forced", fill: "#fff" });
  	  	pressSpace.pos = { x: 270, y: 330 };
	    	this.add(pressSpace);

				Multiplayer.getInstance().enabled = false;
				socket.close();
				socket.removeAllListeners();
			}
		});

		socket.emit("update", score.getScore());
	}

	static getInstance() {
		return new ResultsScene();
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);

		if (keys.action) {
			keys.reset();
			SceneManager.getInstance().setScene(0);
		}

		if (this.children[4]) {
			this.period -= dt;

			if (this.period <= 0) {
				(this.children[4] as Text).style.fill = "#fff";
				if (this.period <= -0.75) this.period = 0.75;
			} else {
				(this.children[4] as Text).style.fill = "#000";
			}
		}
	}
}
