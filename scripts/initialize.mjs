import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });
import readline from "readline";
import contentful from "contentful-management";
import * as mockData from "./data.js";

const { VITE_CMA_TOKEN: cmaToken, VITE_SPACE_ID: spaceId } = process.env;
function createClient({ accessToken, spaceId }) {
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
	const contentType = await client.contentType.create(
		{},
		{
			name: name,
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
		"Users",
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
	);
	console.log("deptEntry", deptEntry.fields.deptInfo["en-US"]);
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
	});
}
const client = createClient({
	accessToken: cmaToken,
	spaceId: spaceId,
});
initializeContentful(client);
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
