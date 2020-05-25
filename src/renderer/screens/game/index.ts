import { Container, Rect } from "asdf-games";
import { Player } from "./player";
import { Ball } from "./ball";
import { Score } from "./helpers/score";
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
  Rect | Player | Ball | Level | Score | Lives | Container<unknown> | PowerupManager | Blocks | Timer
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

		if (Level.getInstance().getLevel() === 0) {
			Score.getInstance().resetScore();
			Lives.getInstance().setLives(3);
			Timer.getInstance().resetTimer();	
     	Level.getInstance().addLevel();
		}

		if (Multiplayer.getInstance().enabled) {
			Lives.getInstance().setLives(3);
			Level.getInstance().setLevel(1);
		}

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
		Ball.getInstance().reset();
    this.add(Ball.getInstance());

    // Add stats
		if (Multiplayer.getInstance().enabled) Score.getInstance().resetScore();
    this.add(Score.getInstance());
    if (Level.getInstance().getLevel() !== 1) Lives.getInstance().addLife();
    this.add(Lives.getInstance());
		if (Multiplayer.getInstance().enabled) Timer.getInstance().resetTimer();
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
