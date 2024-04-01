import { socket } from "/src/utils";

export default function handleBackup() {
  socket.emit("backup");
}
