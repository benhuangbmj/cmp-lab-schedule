import Navbar from "/src/navbar/Navbar";
import Routes from "/src/routes/Routes";
import Banner from "/src/util-components/Banner";

export default function () {
	return (
		<main>
			<Navbar />
			<Banner text="The server is offline." checkOffline />
			<Routes />
		</main>
	);
}
