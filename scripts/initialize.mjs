import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });
import readline from "readline";
import contentful from "contentful-management";
import * as mockData from "./data.js";
import { writeFile } from "fs/promises";

function createClient({ cmaToken, spaceId }) {
	const client = contentful.createClient(
		{
			accessToken: cmaToken,
		},
		{
			type: "plain",
			defaults: {
				spaceId: spaceId,
				environmentId: "master",
			},
		},
	);
	return client;
}
async function prepareEntry(client, contentType, entryFields) {
	const entryCreatedTutors = await client.entry.create(
		{
			contentTypeId: contentType.sys.id,
		},
		{
			fields: entryFields,
		},
	);
	const entryPublishedTutors = await client.entry.publish(
		{ entryId: entryCreatedTutors.sys.id },
		{ ...entryCreatedTutors },
	);
	return entryPublishedTutors;
}
async function prepareContentType(client, name, fields) {
	const contentType = await client.contentType.createWithId(
		{ contentTypeId: name.toLowerCase() },
		{
			name: name,
			displayField: "title",
			fields: fields,
		},
	);
	const contentTypePublished = await client.contentType.publish(
		{ contentTypeId: contentType.sys.id },
		{
			sys: contentType.sys,
		},
	);
	return contentTypePublished;
}
async function initializeContentful(client) {
	const tutorContentType = await prepareContentType(
		client,
		"Tutors",
		mockData.tutorTypeFields,
	);
	const deptContentType = await prepareContentType(
		client,
		"Depts",
		mockData.deptTypeFields,
	);
	const tutorEntryFieldsCMP = {
		tutorInfo: {
			"en-US": mockData.mockTutors,
		},
		title: {
			"en-US": "CMP",
		},
	};
	const tutorEntryCMP = await prepareEntry(
		client,
		tutorContentType,
		tutorEntryFieldsCMP,
	);
	const tutorEntryFieldsDemo = {
		tutorInfo: {
			"en-US": Object.assign({}, mockData.demoUser, mockData.mockTutors),
		},
		title: {
			"en-US": "Demo",
		},
	};
	const tutorEntryDemo = await prepareEntry(
		client,
		tutorContentType,
		tutorEntryFieldsDemo,
	);
	const deptEntryFields = {
		deptInfo: {
			"en-US": {
				cmp: {
					brand: "CMP-Lab@Messiah",
					tutorInfo: tutorEntryCMP.sys.id,
				},
				demo: {
					brand: "Demo@Messiah",
					tutorInfo: tutorEntryDemo.sys.id,
				},
			},
		},
		title: {
			"en-US": "Dept_Info",
		},
	};
	const deptEntry = await prepareEntry(
		client,
		deptContentType,
		deptEntryFields,
	); /*
	await client.entry.unpublish(
		{
			entryId: tutorEntryCMP.sys.id,
		},
		{
			...tutorEntryCMP,
		},
	);
	await client.entry.delete({
		entryId: tutorEntryCMP.sys.id,
	});
	await client.entry.unpublish(
		{
			entryId: tutorEntryDemo.sys.id,
		},
		{
			...tutorEntryDemo,
		},
	);
	await client.entry.delete({
		entryId: tutorEntryDemo.sys.id,
	});
	await client.entry.unpublish(
		{
			entryId: deptEntry.sys.id,
		},
		{
			...deptEntry,
		},
	);
	await client.entry.delete({
		entryId: deptEntry.sys.id,
	});
	await client.contentType.unpublish({
		contentTypeId: tutorContentType.sys.id,
	});
	await client.contentType.delete({
		contentTypeId: tutorContentType.sys.id,
	});
	await client.contentType.unpublish({
		contentTypeId: deptContentType.sys.id,
	});
	await client.contentType.delete({
		contentTypeId: deptContentType.sys.id,
	});*/
	return {
		tutorEntryCMP,
		deptEntry,
	};
}
function main() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question("Space ID: ", (spaceId) => {
		rl.question("CDA Token: ", (deliveryToken) => {
			rl.question("CMA Token: ", (cmaToken) => {
				const client = createClient({
					cmaToken,
					spaceId,
				});
				initializeContentful(client).then((res) => {
					const fileData = `VITE_SPACE_ID=${spaceId}\nVITE_ACCESS_TOKEN=${deliveryToken}\nVITE_CMA_TOKEN=${cmaToken}\nVITE_USER_INFO_ID=${res.tutorEntryCMP.sys.id}\nVITE_DEPT_INFO_ID=${res.deptEntry.sys.id}\nVITE_API_BASE_URL=https://localhost:3000`;
					writeFile("../.env.local", fileData);
				});
				rl.close();
			});
		});
	});
}

main();
