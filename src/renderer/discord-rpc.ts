import * as DiscordRPC from "discord-rpc";
import { SceneManager } from "./scenemanager";
import { ipcRenderer } from "electron";

export class Discord {
	private static instance: Discord;

	private clientId = '710849826530656256';
	private rpc = new DiscordRPC.Client({ transport: 'ipc' });

	private ready = false;
	secret!: string;

	private constructor() {
		this.rpc.on('ready', () => {
			this.ready = true

			this.rpc.subscribe("GAME_SPECTATE", (data: {secret: string}) => {
				ipcRenderer.send("setFocus");
				this.secret = data.secret;
				SceneManager.getInstance().setScene(6);
  		});

			this.setActivity({ details: "Looking through the menus", state: "Idle", instance: false, largeImageText: "Playing breakout", largeImageKey: "logo" });

		});

		this.rpc.login({ clientId: this.clientId }).catch(() => {});
		
	}

	setActivity(activity: {details: string, state: string, startTimestamp?: number, largeImageKey?: string, largeImageText?: string, instance: boolean, spectateSecret?: string}) {
		if (this.ready) {
			const alteredActivity = {...activity, largeImageKey: activity.largeImageKey || "logo", largeImageText: activity.largeImageText || "Playing Breakout"};
			this.rpc.setActivity(alteredActivity).catch(console.error);
		}
	}

	static getInstance() {
		if (!Discord.instance) Discord.instance = new Discord();
		return Discord.instance;
	}
}

