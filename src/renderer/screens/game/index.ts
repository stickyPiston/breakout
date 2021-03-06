import { Container, Rect } from "asdf-games";
import { Player } from "./player";
import { Balls } from "./balls";
import { ScoreHelper } from "./helpers/score";
import { Lives } from "./helpers/lives";
import { Level } from "./helpers/level";
import { SceneManager } from "../../scenemanager";
import { PowerupManager } from "./helpers/powerup";
import { Blocks } from "./blocks";
import { Background } from "./background";
import { Multiplayer } from "./helpers/multiplayer";
import { socket } from "../../constants";
import { Discord } from "../../discord-rpc"
import { Timer } from "./helpers/timer";

// TODO: Add party powerup with bar filling up.

export class GameScene extends Container<
  Rect | Player | Balls | Level | ScoreHelper | Lives | Container<unknown> | PowerupManager | Blocks | Timer
> {
  private static instance: GameScene;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!GameScene.instance) GameScene.instance = new GameScene();
    return GameScene.instance;
  }

  resetGame() {
    this.children = [];

		if (Level.getInstance().getLevel() === 1) Timer.getInstance().resetTimer();

    // Add black background
    this.add(Background.getInstance());

    // Generate blocks and add them
    Blocks.getInstance().generateBlocks();
    this.add(Blocks.getInstance());

    // Reset and add paddle
		Player.getInstance().disabled = false;
		Player.getInstance().pos.x = 0;
		Player.getInstance().w = 125;
    this.add(Player.getInstance());

    // Add ball
		Balls.getInstance().reset();
    this.add(Balls.getInstance());

    // Add stats
    this.add(ScoreHelper.getInstance());
    if (Level.getInstance().getLevel() !== 1) Lives.getInstance().addLife();
    this.add(Lives.getInstance());
		this.add(Timer.getInstance());
    if (!Multiplayer.getInstance().enabled) this.add(Level.getInstance());

    // Add Powerup Manager
    PowerupManager.getInstance().resetPowerups();
    this.add(PowerupManager.getInstance());

		// Multiplayer (only if enabled)
		if (Multiplayer.getInstance().enabled) {
			Multiplayer.getInstance().resetMultiplayer();
			this.add(Multiplayer.getInstance());
		}

		// TODO: Add logo to discord admin dashboard
		Discord.getInstance().setActivity({
			details: Multiplayer.getInstance().enabled ? "Playing multiplayer mode" : "Playing level " + Level.getInstance().getLevel(),
			state: "In a game",
			instance: false,
			startTimestamp: Timer.getInstance().startTime,
			spectateSecret: Multiplayer.getInstance().enabled ? socket.id : undefined 
		});
  }

  update = (dt: number, t: number) => {
    super.update(dt, t);

		// Multiplayer object will check itself if it's enabled.
		Multiplayer.getInstance().emit();

    if ((this.children[1] as Container<Rect>).children.length === 0) {
      (this.children[2] as Player).released = false;
			if (Multiplayer.getInstance().enabled) {
				Multiplayer.getInstance().onDone();

				Player.getInstance().released = false;
				Player.getInstance().disabled = true;
			} else {
	      Level.getInstance().addLevel();
				console.log("Switching to announcer!");
  	    SceneManager.getInstance().setScene(5);
			}
    }
  }
}
