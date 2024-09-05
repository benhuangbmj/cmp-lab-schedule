import * as dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });
import readline from "readline";
import contentful from "contentful-management";

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

async function prepareContentType(client) {
	const tutorsType = await client.contentType.create(
		{},
		{
			name: "Users",
			fields: [
				{
					id: "tutorInfo",
					name: "tutor_info",
					type: "Object",
					localized: false,
					required: false,
					validations: [],
					disabled: false,
					omitted: false,
				},
				{
					id: "title",
					name: "title",
					type: "Symbol",
					localized: false,
					required: false,
					validations: [],
					disabled: false,
					omitted: false,
				},
			],
		},
	);
	const tutorsTypePublished = await client.contentType.publish(
		{ contentTypeId: tutorsType.sys.id },
		{
			sys: tutorsType.sys,
		},
	);
	const entryCreatedTutors = await client.entry.create(
		{
			contentTypeId: tutorsTypePublished.sys.id,
		},
		{
			fields: {
				tutorInfo: {
					"en-US": {
						ajohnson: {
							password: null,
							name: "Alex Johnson",
							time: ["10:00 AM - 11:30 AM"],
							day: ["Monday"],
							subject: null,
							courses: [],
							profilePic: {
								url: null,
								id: null,
								transform: null,
							},
							schedule: null,
							override: {},
							links: {
								linkedin: null,
								twitter: null,
								github: null,
								instagram: null,
								youtube: null,
								facebook: null,
							},
							lastUpdate: null,
							lastLogin: null,
							roles: {
								developer: false,
								admin: false,
							},
							inactive: false,
							title: null,
							bio: null,
							permission: true,
						},
						cbrown: {
							password: null,
							name: "Casey Brown",
							time: ["02:00 PM - 03:30 PM"],
							day: ["Wednesday"],
							subject: null,
							courses: [],
							profilePic: {
								url: null,
								id: null,
								transform: null,
							},
							schedule: null,
							override: {},
							links: {
								linkedin: null,
								twitter: null,
								github: null,
								instagram: null,
								youtube: null,
								facebook: null,
							},
							lastUpdate: null,
							lastLogin: null,
							roles: {
								developer: false,
								admin: false,
							},
							inactive: false,
							title: null,
							bio: null,
							permission: true,
						},
						jdavis: {
							password: null,
							name: "Jamie Davis",
							time: ["09:00 AM - 10:30 AM"],
							day: ["Friday"],
							subject: null,
							courses: [],
							profilePic: {
								url: null,
								id: null,
								transform: null,
							},
							schedule: null,
							override: {},
							links: {
								linkedin: null,
								twitter: null,
								github: null,
								instagram: null,
								youtube: null,
								facebook: null,
							},
							lastUpdate: null,
							lastLogin: null,
							roles: {
								developer: false,
								admin: false,
							},
							inactive: false,
							title: null,
							bio: null,
							permission: true,
						},
						mgreen: {
							password: null,
							name: "Morgan Green",
							time: ["11:00 AM - 12:30 PM"],
							day: ["Thursday"],
							subject: null,
							courses: [],
							profilePic: {
								url: null,
								id: null,
								transform: null,
							},
							schedule: null,
							override: {},
							links: {
								linkedin: null,
								twitter: null,
								github: null,
								instagram: null,
								youtube: null,
								facebook: null,
							},
							lastUpdate: null,
							lastLogin: null,
							roles: {
								developer: false,
								admin: false,
							},
							inactive: false,
							title: null,
							bio: null,
							permission: true,
						},
						sbrooks: {
							password: null,
							name: "Sydney Brooks",
							time: ["01:00 PM - 02:30 PM"],
							day: ["Tuesday"],
							subject: null,
							courses: [],
							profilePic: {
								url: null,
								id: null,
								transform: null,
							},
							schedule: null,
							override: {},
							links: {
								linkedin: null,
								twitter: null,
								github: null,
								instagram: null,
								youtube: null,
								facebook: null,
							},
							lastUpdate: null,
							lastLogin: null,
							roles: {
								developer: false,
								admin: false,
							},
							inactive: false,
							title: null,
							bio: null,
							permission: true,
						},
					},
				},
			},
		},
	);
	const entryPublishedTutors = await client.entry.publish(
		{ entryId: entryCreatedTutors.sys.id },
		{ ...entryCreatedTutors },
	);
	console.log("tutorsTypePublished", tutorsTypePublished);
	console.log("entryPublishedTutors", entryPublishedTutors);
	await client.entry.unpublish(
		{
			entryId: entryPublishedTutors.sys.id,
		},
		{
			...entryPublishedTutors,
		},
	);
	await client.entry.delete({
		entryId: entryPublishedTutors.sys.id,
	});
	await client.contentType.unpublish({
		contentTypeId: tutorsTypePublished.sys.id,
	});
	await client.contentType.delete({
		contentTypeId: tutorsTypePublished.sys.id,
	});
}
const client = createClient({
	accessToken: cmaToken,
	spaceId: spaceId,
});
prepareContentType(client).then((res) => {
	console.log("Prepare ContentType");
});
/*
client.contentType.getMany().then((contentTypes) => {
	console.log(contentTypes);
});*/ /*
client.entry
	.get({
		entryId: "UIushXQv9bsjZ5hAWxmUz",
	})
	.then((res) => console.log(res.fields));*/

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
