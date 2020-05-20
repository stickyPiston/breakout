import { Rect } from "asdf-games";

export class Background extends Rect {
  private static instance: Background;

  private constructor() {
    super(800, 400, { fill: "#000" });
  }

  setColor(fill: string) {
    this.style.fill = fill;
//    setTimeout(() => {this.style.fill = "#000"}, 100);
  }

  static getInstance() {
    if (!Background.instance) Background.instance = new Background();
    return Background.instance;
  }

  update() {
    this.style.fill = "#000";
  }
}
