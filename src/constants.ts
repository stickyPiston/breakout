import * as asdf from "asdf-games";
import * as socketio from "socket.io-client";

export const keys = new asdf.KeyControls();
export const socket = socketio.connect("http://jobbel.nl:3000");
