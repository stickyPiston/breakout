import EventEmitter from "events";

// Scenes
import { AnnouncerScene } from "./screens/announcer";
import { MainMenu } from "./screens/mainmenu/index";
import { HelpScene } from "./screens/help/index";
import { GameOverScene } from "./screens/gameover/index";
import { SearchingScene } from "./screens/connecting/index";
import { GameScene } from "./screens/game/index";
import { WinScene } from "./screens/winning/index";
import { LosingScene } from "./screens/losing/index";
import { SpectateScene } from "./screens/spectate/index";
import { ResultsScene } from "./screens/results/index";
import { SettingsScene } from "./screens/settings/index";

export class SceneManager extends EventEmitter {
  private static instance: SceneManager;
  private scenes = [
    MainMenu,			 // 0
    HelpScene,		 // 1
    GameOverScene, // 2
    SearchingScene,// 3
    GameScene,		 // 4
    AnnouncerScene,// 5
		WinScene,			 // 6
		LosingScene,	 // 7
		SpectateScene, // 8
		ResultsScene,  // 9
		SettingsScene, // 10
  ];

  private currentSceneIndex = 0;

  get currentScene() {
    return this.scenes[this.currentSceneIndex];
  }

  private constructor() {
    super();
  }

  setScene(index: number) {
    this.currentSceneIndex = index;
    if (index === 4) {
      (this.currentScene.getInstance() as GameScene).resetGame();
    }
    this.emit("sceneUpdate", this.currentScene);
  }

  static getInstance() {
    if (!SceneManager.instance) SceneManager.instance = new SceneManager();
    return SceneManager.instance;
  }
}
