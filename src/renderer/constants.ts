import * as asdf from "asdf-games";
import io from "socket.io-client";
import { ipcRenderer } from "electron";

export const keys = new asdf.KeyControls();
export let socket = io("http://localhost:3000");
// export let socket = io("https://jobbel.nl", {
//   secure: true,
//   // reconnection: true,
//   // rejectUnauthorized: false,
//   path: '/tanksjs/socket.io',
//   //transports: ['polling']
// });

socket.on("error", console.log);
socket.on("connect_error", console.log);
socket.on("identify", () => console.log("Need to identify"));

ipcRenderer.on("changeServer", (_e, args) => {
  console.log(args);
  const url = new URL(args);
  socket = io(url.origin, {
    secure: true,
    path: url.pathname
  });
  console.log(`Changed the server to ${socket.io.uri}`);
  socket.on("error", console.log);
  socket.on("connect_error", console.log);
  socket.on("identify", () => console.log("Need to identify"));
});
