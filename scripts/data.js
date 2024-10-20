export const deptTypeFields = [
	{
		id: "title",
		name: "Title",
		type: "Symbol",
		localized: true,
		required: true,
		validations: [],
		disabled: false,
		omitted: false,
	},
	{
		id: "deptInfo",
		name: "dept_info",
		type: "Object",
		localized: true,
		required: true,
		validations: [],
		disabled: false,
		omitted: false,
	},
];
export const tutorTypeFields = [
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
];
export const mockTutors = {
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
};

export const demoUser = {
	demouser: {
		name: "Demo U.",
		time: ["8:00 AM - 10:00 AM\n"],
		day: ["Wednesday"],
		subject: "demo",
		courses: [],
		profilePic: {
			url: null,
			id: null,
			transform: null,
		},
		schedule: [
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, true, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
			[false, false, false, false],
		],
		override: {},
		links: {
			linkedin: null,
			twitter: null,
			github: null,
			instagram: null,
			youtube: null,
			facebook: null,
		},
		lastUpdate: "Sat Aug 31 2024 01:26:46 GMT-0400 (Eastern Daylight Time)",
		lastLogin: null,
		roles: {
			admin: true,
			developer: true,
		},
		inactive: false,
		title: null,
		bio: null,
		permission: true,
		status: {
			code: null,
			generatedTime: null,
		},
		user: "demouser",
	},
};
