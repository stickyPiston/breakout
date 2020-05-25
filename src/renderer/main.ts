import { Game, Sound } from "asdf-games";
import { SceneManager } from "./scenemanager";
import { Discord } from "./discord-rpc";
import { SettingsScene } from "./screens/settings/index";
import { Multiplayer } from "./screens/game/helpers/multiplayer";

// Webpack imports
import './index.css';
import './sound.ts';

// TODO: Make a logo
// TODO: Fix typescript compiled files placement

const game = new Game(800, 400, true);

SceneManager.getInstance().on("sceneUpdate", scene => {
  game.scene = scene.getInstance();
});

SceneManager.getInstance().setScene(0);
Discord.getInstance();

game.run(() => { });

// If escape is pressed, pause the game.
document.addEventListener("keydown", e => {
  if (e.which === 27 && !Multiplayer.getInstance().enabled) {
    // @ts-ignore
    game.paused = !game.paused;

    // @ts-ignore
    if (game.paused) {
      new Sound(
				"./res/sound/pause_in.wav",
				{ volume: SettingsScene.getInstance().get("volume") }
			).play();
			// @ts-ignore
      document.getElementById("paused").style.display = "block";
    } else {
      new Sound(
				"./res/sound/pause_out.wav",
				{ volume: SettingsScene.getInstance().get("volume") }
			).play();
			// @ts-ignore
      document.getElementById("paused").style.display = "none";
    }
  }
}, false);
