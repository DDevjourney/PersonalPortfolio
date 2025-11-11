// Theme handling
const root = document.documentElement;
const THEME_KEY = "theme-preference";
const getStoredTheme = () => localStorage.getItem(THEME_KEY);
const storeTheme = (t) => localStorage.setItem(THEME_KEY, t);
const systemPrefersLight = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
function applyTheme(theme) {
	if (theme === "light") {
		root.classList.add("light");
	} else {
		root.classList.remove("light");
	}
}
function initTheme() {
	const stored = getStoredTheme();
	const theme = stored || (systemPrefersLight() ? "light" : "dark");
	applyTheme(theme);
}
initTheme();
document.getElementById("theme-toggle")?.addEventListener("click", () => {
	const isLight = root.classList.contains("light");
	const next = isLight ? "dark" : "light";
	applyTheme(next);
	storeTheme(next);
});

// Mobile navigation
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");
navToggle?.addEventListener("click", () => {
	const expanded = navToggle.getAttribute("aria-expanded") === "true";
	navToggle.setAttribute("aria-expanded", String(!expanded));
	navMenu?.classList.toggle("is-open");
});
navMenu?.addEventListener("click", (e) => {
	const isLink = e.target instanceof Element && e.target.tagName === "A";
	if (isLink && window.innerWidth <= 720) {
		navMenu.classList.remove("is-open");
		navToggle?.setAttribute("aria-expanded", "false");
	}
});

// Smooth scroll enhancement for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach((link) => {
	link.addEventListener("click", (e) => {
		const targetId = link.getAttribute("href");
		if (!targetId || targetId === "#") return;
		const el = document.querySelector(targetId);
		if (!el) return;
		e.preventDefault();
		el.scrollIntoView({ behavior: "smooth", block: "start" });
		history.pushState(null, "", targetId);
	});
});

// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Projects data and rendering
const projects = [

	{
	  title: "Juego de adivinar el número",
	  description: "Juego simple de adivinar el número hecho con HTML & JavaScript.",
	  stack: ["JavaScript", "HTML"],
	  category: ["html", "css", "javascript"],
	  demo: "#",
	  code: "https://github.com/DDevjourney/learning/tree/main/Guessing%20Game",
	  image: "img/juegodeadivinar.png"
	},
	{
	  title: "Temporizador",
	  description: "Temporizador que hace una cuenta atrás hasta la fecha que elijas.",
	  stack: ["HTML", "CSS", "JavaScript"],
	  category: ["html", "css", "javascript"],
	  demo: "#",
	  code: "https://github.com/DDevjourney/learning/tree/main/Timer-App",
	  image: "img/temporizador.png"
	},
	{
	  title: "Lista de tareas",
	  description: "Lista de tareas simple hecha con HTML, CSS y JavaScript.",
	  stack: ["CSS", "HTML"],
	  category: ["html", "css", "javascript"],
	  demo: "#",
	  code: "https://github.com/DDevjourney/learning/tree/main/To-Do-List",
	  image: "img/todolist.png"
	},
	{
	  title: "PageSpeed Insights Visualizer",
	  description: "Herramienta web interactiva que permite obtener y visualizar métricas de PageSpeed Insights.",
	  stack: ["CSS", "HTML", "JavaScript"],
	  category: ["html", "css", "javascript"],
	  demo: "#",
	  code: "https://github.com/DDevjourney/Analytics",
	  image: "img/analizar.png"
	},
	{
	  title: "Dragon Repeller",
	  description: "Un sencillo juego RPG basado en navegador construido con JavaScript.",
	  stack: ["CSS", "HTML", "JavaScript"],
	  category: ["html", "css", "javascript"],
	  demo: "#",
	  code: "https://github.com/DDevjourney/Dragon-Repeller",
	  image: "img/dragon.png"
	}
  ];
  

const grid = document.getElementById("projects-grid");
function renderProjects(filter = "all") {
	if (!grid) return;
	grid.innerHTML = "";
	const filtered = projects.filter((p) => filter === "all" ? true : p.category.includes(filter));
	for (const p of filtered) {
		const card = document.createElement("article");
		card.className = "project-card";
		card.innerHTML = `
		<div class="project-cover">
		  <img src="${p.image}" alt="${p.title}">
		</div>
		<div class="project-body">
		  <h3 class="project-title">${p.title}</h3>
		  <p class="project-desc">${p.description}</p>
		  <div class="project-tags">${p.stack.map(s => `<span class="tag">${s}</span>`).join("")}</div>
		  <div class="project-links">
			<a class="btn btn-ghost" href="${p.demo}" target="_blank" rel="noopener noreferrer">Live</a>
			<a class="btn btn-ghost" href="${p.code}" target="_blank" rel="noopener noreferrer">Code</a>
		  </div>
		</div>
	  `.trim();
		grid.appendChild(card);
	}
}
renderProjects("all");

const filterButtons = document.querySelectorAll(".filters .chip");
filterButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		filterButtons.forEach((b) => b.classList.remove("is-active"));
		btn.classList.add("is-active");
		const f = btn.getAttribute("data-filter") || "all";
		renderProjects(f);
	});
});

// Contact form validation
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
contactForm?.addEventListener("submit", (e) => {
	e.preventDefault();
	if (!contactForm.checkValidity()) {
		formStatus.textContent = "Please fill out all fields correctly.";
		formStatus.classList.remove("is-success");
		formStatus.classList.add("is-error");
		return;
	}
	const data = new FormData(contactForm);
	const name = String(data.get("name") || "");
	const email = String(data.get("email") || "");
	const message = String(data.get("message") || "");
	const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	if (!validEmail) {
		formStatus.textContent = "Please enter a valid email address.";
		formStatus.classList.remove("is-success");
		formStatus.classList.add("is-error");
		return;
	}
	formStatus.textContent = "Thanks, " + name + "! Your message has been validated locally.";
	formStatus.classList.remove("is-error");
	formStatus.classList.add("is-success");
	contactForm.reset();
});


