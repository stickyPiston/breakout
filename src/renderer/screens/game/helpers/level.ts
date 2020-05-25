import { Text } from "asdf-games";

export class Level extends Text {
  private static instance: Level
  pos = {
    x: 150,
    y: 20
  }

  private level = 0;

  private constructor() {
    super("LEVEL: 0", { font: "20px forced", fill: "#fff" });
  }

  addLevel() {
    this.level++;
  }

  getLevel() {
    return this.level;
  }

	setLevel(level: number) {
		this.level = level;
	}

  static getInstance(): Level {
    if (!Level.instance) {
      Level.instance = new Level();
    }

    return Level.instance;
  }

  update = () => {
    this.text = `LEVEL: ${this.level}`;
  }
}
