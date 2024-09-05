import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });
import readline from "readline";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.close();

function main() {
	rl.question("Space ID: ", (spaceId) => {
		rl.question("Access Token: ", (accessToken) => {
			const client = contentful.createClient({
				space: spaceId,
				accessToken: accessToken,
			});
			client.getSpace().then((space) => {
				console.log(space.name);
			});
		});
		rl.close();
	});
}
