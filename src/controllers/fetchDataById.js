import { studentData, studentId } from "/src/mockData";

export default function fetchDataById({ id, url }) {
	return new Promise((res, rej) => {
		setTimeout(() => {
			if (id == studentId) {
				res(studentData);
			} else {
				res({
					id: id,
					name: "",
					major: "",
					email: "",
					subject: "",
					year: "",
				});
			}
		}, 0);
	});
}
