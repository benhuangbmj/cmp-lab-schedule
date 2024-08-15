// function checkActive was used with the old password-based login system

export default async function checkActive({
	fetchKey,
	dispatch,
	updateActive,
}) {
	const cookieStr = document.cookie.split(";");
	const cookie = {};
	let activeUser = null;
	cookieStr.forEach((str) => {
		const [key, value] = str.split("=");
		cookie[key.trim()] = value;
	});
	if (cookie.activeUser != null) {
		const userStatus = await fetchKey(cookie.activeUser, "status");
		if (userStatus.code == cookie.activeStatus) {
			activeUser = cookie.activeUser;
		}
	}
	dispatch(updateActive(activeUser));
}
