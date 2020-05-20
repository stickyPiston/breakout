import { Rect, Container, Text } from "asdf-games";
import { Level } from "./level";

export class Announcer extends Container<Text | Rect | Container<Rect>> {
  private static instance: Announcer;

  private fadeoutSpeed = 150;
  private fadeinSpeed = 400;

  private period = 1;

  //private onDone: () => void
  private constructor(private onDone: { resetGame: () => void}) {
    super();

    const blackBox = new Rect(900, 200, { fill: "#000" });
    blackBox.pos = { x: -630, y: 100 };
    this.add(blackBox);

    const level = Level.getInstance();
    const announcerText = new Text(`LEVEL ${level.getLevel()}`, { font: "48px pixelmania", fill: "#fff" });
    announcerText.pos = { x: -460, y: 200 };
    this.add(announcerText);

    const topLine = new Rect(900, 5, { fill: "#fff" });
    topLine.pos = { x: -630, y: 100 };
    this.add(topLine);

    const bottomLine = new Rect(900, 5, { fill: "#fff" });
    bottomLine.pos = { x: -630, y: 270 };
    this.add(bottomLine);
  }

  static getInstance(onDone: { resetGame: () => void}): Announcer {
    if (!Announcer.instance) Announcer.instance = new Announcer(onDone);

    return Announcer.instance;
  }

  update(dt: number, t: number) {
    super.update(dt, t);

    if (this.children[1].pos.x <= 170) {
      this.children[0].pos.x += dt * this.fadeinSpeed;
      this.children[1].pos.x += dt * this.fadeinSpeed;
      this.children[2].pos.x += dt * this.fadeinSpeed;
      this.children[3].pos.x += dt * this.fadeinSpeed;
    } else if (this.children[2].pos.y >= -20) {
      this.children[2].pos.y -= dt * this.fadeoutSpeed;
      this.children[3].pos.y += dt * this.fadeoutSpeed;
      this.children[0].pos.y -= dt * this.fadeoutSpeed;
      (this.children[0] as Rect).h += dt * this.fadeoutSpeed * 2;
    } else if (this.children[2].pos.y <= -20) {
      this.period -= dt;
      if (this.period <= 0) {
        this.children[1].pos.x += dt * this.fadeinSpeed;
      }

      if (this.children[1].pos.x >= 800) {
				// @ts-ignore
        this.children[1].dead = true;
        this.children[1].pos.x = 0;
        console.log("Done!");
        this.onDone.resetGame();
      }
    }
  }
}
