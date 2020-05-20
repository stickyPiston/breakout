import { Container, Rect, Text } from "asdf-games";
import { Score } from "../game/helpers/score";
import { Lives } from "../game/helpers/lives";
import { Level } from "../game/helpers/level";
import { socket, keys } from "../../constants";
import { SceneManager } from "../../scenemanager";
import { Multiplayer } from "../game/helpers/multiplayer";
import { Timer } from "../game/helpers/timer";

export class ResultsScene extends Container<Rect | Text> {
	private period = 0.75;

	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const totalScore = 
			Score.getInstance().getScore()
			+ Lives.getInstance().getLives() * 200
			+ Math.round(( 3e5 - Timer.getInstance().time ) / 1e3 * 10);

		console.log("Timer value: ", Timer.getInstance().time);
		socket.on("update", (score: { uuid: string, player: number | string}) => {
			if (typeof score.player === "number") {
				const winningText = new Text(score.player > totalScore ? "YOU LOSE" : "YOU WIN", { font : "48px pixelmania", fill: "#fff" });
				winningText.pos = { x: score.player > totalScore ? (800 - 540) / 2 : (800 - 450) / 2, y: 100 };
				this.add(winningText);

				const ownTotalScoreText = new Text(`TOTAL SCORE: ${totalScore}`, { font: "24px forced", fill: "#fff" });
				ownTotalScoreText.pos = { x: 400, y: 200 };
				this.add(ownTotalScoreText);

				const timeBonus = new Text(`TIME BONUS: ${Math.round(( 3e5 - Timer.getInstance().time ) / 1e3 * 10)}`, { font: "24px forced", fill: "#fff" });
				timeBonus.pos = { x: 70, y: 230 };
				this.add(timeBonus);

				const baseScoreText = new Text(`SCORE: ${Score.getInstance().getScore()}`, { font: "24px forced", fill: "#fff" });
				baseScoreText.pos = { x: 70, y: 200 };
				this.add(baseScoreText);

				const lifeBonus = new Text(`LIFE BONUS: ${Lives.getInstance().getLives()} * 200`, { font: "24px forced", fill: "#fff" });
				lifeBonus.pos = { x: 70, y: 260 };
				this.add(lifeBonus);

				const opponentScoreText = new Text(`OPPONENT'S SCORE: ${score.player}`, { font: "24px forced", fill : "#fff" });
				opponentScoreText.pos = { x: 400, y: 230 };
				this.add(opponentScoreText);

    		// Add instructions
    		const pressSpace = new Text("Press SPACE to return", { font: "24px forced", fill: "#fff" });
  	  	pressSpace.pos = { x: 270, y: 330 };
	    	this.add(pressSpace);

				Multiplayer.getInstance().enabled = false;
				Level.getInstance().setLevel(0);
				socket.close();

				socket.removeAllListeners();

				// TODO: Save highscore locally.	
			}
		});

		socket.emit("update", totalScore);
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

		// TODO: Add fancy animations and fix styling

		if (this.children[7]) {
			this.period -= dt;

			if (this.period <= 0) {
				this.children[7].style.fill = "#fff";
				if (this.period <= -0.75) this.period = 0.75;
			} else {
				this.children[7].style.fill = "#000";
			}
		}
	}
}
