import generateSocket from "/src/utils/generateSocket";

const socket = generateSocket();

socket.on("connect", () => {
  socket.emit("backup");
});

socket.on("backup complete", () => {
  console.log("Backup complete");
  socket.disconnect();
});

export default function handleBackup() {
  try {
    socket.connect();
  } catch (err) {
    console.error(err);
  }
}
