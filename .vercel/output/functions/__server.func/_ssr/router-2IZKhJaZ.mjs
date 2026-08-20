import { n as require_jsx_runtime, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-2IZKhJaZ.js
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-CBBiin1W.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$1 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Gopal Maddheshiya | Software Engineer & Full-Stack Developer" },
			{
				name: "description",
				content: "B.Tech CSE student focused on Java, DSA and full-stack web development."
			},
			{
				name: "author",
				content: "Gopal Maddheshiya"
			},
			{
				property: "og:site_name",
				content: "Gopal Maddheshiya"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.svg?v=2",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$1.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var node_chat_default = "/assets/node-chat-p_mDeCHf.png";
var job_card_default = "/assets/job-card-Dz7OzObC.png";
var weather_default = "/assets/weather-DnKeCLEh.png";
var PERSONAL_INFO = {
	name: "Gopal Maddheshiya",
	role: "Software Engineer",
	subtitle: "Java & MERN Stack Developer · DSA & API Integration",
	location: "Maharajganj, Uttar Pradesh, India",
	email: "gopalmaddheshiya138@gmail.com",
	phone: "+91 6388354988",
	whatsapp: "916388354988",
	github: "https://github.com/gopal-maddheshiya",
	githubUsername: "gopal-maddheshiya",
	leetcode: "https://leetcode.com/u/gopal-maddheshiya/",
	leetcodeUsername: "gopal-maddheshiya",
	linkedin: "https://www.linkedin.com/in/gopal-maddheshiya",
	resume: "/gopal-cv.pdf",
	siteDescription: "B.Tech CSE student focused on Java, Data Structures & Algorithms and full-stack web development with the MERN stack."
};
var HIGHLIGHTS = [
	{
		label: "B.Tech CSE",
		detail: "2024–2028 · CGPA 7.62",
		section: "about",
		icon: "grad"
	},
	{
		label: "Java + DSA",
		detail: "Daily problem solving",
		section: "dsa",
		icon: "code"
	},
	{
		label: "50+ Problems",
		detail: "Solved on LeetCode",
		section: "dsa",
		icon: "trophy"
	},
	{
		label: "MERN Stack",
		detail: "React · Node · Mongo",
		section: "projects",
		icon: "db"
	},
	{
		label: "Verified Credentials",
		detail: "SRMU & Web Certificates",
		section: "certifications",
		icon: "award"
	},
	{
		label: "Summer 2026",
		detail: "Open to SWE Roles",
		section: "contact",
		icon: "sparkles"
	}
];
var FOCUS_AREAS = [
	"Advanced Java & DSA",
	"Problem Solving",
	"Web Development",
	"Building Projects",
	"Software Engineering Fundamentals"
];
var SKILL_GROUPS = [
	{
		title: "Programming & DSA",
		skills: [
			"Java",
			"Data Structures",
			"Algorithms",
			"OOP Concepts",
			"Complexity Analysis"
		],
		primary: true
	},
	{
		title: "Frontend",
		skills: [
			"HTML",
			"CSS",
			"JavaScript",
			"React.js",
			"Responsive Design"
		],
		primary: true
	},
	{
		title: "Backend",
		skills: [
			"Node.js",
			"Express.js",
			"REST APIs",
			"CRUD Operations"
		],
		primary: true
	},
	{
		title: "Databases",
		skills: [
			"MongoDB",
			"Mongoose",
			"MySQL"
		],
		primary: false
	},
	{
		title: "Developer Tools",
		skills: [
			"Git",
			"GitHub",
			"VS Code",
			"IntelliJ IDEA",
			"Antigravity",
			"Postman",
			"LeetCode"
		],
		primary: false
	},
	{
		title: "CS Fundamentals",
		skills: [
			"OOP",
			"Operating Systems",
			"DBMS",
			"Computer Networks"
		],
		primary: false
	}
];
var PROJECTS = [
	{
		title: "Weather Application",
		year: "2025",
		summary: "A responsive weather app that answers “what's the weather where I am, right now?” in a single interaction.",
		problem: "Checking weather across multiple saved cities usually means repeated searches. This app keeps favourites and location detection one tap away.",
		technologies: [
			"HTML",
			"CSS",
			"JavaScript",
			"OpenWeatherMap API"
		],
		features: [
			"Search weather by city name",
			"Current location detection",
			"Celsius / Fahrenheit toggle",
			"Favourite locations & refresh",
			"3-day forecast",
			"Fully responsive layout"
		],
		image: weather_default,
		githubUrl: "https://github.com/gopal-maddheshiya/weather-app",
		liveUrl: "https://gopal-maddheshiya.github.io/weather-app/",
		featured: true
	},
	{
		title: "Node Chat API",
		year: "2025",
		summary: "A chat-based web application backed by an Express REST API and MongoDB persistence.",
		problem: "Built to understand how message data flows end to end — from UI events to API routes to database documents.",
		technologies: [
			"Node.js",
			"Express.js",
			"MongoDB",
			"JavaScript",
			"HTML/CSS"
		],
		features: [
			"Manual sender / receiver selection",
			"CRUD operations on messages",
			"Dynamic UI rendering from API data",
			"MongoDB-backed persistence"
		],
		image: node_chat_default,
		githubUrl: "https://github.com/gopal-maddheshiya/node-chat-api",
		liveUrl: "https://node-chat-api-luk6.onrender.com/chats",
		featured: true
	},
	{
		title: "Job Card UI (React)",
		year: "2026",
		summary: "An interactive React interface for comparing job roles and salary details side by side.",
		problem: "Comparing roles across tabs is tedious; this UI renders roles as comparable cards from a single data source.",
		technologies: [
			"React.js",
			"JavaScript",
			"CSS"
		],
		features: [
			"Reusable dynamic components",
			"Data-driven rendering",
			"Role and salary comparison view"
		],
		image: job_card_default,
		githubUrl: "https://github.com/gopal-maddheshiya/react-learning/tree/main/04-cards-project",
		liveUrl: "https://react-learning-gyof.onrender.com/",
		featured: true
	}
];
var DSA_INFO = {
	problemsSolved: "50+",
	language: "Java",
	repoName: "dsa-with-java",
	repoUrl: "https://github.com/gopal-maddheshiya/dsa-with-java",
	topics: [
		"Arrays",
		"Strings",
		"Recursion",
		"Sorting",
		"Searching",
		"Trees (learning)",
		"Graphs (learning)"
	],
	notes: [
		"Solutions organised by topic and pattern",
		"Multiple approaches where the trade-off matters",
		"Time and space complexity noted with each solution"
	]
};
var CODING_PROFILES = [
	{
		name: "LeetCode",
		url: PERSONAL_INFO.leetcode,
		username: PERSONAL_INFO.leetcodeUsername,
		description: "Java solutions and ongoing problem-solving practice.",
		icon: "code"
	},
	{
		name: "GeeksforGeeks",
		url: "https://www.geeksforgeeks.org/profile/gopalmaddheshiya",
		username: "gopalmaddheshiya",
		description: "Coding practice and data structures learning.",
		icon: "terminal"
	},
	{
		name: "CodeChef",
		url: "https://www.codechef.com/users/gopal_code_96",
		username: "gopal_code_96",
		description: "Competitive programming and algorithm practice.",
		icon: "codechef"
	},
	{
		name: "HackerRank",
		url: "https://www.hackerrank.com/profile/gopalmaddheshiy1",
		username: "gopalmaddheshiy1",
		description: "Problem solving challenges and skills badges.",
		icon: "trophy"
	},
	{
		name: "Codeforces",
		url: "",
		username: "",
		description: "",
		icon: "braces"
	}
];
var JOURNEY = [
	{
		phase: "01",
		title: "Java Fundamentals & OOP",
		detail: "Object-oriented principles, classes, inheritance, collections framework, and clean code structure.",
		status: "done",
		tags: [
			"Java",
			"OOP",
			"Collections"
		]
	},
	{
		phase: "02",
		title: "Core Data Structures",
		detail: "Arrays, strings, recursion, sorting algorithms, and searching techniques with Big-O complexity analysis.",
		status: "done",
		tags: [
			"Arrays",
			"Recursion",
			"Big-O"
		]
	},
	{
		phase: "03",
		title: "Daily LeetCode Problem Solving",
		detail: "50+ problems solved in Java, mastering two-pointer, sliding window, and recursion patterns.",
		status: "active",
		tags: [
			"LeetCode",
			"Java",
			"Algorithms"
		]
	},
	{
		phase: "04",
		title: "Full-Stack Web Development",
		detail: "Building end-to-end applications with React interfaces, Express REST APIs, and MongoDB persistence.",
		status: "active",
		tags: [
			"React",
			"Node.js",
			"MongoDB"
		]
	},
	{
		phase: "05",
		title: "Trees, Graphs & Advanced Patterns",
		detail: "Currently practicing binary search trees, tree traversals, graph algorithms (BFS/DFS), and dynamic programming.",
		status: "next",
		tags: [
			"Trees",
			"Graphs",
			"DP"
		]
	},
	{
		phase: "06",
		title: "System Fundamentals & Architecture",
		detail: "Deepening understanding of database indexing, REST design patterns, and deployment pipelines.",
		status: "next",
		tags: [
			"System Basics",
			"Databases",
			"APIs"
		]
	}
];
var EDUCATION = [
	{
		title: "B.Tech, Computer Science Engineering",
		org: "Shri Ramswaroop Memorial University",
		period: "2024 – 2028",
		detail: "CGPA 7.62"
	},
	{
		title: "Class XII",
		org: "Modern Academy",
		period: "2024",
		detail: ""
	},
	{
		title: "Class X",
		org: "Modern Academy",
		period: "2021",
		detail: ""
	}
];
var CERTIFICATIONS = [
	{
		title: "Find The Language",
		org: "Shri Ramswaroop Memorial University",
		period: "Feb 2026",
		detail: "Critical thinking, problem-solving, and algorithmic programming contest.",
		skills: [
			"Problem Solving",
			"Logic",
			"Java"
		],
		certificateUrl: "/certificates/find-the-language.pdf"
	},
	{
		title: "HTML Course Completion",
		org: "Prashant Jain",
		period: "Nov 2024",
		detail: "Semantic HTML5, DOM architecture, web accessibility, and page layout structuring.",
		skills: [
			"HTML5",
			"Semantic Web",
			"DOM"
		],
		certificateUrl: "/certificates/html-certificate.pdf"
	},
	{
		title: "CSS Course Completion",
		org: "Prashant Jain",
		period: "Nov 2024",
		detail: "Modern CSS layout models, Flexbox, CSS Grid, responsive design, and transitions.",
		skills: [
			"CSS3",
			"Flexbox",
			"CSS Grid",
			"Responsive Design"
		],
		certificateUrl: "/certificates/css-certificate.pdf"
	}
];
var NAV_LINKS = [
	{
		id: "about",
		label: "About"
	},
	{
		id: "skills",
		label: "Skills"
	},
	{
		id: "projects",
		label: "Projects"
	},
	{
		id: "dsa",
		label: "DSA"
	},
	{
		id: "profiles",
		label: "Profiles"
	},
	{
		id: "certifications",
		label: "Certificates"
	},
	{
		id: "contact",
		label: "Contact"
	}
];
var $$splitComponentImporter = () => import("./routes-D1blmvfi.mjs");
var TITLE = "Gopal Maddheshiya | Software Engineer & Full-Stack Developer";
var DESCRIPTION = "Portfolio of Gopal Maddheshiya, a Computer Science Engineering student focused on Java, Data Structures & Algorithms and full-stack web development with React, Node.js and MongoDB.";
var rootRouteChildren = { IndexRoute: createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({
		meta: [
			{ title: TITLE },
			{
				name: "description",
				content: DESCRIPTION
			},
			{
				property: "og:title",
				content: TITLE
			},
			{
				property: "og:description",
				content: DESCRIPTION
			},
			{
				property: "og:type",
				content: "profile"
			},
			{
				property: "og:url",
				content: "/"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: TITLE
			},
			{
				name: "twitter:description",
				content: DESCRIPTION
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Person",
				name: PERSONAL_INFO.name,
				jobTitle: PERSONAL_INFO.role,
				email: `mailto:${PERSONAL_INFO.email}`,
				address: PERSONAL_INFO.location,
				sameAs: [
					PERSONAL_INFO.github,
					PERSONAL_INFO.leetcode,
					PERSONAL_INFO.linkedin
				],
				knowsAbout: [
					"Java",
					"Data Structures and Algorithms",
					"React",
					"Node.js",
					"MongoDB"
				]
			})
		}]
	})
}).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { EDUCATION as a, JOURNEY as c, PROJECTS as d, SKILL_GROUPS as f, DSA_INFO as i, NAV_LINKS as l, CERTIFICATIONS as n, FOCUS_AREAS as o, CODING_PROFILES as r, HIGHLIGHTS as s, router_exports as t, PERSONAL_INFO as u };
