import * as tools from "../api-operations.js";
(async function () {
	const deptInfo = await tools.getDeptInfo();
	const entryId = deptInfo.demo.tutorInfo;
	const tutorInfo = (await tools.client.getEntry(entryId)).fields.tutorInfo;
	for (let user in tutorInfo) {
		Object.assign(tutorInfo[user], {
			profilePic: { url: null, id: null, transform: null },
		});
	}
	try {
		const status = await tools.update2_0(null, null, tutorInfo, entryId);
		console.log("The response status: ", status);
	} catch (err) {
		console.error(err);
	}
})();
