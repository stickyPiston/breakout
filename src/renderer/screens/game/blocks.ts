import { Container, Rect } from "asdf-games";

export class Blocks extends Container<Block> {
  private static instance: Blocks;

	private blockCount = 42; // 3 * 14

  private constructor() {
    super();
    this.generateBlocks();
  }

  generateBlocks() {
    this.children = [];

    for (let i = 0; i < this.blockCount; i++) {
      this.add(new Block(i));
    }
  }

  static getInstance() {
    if (!Blocks.instance) Blocks.instance = new Blocks();
    return Blocks.instance;
  }
}

export class Block extends Rect {
	constructor(public index: number) {
		super(50, 10, { fill: "#fff" });
		this.pos.x = index * 57 + 3.5 - Math.floor(index / 14) * 798;
		this.pos.y = Math.floor(index / 14) * 15 + 30;
	}
}
