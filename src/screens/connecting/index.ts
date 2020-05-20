import { Container, Text, Rect } from "asdf-games";
import { SceneManager } from "../../scenemanager";
import { socket } from "../../constants";
import { Multiplayer } from "../game/helpers/multiplayer";

export class SearchingScene extends Container<Text | Rect> {
  private static instance: SearchingScene;

  private period = 0.75;
	private countdown = 3;
	private opponentFound = false;

  private constructor() {
    super();

    // Add black background
    const bg = new Rect(800, 400, { fill: "#000" });
    this.add(bg);

    // Add instructions
    const pressSpace = new Text("Searching for an opponent...", { font: "24px forced", fill: "#fff" });
    pressSpace.pos = { x: 270, y: 275 };
    this.add(pressSpace);

  }

  static getInstance() {
    if (!SearchingScene.instance) SearchingScene.instance = new SearchingScene();

		SearchingScene.instance.opponentFound = false;
		SearchingScene.instance.countdown = 3;
		SearchingScene.instance.period = 0.75;
		SearchingScene.instance.children[1].text = "Searching for an opponent...";

		if (!socket.connected) socket.open();
		socket.emit("identification", { gameID: "brek", playersMax: 2 });
		Multiplayer.getInstance().enabled = true;
		
   	socket.on("gameStart", () => {
			SearchingScene.instance.opponentFound = true;

			setTimeout(() => SceneManager.getInstance().setScene(4), 3000);
		});

    return SearchingScene.instance;
  }

  update = (dt: number, t: number) => {
    super.update(dt, t);

		if (this.opponentFound) {
			this.countdown -= dt;

			this.children[1].style.fill = "#fff";
			this.children[1].text = "Opponent Found! Starting game in " + Math.ceil(this.countdown);
			this.children[1].pos.x = 230;
		} else {
    	// Periodically toggle text
    	this.period -= dt;

    	if (this.period <= 0) {
      	this.children[1].style.fill = "#000";
     	 if (this.period <= -0.75) this.period = 0.75;
    	} else {
     	 this.children[1].style.fill = "#fff";
    	}
		}
  }
}
