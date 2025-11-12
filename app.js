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
	  demo: "https://ddevjourney.github.io/Guessing-Game/",
	  code: "https://github.com/DDevjourney/learning/tree/main/Guessing%20Game",
	  image: "img/juegodeadivinar.png"
	},
	{
	  title: "Temporizador",
	  description: "Temporizador que hace una cuenta atrás hasta la fecha que elijas.",
	  stack: ["HTML", "CSS", "JavaScript"],
	  category: ["html", "css", "javascript"],
	  demo: "https://ddevjourney.github.io/Timer-App/",
	  code: "https://github.com/DDevjourney/learning/tree/main/Timer-App",
	  image: "img/temporizador.png"
	},
	{
	  title: "Lista de tareas",
	  description: "Lista de tareas simple hecha con HTML, CSS y JavaScript.",
	  stack: ["CSS", "HTML"],
	  category: ["html", "css", "javascript"],
	  demo: "https://ddevjourney.github.io/To-Do/",
	  code: "https://github.com/DDevjourney/learning/tree/main/To-Do-List",
	  image: "img/todolist.png"
	},
	{
	  title: "PageSpeed Insights Visualizer",
	  description: "Herramienta web interactiva que permite obtener y visualizar métricas de PageSpeed Insights.",
	  stack: ["CSS", "HTML", "JavaScript"],
	  category: ["html", "css", "javascript"],
	  demo: "https://ddevjourney.github.io/Analytics/",
	  code: "https://github.com/DDevjourney/Analytics",
	  image: "img/analizar.png"
	},
	{
	  title: "Dragon Repeller",
	  description: "Un sencillo juego RPG basado en navegador construido con JavaScript.",
	  stack: ["CSS", "HTML", "JavaScript"],
	  category: ["html", "css", "javascript"],
	  demo: "https://ddevjourney.github.io/Dragon-Repeller/",
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

// Education data and rendering
const educationData = {
	reglada: [
		{
			title: "Grado en Derecho",
			meta: "2015 — 2021",
			description: "Formación universitaria que aportó habilidades analíticas, razonamiento lógico y capacidad para resolver conflictos."
		},
		{
			title: "Inglés",
			meta: "2022",
			description: "Universidad de Cambridge. Nivel intermedio-alto reconocido internacionalmente, que acredita competencia sólida en comprensión oral y escrita, expresión fluida en contextos académicos y profesionales, y dominio gramatical avanzado."
		},
		{
			title: "Grado Superior en Desarrollo de Aplicaciones Web",
			meta: "2024 — Presente",
			description: "Ilerna FP. Especialización en HTML, CSS, JavaScript y Java, aplicando conocimientos en proyectos prácticos orientados al desarrollo web moderno y eficiente."
		},
		
		{
			title: "MOOC (Massive Online Open Course) en Ciberseguridad",
			meta: "Presente — 2026",
			description: "Universidad de Málaga. La formación abarca los principales ámbitos de la ciberseguridad, desde los fundamentos hasta las tecnologías más avanzadas. Incluye criptografía aplicada, seguridad en redes, protección de sistemas y programación segura, junto con áreas humanas como la ingeniería social y la privacidad. También aborda temas especializados como seguridad de hardware y sistemas , el análisis de malware, la computación post-cuántica y el diseño de soluciones seguras basadas en blockchain e inteligencia artificial, fomentando una visión integral de la protección digital"
		}

	],
	"no-reglada": [
		{
			title: "Excel en 30 días. De cero a avanzado",
			meta: "2022",
			description: "Udemy.Formación en Excel con enfoque en tablas dinámicas y gráficos." /* comentario */
		},
		{
			title: "The Web Developer Bootcamp 2025",
			meta: "2023",
			description: "Formación en JavaScript moderno, ES6+ y DOM manipulation. Fue el curso que inició mi camino en el mundo de la programación."
		},

		{
			title: "Liderazo y gestión de equipos",
			meta: "2023",
			description: "Udemy. Formación en comunicación efectiva, asertividad y toma de decisiones."
		}
	]
};

const educationTimeline = document.getElementById("education-timeline");
function renderEducation(type = "reglada") {
	if (!educationTimeline) return;
	educationTimeline.innerHTML = "";
	const items = educationData[type] || [];
	for (const item of items) {
		const li = document.createElement("li");
		li.className = "timeline-item";
		li.innerHTML = `
			<div class="timeline-marker"></div>
			<div class="timeline-content">
				<h3>${item.title}</h3>
				<p class="meta">${item.meta}</p>
				<p>${item.description}</p>
			</div>
		`.trim();
		educationTimeline.appendChild(li);
	}
}
renderEducation("reglada");

const educationButtons = document.querySelectorAll(".education-toggle .chip");
educationButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		educationButtons.forEach((b) => {
			b.classList.remove("is-active");
			b.setAttribute("aria-selected", "false");
		});
		btn.classList.add("is-active");
		btn.setAttribute("aria-selected", "true");
		const type = btn.getAttribute("data-education") || "reglada";
		renderEducation(type);
	});
});

// Contact form validation
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(contactForm);
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  // Validación simple
  if (!name || !email || !message) {
    formStatus.textContent = "Por favor, completa todos los campos.";
    formStatus.className = "is-error";
    return;
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    formStatus.textContent = "Introduce un email válido.";
    formStatus.className = "is-error";
    return;
  }

  // Enviar email con EmailJS
  emailjs.send("service_6nms53h", "template_f5kvgwh", {
    from_name: name,
    from_email: email,
    message: message
  }).then(
    () => {
      formStatus.textContent = "¡Mensaje enviado correctamente!";
      formStatus.className = "is-success";
      contactForm.reset();
    },
    (err) => {
      formStatus.textContent = "Error al enviar el mensaje: " + err.text;
      formStatus.className = "is-error";
    }
  );
});



