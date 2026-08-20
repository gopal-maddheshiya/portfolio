import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { a as EDUCATION, c as JOURNEY, d as PROJECTS, f as SKILL_GROUPS, i as DSA_INFO, l as NAV_LINKS, n as CERTIFICATIONS, o as FOCUS_AREAS, r as CODING_PROFILES, s as HIGHLIGHTS, u as PERSONAL_INFO } from "./router-2IZKhJaZ.mjs";
import { A as ArrowUpRight, C as Code, D as CircleCheck, E as CircleDot, O as CircleAlert, S as Cpu, T as Clock, _ as FileText, a as Sun, b as Download, c as Moon, d as MapPin, f as Mail, g as Github, h as GraduationCap, i as Terminal, j as ArrowRight, k as Award, l as MessageCircle, m as Linkedin, n as X, o as Sparkles, p as LoaderCircle, r as Trophy, s as Phone, t as Zap, u as Menu, v as FileCheck, w as CodeXml, x as Database, y as ExternalLink } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as es_default } from "../_libs/emailjs__browser.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D1blmvfi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Wraps content in a subtle fade-up reveal driven by IntersectionObserver. */
function Reveal({ children, className, delay = 0, as: Tag = "div" }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const node = ref.current;
		if (!node) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (entry?.isIntersecting) {
				node.classList.add("is-visible");
				observer.disconnect();
			}
		}, { threshold: .12 });
		observer.observe(node);
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		ref,
		className: cn("reveal", className),
		style: { transitionDelay: `${delay}ms` },
		children
	});
}
function SectionHeading({ eyebrow, title, description, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("max-w-2xl", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-[0.18em] text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2.5 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground",
				children: description
			}) : null
		]
	});
}
function Section({ id, children, className, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: cn("scroll-mt-20 sm:scroll-mt-24 border-t border-border py-12 sm:py-18 lg:py-24", tone === "surface" && "bg-surface", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children
		})
	});
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "about",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "About Me",
			title: "Passionate about problem solving & engineering web apps.",
			description: "A computer science student combining algorithmic rigor in Java with practical full-stack product development."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 sm:mt-12 grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:col-span-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					className: "rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-mono text-xs text-primary font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "size-3.5",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Background & Philosophy" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-xl sm:text-2xl font-semibold text-foreground",
							children: "A developer who learns by building, solving, and iterating."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3.5 text-sm sm:text-base leading-relaxed text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"I'm a Computer Science Engineering student at",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: "Shri Ramswaroop Memorial University"
								}),
								", actively preparing for software engineering roles. My daily work revolves around two pillars: solving algorithmic problems in Java and engineering end-to-end web applications."
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "On the algorithmic side, I practice problem-solving daily on LeetCode with deliberate focus on time and space complexity. On the development side, I turn ideas into responsive React interfaces backed by Express REST APIs and MongoDB databases." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 pt-6 border-t border-border grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-colors hover:border-primary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mt-2 text-xs font-semibold text-foreground",
											children: "Java & DSA"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-muted-foreground leading-snug",
											children: "Algorithmic thinking & Big-O complexity analysis."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-colors hover:border-primary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mt-2 text-xs font-semibold text-foreground",
											children: "MERN Stack"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-muted-foreground leading-snug",
											children: "End-to-end full stack web applications."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/80 bg-surface/60 p-3.5 transition-colors hover:border-primary/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "mt-2 text-xs font-semibold text-foreground",
											children: "Clean Code"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] text-muted-foreground leading-snug",
											children: "Modular architecture & structured git commits."
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-mono",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PERSONAL_INFO.location })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-mono text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex size-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-primary" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open for Summer 2026 Opportunities" })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 60,
					className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-muted-foreground uppercase tracking-wider",
						children: "Current Learning & Focus Areas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: FOCUS_AREAS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs text-secondary-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
						}, item))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:col-span-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 40,
					className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "font-mono text-xs text-primary font-medium uppercase tracking-wider",
						children: "Profile Snapshot"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3.5 grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-surface/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-muted-foreground",
										children: "Degree"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm font-semibold text-foreground",
										children: "B.Tech CSE"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-primary mt-0.5",
										children: "CGPA 7.62"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-surface/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-muted-foreground",
										children: "DSA Practice"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm font-semibold text-foreground",
										children: "50+ Solved"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-muted-foreground mt-0.5",
										children: "LeetCode Java"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-surface/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-muted-foreground",
										children: "Primary Stack"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm font-semibold text-foreground",
										children: "Java & MERN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-muted-foreground mt-0.5",
										children: "Full-Stack"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-surface/60 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-muted-foreground",
										children: "Graduation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm font-semibold text-foreground",
										children: "2028 Batch"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] font-mono text-primary mt-0.5",
										children: "SRMU University"
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: 80,
					className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 font-display text-base font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Education" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-4",
							children: EDUCATION.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-l-2 border-border pl-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-foreground",
											children: item.title
										}), item.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs text-primary font-medium",
											children: item.detail
										}) : null]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-xs text-muted-foreground",
										children: item.org
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 font-mono text-[11px] text-muted-foreground/70",
										children: item.period
									})
								]
							}, item.title))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 border-t border-border/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted-foreground uppercase tracking-wider",
								children: "Relevant Coursework"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2.5 flex flex-wrap gap-1.5",
								children: [
									"Data Structures & Algorithms",
									"Design & Analysis of Algorithms",
									"Object-Oriented Programming (Java)",
									"Database Management Systems",
									"Operating Systems",
									"Software Engineering",
									"Cloud Computing (AWS)",
									"Web Development"
								].map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground",
									children: course
								}, course))
							})]
						})
					]
				})]
			})]
		})]
	});
}
function Certifications() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "certifications",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Certifications & Achievements",
			title: "Verified Credentials",
			description: "Course completions, technical certifications, and university academic achievements."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: CERTIFICATIONS.map((cert, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: index * 60,
				className: "rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-primary/40 hover:shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, {
								className: "size-5 shrink-0",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-md",
							children: cert.period
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-base sm:text-lg font-semibold text-foreground",
						children: cert.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs font-mono text-primary font-medium",
						children: cert.org
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground",
						children: cert.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 pt-3 border-t border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-wrap gap-1.5",
							children: cert.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground",
								children: skill
							}, skill))
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 pt-4 border-t border-border/80",
					children: cert.certificateUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: cert.certificateUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all active:scale-[0.98] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
								className: "size-3.5 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Certificate" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: cert.certificateUrl,
							download: true,
							className: "inline-flex items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80 p-2.5 text-muted-foreground hover:text-foreground transition-colors active:scale-[0.98] cursor-pointer",
							"aria-label": `Download ${cert.title} certificate`,
							title: "Download Certificate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4",
								"aria-hidden": "true"
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-xs font-mono text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verified Credential" })]
					})
				})]
			}, cert.title))
		})]
	});
}
var EMPTY = {
	name: "",
	email: "",
	subject: "",
	message: ""
};
function buildMessage({ name, email, subject, message }) {
	return `Hello Gopal,

Name: ${name}
Email: ${email}
Subject: ${subject || "General Enquiry"}

${message}`;
}
var inputClass = "w-full rounded-md border border-input bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none disabled:opacity-60 disabled:cursor-not-allowed";
function Contact() {
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const [error, setError] = (0, import_react.useState)("");
	const [success, setSuccess] = (0, import_react.useState)("");
	const [sending, setSending] = (0, import_react.useState)(false);
	const update = (key) => (event) => {
		setForm((prev) => ({
			...prev,
			[key]: event.target.value
		}));
		if (error) setError("");
		if (success) setSuccess("");
	};
	const validate = () => {
		const trimmedName = form.name.trim();
		const trimmedEmail = form.email.trim();
		const trimmedMessage = form.message.trim();
		if (!trimmedName) {
			setError("Please enter your name.");
			setSuccess("");
			return false;
		}
		if (!trimmedEmail) {
			setError("Please enter your email address.");
			setSuccess("");
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			setError("Please enter a valid email address.");
			setSuccess("");
			return false;
		}
		if (!trimmedMessage) {
			setError("Please enter your message.");
			setSuccess("");
			return false;
		}
		setError("");
		return true;
	};
	const handleWhatsApp = (event) => {
		if (event) event.preventDefault();
		if (!validate()) return;
		const text = encodeURIComponent(buildMessage(form));
		window.open(`https://wa.me/${PERSONAL_INFO.whatsapp}?text=${text}`, "_blank", "noopener,noreferrer");
	};
	const handleEmail = async (event) => {
		if (event) event.preventDefault();
		if (!validate()) return;
		setSending(true);
		setError("");
		setSuccess("");
		try {
			await es_default.send("service_njyc3k2", "template_il42ptj", {
				name: form.name.trim(),
				from_name: form.name.trim(),
				user_name: form.name.trim(),
				email: form.email.trim(),
				from_email: form.email.trim(),
				user_email: form.email.trim(),
				reply_to: form.email.trim(),
				to_name: "Gopal Maddheshiya",
				subject: form.subject.trim() || `Portfolio enquiry from ${form.name.trim()}`,
				message: form.message.trim()
			}, { publicKey: "-7KHeknrjHN-f2QH5" });
			setForm(EMPTY);
			setSuccess("Your message has been sent successfully! I'll get back to you soon.");
		} catch (err) {
			console.error("EmailJS error:", err);
			setError("Unable to send your message via email right now. Please try WhatsApp or email directly.");
		} finally {
			setSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "contact",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Contact",
			title: "Let's build something useful.",
			description: "Have an internship opportunity, project idea, or simply want to connect? Send me a message."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 sm:mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleEmail,
				noValidate: true,
				className: "rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "name",
							className: "text-xs sm:text-sm font-medium text-foreground",
							children: ["Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "name",
							name: "name",
							required: true,
							disabled: sending,
							autoComplete: "name",
							value: form.name,
							onChange: update("name"),
							placeholder: "Your name",
							className: `mt-1.5 sm:mt-2 ${inputClass}`
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "email",
							className: "text-xs sm:text-sm font-medium text-foreground",
							children: ["Email ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "email",
							name: "email",
							type: "email",
							required: true,
							disabled: sending,
							autoComplete: "email",
							value: form.email,
							onChange: update("email"),
							placeholder: "you@company.com",
							className: `mt-1.5 sm:mt-2 ${inputClass}`
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 sm:mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "subject",
							className: "text-xs sm:text-sm font-medium text-foreground",
							children: "Subject"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "subject",
							name: "subject",
							disabled: sending,
							value: form.subject,
							onChange: update("subject"),
							placeholder: "Internship opportunity / Project inquiry",
							className: `mt-1.5 sm:mt-2 ${inputClass}`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 sm:mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: "message",
							className: "text-xs sm:text-sm font-medium text-foreground",
							children: ["Message ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "message",
							name: "message",
							required: true,
							disabled: sending,
							rows: 5,
							value: form.message,
							onChange: update("message"),
							placeholder: "Tell me a bit about the role or project.",
							className: `mt-1.5 sm:mt-2 resize-y ${inputClass}`
						})]
					}),
					success ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "status",
						className: "mt-4 flex items-start gap-2.5 rounded-lg border border-primary/30 bg-primary/10 p-3 text-xs sm:text-sm text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							className: "size-4 shrink-0 mt-0.5",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: success })]
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "alert",
						className: "mt-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs sm:text-sm text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
							className: "size-4 shrink-0 mt-0.5",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 sm:mt-6 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => handleWhatsApp(),
							disabled: sending,
							className: "inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-xs sm:text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 shadow-soft cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send via WhatsApp" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: sending,
							className: "inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border-strong bg-secondary/60 px-5 py-3 text-xs sm:text-sm font-medium transition-all hover:bg-secondary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
							children: sending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								className: "size-4 shrink-0 animate-spin",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sending..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send via Email" })] })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[11px] sm:text-xs text-muted-foreground",
						children: "WhatsApp opens in a new tab. Email is delivered directly to my inbox."
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: 80,
				className: "rounded-xl border border-border bg-card p-4 sm:p-6 md:p-8 flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base sm:text-lg font-semibold",
					children: "Direct contact"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 sm:mt-5 space-y-3.5 sm:space-y-4 text-xs sm:text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "inline-flex items-center gap-2.5 sm:gap-3 text-muted-foreground transition-colors hover:text-foreground break-all",
							href: `mailto:${PERSONAL_INFO.email}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
								className: "size-4 text-primary shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PERSONAL_INFO.email })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "inline-flex items-center gap-2.5 sm:gap-3 text-muted-foreground transition-colors hover:text-foreground",
							href: `https://wa.me/${PERSONAL_INFO.whatsapp}`,
							target: "_blank",
							rel: "noopener noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "size-4 text-primary shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PERSONAL_INFO.phone })]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "inline-flex items-center gap-2.5 sm:gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "size-4 text-primary shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PERSONAL_INFO.location })]
						})
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 sm:mt-8 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PERSONAL_INFO.github,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "GitHub profile",
							className: "flex size-10 sm:size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PERSONAL_INFO.linkedin,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "LinkedIn profile",
							className: "flex size-10 sm:size-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PERSONAL_INFO.leetcode,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "LeetCode profile",
							className: "flex size-10 sm:size-11 items-center justify-center rounded-md border border-border font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
							children: "LC"
						})
					]
				})]
			})]
		})]
	});
}
function DSA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "dsa",
		tone: "surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "DSA & Problem Solving",
			title: "Consistent Practice in Java",
			description: "Daily algorithmic problem solving focused on writing efficient code and understanding time & space complexity."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 sm:mt-10 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 font-mono text-xs text-primary font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LeetCode Practice" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-medium text-primary",
							children: DSA_INFO.language
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-baseline gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground",
							children: DSA_INFO.problemsSolved
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs sm:text-sm text-muted-foreground",
							children: "Problems Solved Daily"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground",
						children: "Practicing fundamental and intermediate problem patterns on LeetCode with full complexity notes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 pt-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted-foreground uppercase tracking-wider",
							children: "Topics Covered"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2.5 flex flex-wrap gap-1.5 sm:gap-2",
							children: DSA_INFO.topics.map((topic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "inline-flex items-center rounded-md border border-border bg-secondary/80 px-2.5 py-1 font-mono text-xs text-secondary-foreground",
								children: topic
							}, topic))
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 pt-4 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: PERSONAL_INFO.leetcode,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View LeetCode Profile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
							className: "size-4 shrink-0",
							"aria-hidden": "true"
						})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: 80,
				className: "rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 font-mono text-xs text-primary font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DSA Solutions Repository" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded bg-secondary px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground",
							children: "GitHub Repo"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono",
						children: DSA_INFO.repoName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground",
						children: "A structured public repository containing Java solutions organized by topic, data structure, and problem patterns."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 pt-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-muted-foreground uppercase tracking-wider",
							children: "Key Repository Highlights"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2.5 space-y-2 text-xs sm:text-sm text-muted-foreground",
							children: DSA_INFO.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									className: "size-3.5 shrink-0 mt-0.5 text-primary",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: note })]
							}, note))
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 pt-4 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: DSA_INFO.repoUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-border-strong bg-secondary/60 px-5 py-3 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
							className: "size-4 shrink-0 text-muted-foreground",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Explore DSA Repository" })]
					})
				})]
			})]
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border py-8 sm:py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-base font-semibold",
					children: PERSONAL_INFO.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-xs text-xs sm:text-sm text-muted-foreground",
					children: "Software Engineer — Java, DSA and full-stack web development."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Footer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-2 text-xs sm:text-sm",
						children: NAV_LINKS.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `#${link.id}`,
							className: "text-muted-foreground transition-colors hover:text-foreground",
							children: link.label
						}) }, link.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PERSONAL_INFO.github,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "GitHub profile",
							className: "flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PERSONAL_INFO.leetcode,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "LeetCode profile",
							className: "flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PERSONAL_INFO.linkedin,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "LinkedIn profile",
							className: "flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `mailto:${PERSONAL_INFO.email}`,
							"aria-label": "Send an email",
							className: "flex size-9 sm:size-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})
						}) })
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page mt-8 sm:mt-10 border-t border-border pt-5 sm:pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] sm:text-xs text-muted-foreground",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					PERSONAL_INFO.name,
					". Built with code and continuous learning."
				]
			})
		})]
	});
}
var gopal_profile_default = "/assets/gopal-profile-B1iFmASS.jpg";
var TYPING_ROLES = [
	"Software Engineer",
	"Full-Stack Developer",
	"Java & DSA Developer",
	"Problem Solver"
];
function TypewriterRole() {
	const [roleIndex, setRoleIndex] = (0, import_react.useState)(0);
	const [currentText, setCurrentText] = (0, import_react.useState)("");
	const [isDeleting, setIsDeleting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const currentRole = TYPING_ROLES[roleIndex] || "";
		const typingSpeed = isDeleting ? 35 : 75;
		const pauseTime = isDeleting ? 300 : 2e3;
		if (!isDeleting && currentText === currentRole) {
			const timeout = setTimeout(() => setIsDeleting(true), pauseTime);
			return () => clearTimeout(timeout);
		}
		if (isDeleting && currentText === "") {
			setIsDeleting(false);
			setRoleIndex((prev) => (prev + 1) % TYPING_ROLES.length);
			return;
		}
		const timeout = setTimeout(() => {
			setCurrentText(isDeleting ? currentRole.slice(0, currentText.length - 1) : currentRole.slice(0, currentText.length + 1));
		}, typingSpeed);
		return () => clearTimeout(timeout);
	}, [
		currentText,
		isDeleting,
		roleIndex
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "text-primary inline-flex items-baseline whitespace-nowrap",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: currentText }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-block w-[3px] h-[0.85em] ml-1 bg-primary align-middle animate-pulse",
			"aria-hidden": "true"
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "top",
		className: "relative overflow-hidden pt-6 pb-12 sm:py-16 md:py-20 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": "true",
			className: "grid-backdrop pointer-events-none absolute inset-0"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "container-page relative grid gap-10 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 font-mono text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-1.5 rounded-full bg-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hi, I'm Gopal Maddheshiya" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-[3.1rem] font-bold leading-[1.22] tracking-tight text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Building software as a " }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block min-h-[1.25em] whitespace-nowrap",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypewriterRole, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground",
						children: "Computer Science student at SRMU. I practice Data Structures & Algorithms in Java daily, and build practical full-stack web applications with React, Node.js, Express, and MongoDB."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
							className: "size-4 text-primary shrink-0",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: PERSONAL_INFO.location })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 sm:mt-8 flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#projects",
							className: "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90 active:scale-[0.99] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View my work" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: PERSONAL_INFO.resume,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-border-strong bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary active:scale-[0.99] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4 shrink-0 text-muted-foreground",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download resume" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5 sm:gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground",
								href: PERSONAL_INFO.github,
								target: "_blank",
								rel: "noopener noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
									className: "size-4 shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GitHub" })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground",
								href: PERSONAL_INFO.leetcode,
								target: "_blank",
								rel: "noopener noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, {
									className: "size-4 shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LeetCode" })]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								className: "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs sm:text-sm text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground",
								href: PERSONAL_INFO.linkedin,
								target: "_blank",
								rel: "noopener noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {
									className: "size-4 shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LinkedIn" })]
							}) })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center lg:justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-2xl border-2 border-border bg-card shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gopal_profile_default,
							alt: "Gopal Maddheshiya",
							width: 420,
							height: 500,
							className: "w-64 h-72 sm:w-72 sm:h-80 md:w-80 md:h-96 lg:w-[21rem] lg:h-[25rem] object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-105"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent p-4 sm:p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm sm:text-base font-semibold text-foreground",
								children: "Gopal Maddheshiya"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Java & MERN Developer"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex size-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-primary-foreground" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Online" })]
							})]
						})]
					})
				})
			})]
		})]
	});
}
var ICONS_MAP = {
	grad: GraduationCap,
	code: CodeXml,
	trophy: Trophy,
	db: Database,
	award: Award,
	sparkles: Sparkles
};
var MARQUEE_ITEMS = [
	...HIGHLIGHTS,
	...HIGHLIGHTS,
	...HIGHLIGHTS,
	...HIGHLIGHTS
];
function Highlights() {
	const containerRef = (0, import_react.useRef)(null);
	const trackRef = (0, import_react.useRef)(null);
	const [isHovered, setIsHovered] = (0, import_react.useState)(false);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const posRef = (0, import_react.useRef)(0);
	const scrollVelocityRef = (0, import_react.useRef)(0);
	const lastScrollYRef = (0, import_react.useRef)(0);
	const directionRef = (0, import_react.useRef)(-1);
	const dragStartXRef = (0, import_react.useRef)(0);
	const dragStartPosRef = (0, import_react.useRef)(0);
	const hasDraggedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let scrollTimeout;
		const onScroll = () => {
			const currentScrollY = window.scrollY;
			const delta = currentScrollY - lastScrollYRef.current;
			lastScrollYRef.current = currentScrollY;
			if (Math.abs(delta) > .5) {
				directionRef.current = delta > 0 ? -1 : 1;
				scrollVelocityRef.current = Math.min(Math.abs(delta) * .18, 4) * directionRef.current;
			}
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				scrollVelocityRef.current = 0;
			}, 150);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			clearTimeout(scrollTimeout);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let animId;
		const animate = () => {
			const track = trackRef.current;
			if (track && !isDragging) {
				const currentSpeed = (isHovered ? .2 : .7) * directionRef.current + scrollVelocityRef.current;
				scrollVelocityRef.current *= .94;
				posRef.current += currentSpeed;
				const halfWidth = track.scrollWidth / 2;
				if (halfWidth > 0) {
					if (posRef.current <= -halfWidth) posRef.current += halfWidth;
					else if (posRef.current >= 0) posRef.current -= halfWidth;
				}
				track.style.transform = `translate3d(${posRef.current.toFixed(2)}px, 0, 0)`;
			}
			animId = requestAnimationFrame(animate);
		};
		animId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animId);
	}, [isHovered, isDragging]);
	const handleMouseDown = (e) => {
		setIsDragging(true);
		hasDraggedRef.current = false;
		dragStartXRef.current = e.clientX;
		dragStartPosRef.current = posRef.current;
	};
	const handleMouseMove = (e) => {
		if (!isDragging) return;
		const deltaX = e.clientX - dragStartXRef.current;
		if (Math.abs(deltaX) > 4) hasDraggedRef.current = true;
		posRef.current = dragStartPosRef.current + deltaX;
		const track = trackRef.current;
		if (track) {
			const halfWidth = track.scrollWidth / 2;
			if (halfWidth > 0) {
				if (posRef.current <= -halfWidth) posRef.current += halfWidth;
				else if (posRef.current >= 0) posRef.current -= halfWidth;
			}
			track.style.transform = `translate3d(${posRef.current.toFixed(2)}px, 0, 0)`;
		}
	};
	const handleMouseUp = () => {
		setIsDragging(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		"aria-label": "Profile highlights",
		className: "relative py-4 sm:py-6 overflow-hidden border-y border-border/70 bg-surface/40 backdrop-blur-xs select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-28 bg-gradient-to-r from-background via-background/80 to-transparent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": "true",
				className: "pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-28 bg-gradient-to-l from-background via-background/80 to-transparent"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				onMouseEnter: () => setIsHovered(true),
				onMouseLeave: () => {
					setIsHovered(false);
					setIsDragging(false);
				},
				onMouseDown: handleMouseDown,
				onMouseMove: handleMouseMove,
				onMouseUp: handleMouseUp,
				className: `w-full overflow-hidden flex items-center ${isDragging ? "cursor-grabbing" : "cursor-grab"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: trackRef,
					className: "flex items-center gap-3.5 sm:gap-5 whitespace-nowrap will-change-transform py-1",
					children: MARQUEE_ITEMS.map((item, index) => {
						const Icon = item.icon && ICONS_MAP[item.icon] || CodeXml;
						const isOpportunity = item.label.includes("Summer");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: item.section ? `#${item.section}` : void 0,
							onClick: (e) => {
								if (hasDraggedRef.current) e.preventDefault();
							},
							className: "group inline-flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-soft active:scale-[0.98]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-primary shadow-xs transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:scale-105",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5 shrink-0",
									"aria-hidden": "true"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-sm sm:text-base font-bold text-foreground tracking-tight transition-colors group-hover:text-primary",
										children: item.label
									}), isOpportunity ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative flex size-2 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-primary" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3 text-muted-foreground/50 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground font-mono",
									children: item.detail
								})]
							})]
						}, `${item.label}-${index}`);
					})
				})
			})
		]
	});
}
var STATUS_CONFIG = {
	done: {
		label: "Completed",
		icon: CircleCheck,
		badgeClass: "bg-primary/10 text-primary border-primary/20",
		cardClass: "border-border hover:border-primary/40"
	},
	active: {
		label: "In Progress",
		icon: CircleDot,
		badgeClass: "bg-primary/15 text-primary border-primary/30 font-semibold",
		cardClass: "border-primary/40 shadow-xs"
	},
	next: {
		label: "Next Up",
		icon: Clock,
		badgeClass: "bg-secondary text-muted-foreground border-border",
		cardClass: "border-border hover:border-border-strong"
	}
};
function Journey() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "journey",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Learning Roadmap",
			title: "Continuous Skill Development",
			description: "A structured view of my engineering journey — from algorithmic foundations to full-stack systems."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: JOURNEY.map((step, index) => {
				const config = STATUS_CONFIG[step.status];
				const StatusIcon = config.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
					delay: index * 50,
					className: cn("rounded-2xl border bg-card p-5 sm:p-6 transition-all hover:shadow-soft flex flex-col justify-between", config.cardClass),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs font-medium text-muted-foreground",
								children: ["Phase ", step.phase]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider", config.badgeClass),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, {
									className: "size-3 shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: config.label })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3.5 font-display text-base sm:text-lg font-semibold text-foreground",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground",
							children: step.detail
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 pt-3 border-t border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-wrap gap-1.5",
							children: step.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground",
								children: tag
							}, tag))
						})
					})]
				}, step.title);
			})
		})]
	});
}
/** Tracks which section id is currently in view, for navbar highlighting. */
function useActiveSection(ids) {
	const [active, setActive] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const observer = new IntersectionObserver((entries) => {
			const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
			if (visible) setActive(visible.target.id);
		}, {
			rootMargin: "-45% 0px -50% 0px",
			threshold: [
				0,
				.25,
				.5,
				1
			]
		});
		ids.forEach((id) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, [ids]);
	return active;
}
var STORAGE_KEY = "portfolio-theme";
function applyTheme(theme) {
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.style.colorScheme = theme;
}
/** Theme state persisted in localStorage, defaulting to the system preference. */
function useTheme() {
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initial = stored ?? (prefersDark ? "dark" : "light");
		setTheme(initial);
		applyTheme(initial);
		setMounted(true);
	}, []);
	return {
		theme,
		toggleTheme: (0, import_react.useCallback)(() => {
			setTheme((current) => {
				const next = current === "dark" ? "light" : "dark";
				localStorage.setItem(STORAGE_KEY, next);
				applyTheme(next);
				return next;
			});
		}, []),
		mounted
	};
}
var SECTION_IDS = NAV_LINKS.map((link) => link.id);
function Navbar() {
	const { theme, toggleTheme, mounted } = useTheme();
	const active = useActiveSection(SECTION_IDS);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		const onResize = () => {
			if (window.innerWidth >= 1024) setOpen(false);
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("fixed top-0 left-0 right-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-all duration-200", scrolled ? "shadow-soft bg-background/98" : "bg-background/90"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			"aria-label": "Main Navigation",
			className: "container-page flex h-16 items-center justify-between gap-3 sm:gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: "#top",
					className: "group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-xs font-bold text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105",
						children: "GM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate max-w-[130px] min-[400px]:max-w-none text-foreground group-hover:text-primary transition-colors",
							children: PERSONAL_INFO.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative flex size-2 shrink-0",
							title: "Online & Available",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-primary" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "hidden items-center gap-1 lg:flex",
					children: NAV_LINKS.map((link) => {
						const isActive = active === link.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `#${link.id}`,
							"aria-current": isActive ? "true" : void 0,
							className: cn("rounded-lg px-3 py-1.5 text-xs xl:text-sm font-medium transition-all duration-200", isActive ? "bg-primary/10 text-primary font-semibold shadow-2xs" : "text-muted-foreground hover:text-foreground hover:bg-secondary/70"),
							children: link.label
						}) }, link.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleTheme,
							"aria-label": mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
							className: "flex size-9 sm:size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95",
							children: mounted && theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
								className: "size-4 text-primary",
								"aria-hidden": "true"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
								className: "size-4",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: PERSONAL_INFO.resume,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "hidden sm:inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-3.5 sm:size-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Resume" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setOpen((v) => !v),
							"aria-expanded": open,
							"aria-controls": "mobile-menu",
							"aria-label": open ? "Close menu" : "Open menu",
							className: "flex size-9 sm:size-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-all hover:bg-secondary hover:text-foreground lg:hidden active:scale-95",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
								className: "size-5 text-primary",
								"aria-hidden": "true"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
								className: "size-5",
								"aria-hidden": "true"
							})
						})
					]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "mobile-menu",
			className: "border-t border-border bg-background/98 backdrop-blur-lg lg:hidden animate-in slide-in-from-top-2 duration-200 shadow-lift",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "container-page flex flex-col py-3 space-y-1",
				children: [NAV_LINKS.map((link) => {
					const isActive = active === link.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `#${link.id}`,
						onClick: () => setOpen(false),
						className: cn("flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition-colors", isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-secondary hover:text-foreground"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: link.label }), isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary" }) : null]
					}) }, link.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "pt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: PERSONAL_INFO.resume,
						target: "_blank",
						rel: "noopener noreferrer",
						onClick: () => setOpen(false),
						className: "flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download Resume" })]
					})
				})]
			})
		}) : null]
	});
}
var CODING_PROFILE_ICONS = {
	code: CodeXml,
	terminal: Terminal,
	codechef: Code,
	trophy: Trophy,
	braces: Code
};
var PROFILE_CARDS = [
	{
		name: "GitHub",
		handle: PERSONAL_INFO.githubUsername,
		description: "Projects, repositories, and source code for all my work.",
		cta: "View GitHub",
		url: PERSONAL_INFO.github,
		Icon: Github
	},
	...CODING_PROFILES.flatMap((profile) => profile.url ? [{
		name: profile.name,
		handle: profile.username,
		description: profile.description,
		cta: `View ${profile.name}`,
		url: profile.url,
		Icon: CODING_PROFILE_ICONS[profile.icon] || CodeXml
	}] : []),
	{
		name: "LinkedIn",
		handle: "gopal-maddheshiya",
		description: "Professional profile, experience, and academic updates.",
		cta: "View LinkedIn",
		url: PERSONAL_INFO.linkedin,
		Icon: Linkedin
	}
];
function Profiles() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "profiles",
		tone: "surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Coding Profiles",
			title: "Platforms & Practice",
			description: "Public problem solving, open-source work, and competitive programming profiles."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 sm:mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3",
			children: PROFILE_CARDS.map((profile, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: index * 50,
				className: "h-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: profile.url,
					target: "_blank",
					rel: "noopener noreferrer",
					"aria-label": `${profile.cta} (opens in a new tab)`,
					className: "group flex h-full min-h-48 sm:min-h-52 flex-col justify-between rounded-xl border border-border bg-card p-5 sm:p-6 transition-all hover:border-border-strong hover:shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(profile.Icon, {
									className: "size-5 shrink-0",
									"aria-hidden": "true"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "size-4 text-muted-foreground/60 transition-transform duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
								"aria-hidden": "true"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3.5 font-display text-base sm:text-lg font-semibold text-foreground",
							children: profile.name
						}),
						profile.handle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs text-muted-foreground",
							children: ["@", profile.handle]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground",
							children: profile.description
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 pt-3 border-t border-border/60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: profile.cta }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "size-3.5",
								"aria-hidden": "true"
							})]
						})
					})]
				})
			}, profile.name))
		})]
	});
}
function ProjectLinks({ project }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 sm:mt-6 flex flex-wrap items-center gap-3",
		children: [project.liveUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: project.liveUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] shadow-soft cursor-pointer",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Live Demo" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
					className: "size-3.5 sm:size-4 shrink-0",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "sr-only",
					children: [" for ", project.title]
				})
			]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: project.githubUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-secondary/60 px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, {
				className: "size-3.5 sm:size-4 shrink-0",
				"aria-hidden": "true"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Source Code", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: [" for ", project.title]
			})] })]
		})]
	});
}
function TechList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 flex flex-wrap gap-1.5 sm:gap-2",
		children: items.map((tech) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex items-center rounded-md border border-border bg-secondary/80 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-border-strong",
			children: tech
		}, tech))
	});
}
/** Project preview container with browser-like frame styling and smooth hover animation */
function ProjectVisual({ title, image, liveUrl, className }) {
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface/50 transition-all duration-300 hover:border-border-strong hover:shadow-lift", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-8 w-full items-center justify-between border-b border-border/80 bg-surface px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-destructive/60" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-primary/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-accent/40" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "truncate px-2 text-[11px] font-mono text-muted-foreground/70",
					children: [title.toLowerCase().replace(/\s+/g, "-"), ".dev"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "group/image relative aspect-[16/10] w-full overflow-hidden bg-muted/20",
			children: image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: image,
				alt: `${title} project preview`,
				loading: "lazy",
				width: 1200,
				height: 750,
				className: "h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover/image:scale-105"
			}), liveUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 group-hover/image:opacity-100",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-lift",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Live Project" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
				})
			}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full items-center justify-center bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "size-10 text-muted-foreground/40" })
			})
		})]
	});
	if (liveUrl) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: liveUrl,
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": `Open live demo for ${title}`,
		className: "block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl",
		children: content
	});
	return content;
}
function Projects() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "projects",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Selected Work",
			title: "Featured Projects",
			description: "A showcase of full-stack applications and interactive web systems built with Java, React, Node.js, and modern APIs."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 sm:mt-12 space-y-10 lg:space-y-14",
			children: PROJECTS.map((project, index) => {
				const isEven = index % 2 === 1;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					as: "article",
					delay: index * 60,
					className: "relative rounded-2xl border border-border bg-card p-5 sm:p-7 lg:p-9 transition-all hover:border-border-strong hover:shadow-lift",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("lg:col-span-6 xl:col-span-6", isEven ? "lg:order-2" : "lg:order-1"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectVisual, {
								title: project.title,
								image: project.image,
								liveUrl: project.liveUrl
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col justify-center lg:col-span-6 xl:col-span-6", isEven ? "lg:order-1" : "lg:order-2"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-mono text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-primary font-medium",
											children: ["Project ", index + 1]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: project.year })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground",
									children: project.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground",
									children: project.summary
								}),
								project.problem ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3.5 rounded-lg border border-border/70 bg-surface/60 p-3 text-xs sm:text-sm text-muted-foreground leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "Goal: "
									}), project.problem]
								}) : null,
								project.features?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-mono text-xs uppercase tracking-[0.14em] text-primary font-medium",
										children: "Key Features"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 grid gap-1.5 sm:grid-cols-2 text-xs sm:text-sm text-muted-foreground",
										children: project.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
												className: "size-3.5 shrink-0 mt-0.5 text-primary/80",
												"aria-hidden": "true"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feature })]
										}, feature))
									})]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TechList, { items: project.technologies }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectLinks, { project })
							]
						})]
					})
				}, project.title);
			})
		})]
	});
}
function ResumeCTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "resume",
		className: "scroll-mt-20 sm:scroll-mt-24 border-t border-border py-12 sm:py-16 lg:py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "container-page",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "rounded-2xl border border-border bg-card p-6 sm:p-8 md:p-12 shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 lg:grid-cols-12 lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 font-mono text-xs text-primary font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
									className: "size-3.5",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Resume / Curriculum Vitae" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display",
								children: "Interested in my profile for an internship or role?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground",
								children: "My single-page resume covers my academic coursework at SRMU, core competencies in Java & DSA, full-stack project portfolio, and coding profile achievements."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3 text-primary" }), "Single-Page PDF"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Java & Full-Stack Focus" })
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full lg:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: PERSONAL_INFO.resume,
							download: "Gopal_Maddheshiya_Resume.pdf",
							className: "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs sm:text-sm font-medium text-primary-foreground shadow-soft transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
								className: "size-4 shrink-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download Resume" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: PERSONAL_INFO.resume,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-secondary/60 px-5 py-3 text-xs sm:text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98] cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
								className: "size-4 shrink-0 text-muted-foreground",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View in Browser" })]
						})]
					})]
				})
			})
		})
	});
}
function Skills() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "skills",
		tone: "surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
			eyebrow: "Technical skills",
			title: "What I work with",
			description: "Grouped by domain. Highlighted groups represent my primary active focus right now."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 sm:mt-10 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: SKILL_GROUPS.map((group, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: index * 50,
				className: cn("rounded-xl border bg-card p-5 sm:p-6 transition-all hover:shadow-soft flex flex-col justify-between", group.primary ? "border-primary/40 shadow-xs" : "border-border"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold text-foreground",
						children: group.title
					}), group.primary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary font-medium",
						children: "Focus"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3.5 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2",
					children: group.skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-border-strong",
						children: skill
					}, skill))
				})] })
			}, group.title))
		})]
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full bg-background overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				className: "pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlights, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skills, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Projects, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DSA, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Journey, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Profiles, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Certifications, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumeCTA, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Index as component };
