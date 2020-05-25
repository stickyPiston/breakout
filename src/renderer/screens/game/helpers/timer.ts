import { Text } from "asdf-games";

export class Timer extends Text {
	private static instance: Timer;

	startTime = Date.now();
	private running = true;
	private stoppedTime: number = 0;

	get time() {
		if (this.running) return Date.now() - this.startTime;
		else return this.stoppedTime;
	}

	pos = { x: 500, y: 20 };

	private constructor() {
		super("TIME: 0:00", { font: "20px forced", fill: "#fff" });
	}

	static getInstance() {
		if (!Timer.instance) Timer.instance = new Timer();
		return Timer.instance;
	}

	resetTimer() {
		this.startTime = Date.now();
		this.running = true;
	}

	stopTimer() {
		console.log(`stopped timer at ${this.time}`);
		this.stoppedTime = this.time;
		this.running = false;
	}

	update = () => {
		const seconds = new Date(this.time).getSeconds();
		const minutes = new Date(this.time).getMinutes();
		this.text = `TIME: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	}
}
