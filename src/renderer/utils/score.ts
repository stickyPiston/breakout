import { Container, Text } from "asdf-games";
import { ScoreHelper } from "../screens/game/helpers/score";
import { Timer } from "../screens/game/helpers/timer";
import { Lives } from "../screens/game/helpers/lives";
import { Level } from "../screens/game/helpers/level";
import { readFileSync, writeFileSync } from "fs";
import { Multiplayer } from "../screens/game/helpers/multiplayer";
import { dirname, join } from "path";
import "../database/highscore.json";

export class Score extends Container<Text> {
	private score: number;

	highscoresPath = join(dirname(__dirname), 'database','highscore.json');

	private constructor() {
		super();

		this.score = ScoreHelper.getInstance().getScore()
			+ Lives.getInstance().getLives() * 200
			+ Math.round(( 2e5 * Level.getInstance().getLevel() - Timer.getInstance().time ) / 1e3 * 10);
	}

	getScore() { return this.score }

	static getInstance() {
		const instance = new Score();

		const timeBonus = new Text(`TIME BONUS: ${Math.round(( 2e5 - Timer.getInstance().time ) / 1e3 * 10)}`, { font: "24px forced", fill: "#fff" });
		timeBonus.pos = { x: 300, y: 230 };
		instance.add(timeBonus);

		const baseScoreText = new Text(`SCORE: ${ScoreHelper.getInstance().getScore()}`, { font: "24px forced", fill: "#fff" });
		baseScoreText.pos = { x: 330, y: 200 };
		instance.add(baseScoreText);

		const lifeBonus = new Text(`LIFE BONUS: ${Lives.getInstance().getLives()} * 200`, { font: "24px forced", fill: "#fff" });
		lifeBonus.pos = { x: 285, y: 260 };
		instance.add(lifeBonus);

		const totalScore = new Text(`TOTAL: ${instance.getScore()}`, { font: "24px forced", fill: "#fff" });
		totalScore.pos = { x: 325, y: 290 };
		instance.add(totalScore);

		const highscores = JSON.parse(readFileSync(instance.highscoresPath).toString()) as {score: number, date: number, type: "multiplayer" | "singleplayer"}[];
		const sortedHighscores = {
			multiplayer: highscores.filter(item => item.type === "multiplayer").sort((a: { score: number }, b: { score: number }) => b.score - a.score),
			singleplayer: highscores.filter(item => item.type === "singleplayer").sort((a: { score: number }, b: { score: number }) => b.score - a.score)
		};

		const type = Multiplayer.getInstance().enabled ? "multiplayer" : "singleplayer"

		if (sortedHighscores[type].length < 3) {
			sortedHighscores[type].push({ date: Date.now(), score: instance.getScore(), type: type });
		} else if (sortedHighscores[type][2].score < instance.getScore()) {

			if (sortedHighscores[type][1].score > instance.getScore()) sortedHighscores[type][2] = { date: Date.now(), score: instance.getScore(), type: type };
			else if (sortedHighscores[type][0].score > instance.getScore() && sortedHighscores[type][1].score < instance.getScore()) {
				sortedHighscores[type][2] = sortedHighscores[type][1];
				sortedHighscores[type][1] = { date: Date.now(), score: instance.getScore(), type: type };
			} else if (sortedHighscores[type][0].score < instance.getScore()) {
				sortedHighscores[type][1] = sortedHighscores[type][0];
				sortedHighscores[type][2] = sortedHighscores[type][1];
				sortedHighscores[type][0] = { date: Date.now(), score: instance.getScore(), type: type };
			}

		}

		writeFileSync(instance.highscoresPath, JSON.stringify([...sortedHighscores.multiplayer, ...sortedHighscores.singleplayer]));

		Level.getInstance().setLevel(1);
		ScoreHelper.getInstance().resetScore();
		Lives.getInstance().setLives(3);
		

		return instance;
	}

}
