import * as DiscordRPC from "discord-rpc";
import { SceneManager } from "./scenemanager";
import { ipcRenderer } from "electron";

export class Discord {
	private static instance: Discord;

	private clientId = '710849826530656256';
	private rpc = new DiscordRPC.Client({ transport: 'ipc' });

	private ready = false;

	private constructor() {
		this.rpc.on('ready', () => {
			this.ready = true

//			this.setActivity({
//				details: "Looking through the menus",
//				state: "Idle",
//				instance: false
//			});

			this.rpc.subscribe("GAME_SPECTATE", () => {
				//remote.app.dock.bounce("critical");
				ipcRenderer.send("setFocus");
				console.log("Spectating a game!");
				SceneManager.getInstance().setScene(8);
    		// This will run inside breakout. The game scene will be changed to show the game.
  		});

		});

		this.rpc.login({ clientId: this.clientId }).catch(() => {});
		
	}

	setActivity(activity: {details: string, state: string, startTimestamp?: number, largeImageKey?: string, largeImageText?: string, instance: boolean, spectateSecret?: string}) {
		if (this.ready)	this.rpc.setActivity(activity).catch(console.error);
	}

	static getInstance() {
		if (!Discord.instance) Discord.instance = new Discord();
		return Discord.instance;
	}
}

