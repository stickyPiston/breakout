import { Container, Text, Rect } from "asdf-games";
import { readFileSync } from "fs";
import { keys } from "../../constants";
import { SceneManager } from "../../scenemanager";
import { join, dirname } from "path";
import { Discord } from "../../discord-rpc";

export class HighscoresScene extends Container<Text | Rect | Container<Text>> {
	highscoresPath = /screens/gi.test(__dirname) ? join(dirname(__dirname), '../', 'database', 'highscore.json') : join(dirname(__dirname), 'database', 'highscore.json');

	private period = 0.75;

	private constructor() {
		super();

		const bg = new Rect(800, 400, { fill: "#000" });
		this.add(bg);

		const title = new Text("HIGHSCORES", { font: "24px pixelmania", fill: "#fff" });
		title.pos = { x: (800 - 360) / 2, y: 70 };
		this.add(title);

		const highscoresContainer = new Container<Text>();

		const highscores = JSON.parse(readFileSync(this.highscoresPath).toString()) as {score: number, date: number, type: "singleplayer" | "multiplayer"}[];
		const sortedHighscores = {
			multiplayer: highscores.filter(item => item.type === "multiplayer").sort((a, b) => b.score - a.score),
			singleplayer: highscores.filter(item => item.type === "singleplayer").sort((a, b) => b.score - a.score),
		};

		for (const type in sortedHighscores) {
			sortedHighscores[type as "multiplayer" | "singleplayer"].forEach((score, index: number) => {
				const scoreText = new Text(`${index + 1}. ${score.score} on ${this.formatDate(score.date)}`, { font: "24px forced", fill: "#fff" });
				scoreText.pos = { x: score.type === "singleplayer" ? 60 : 500, y: 25 * index + 175 };
				highscoresContainer.add(scoreText);
			});
		}

		const singleplayer = new Text("Singleplayer", { font: "24px forced", fill: "#fff" });
		singleplayer.pos = { x: 110, y: 125 };
		highscoresContainer.add(singleplayer);
	
		const multiplayer = new Text("Multiplayer", { font: "24px forced", fill: "#fff" });
		multiplayer.pos = { x: 560, y: 125 };
		highscoresContainer.add(multiplayer);

		this.add(highscoresContainer);

		const pressSpace = new Text("press SPACE to return", { font: "24px forced", fill: "#fff" });
		pressSpace.pos = { x: 270, y: 300 };
		this.add(pressSpace);
	}

	static getInstance() {
		Discord.getInstance().setActivity({ details: "Proudly looking at their own scores", state: "Looking at the highscores", instance: false });

		return new HighscoresScene();
	}

	private formatDate(stamp: number) {
		const date = new Date(stamp);
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	}

	update = (dt: number, t: number) => {
		super.update(dt, t);

		if (keys.action) {
			keys.reset();
			SceneManager.getInstance().setScene(0);
		}
	
		this.period -= dt;
		if (this.period <= 0) {
			(this.children[3] as Text).style.fill = "#fff";
			if (this.period <= -0.75) this.period = 0.75;
		} else {
			(this.children[3] as Text).style.fill = "#000";
		}
	}
}

