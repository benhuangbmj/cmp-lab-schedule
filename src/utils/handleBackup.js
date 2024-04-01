import { socket } from "./utils";

export default function handleBackup() {
  socket.emit("backup");
}
