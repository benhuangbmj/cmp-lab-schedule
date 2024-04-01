import { io } from "socket.io-client";
import { apiBaseUrl } from "/src/utils";
export default function generateSocket() {
	return io(apiBaseUrl, { autoConnect: false });
}
