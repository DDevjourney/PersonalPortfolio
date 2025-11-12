# HTML

Bienvenido a mi portfolio, una demostración práctica de desarrollo web moderno con **HTML, CSS y JavaScript puro**. Este proyecto no solo muestra mi experiencia en la creación de interfaces intuitivas y responsivas, sino también la implementación de conceptos avanzados como la **accesibilidad web y la optimización de rendimiento**.

El portfolio está diseñado con estructura semántica, etiquetas ARIA y técnicas de carga eficiente de recursos, garantizando que la experiencia del usuario sea fluida en cualquier dispositivo. Incluye:  

- Navegación dinámica y responsive con un menú accesible mediante teclado y ARIA roles.  
- Sistema de temas claro/oscuro gestionado con JavaScript, manteniendo la preferencia del usuario.  
- Secciones filtrables de proyectos, mostrando cómo manipular el DOM de manera eficiente y modular.  
- Formularios con validación integrada y conexión a EmailJS para el envío de mensajes sin backend propio.  

Este repositorio es una representación práctica de mis competencias como desarrollador frontend y mi enfoque en la creación de experiencias web **modernas, accesibles y optimizadas para rendimiento**.



# Estilo y Diseño

El portfolio está construido con **CSS moderno**, utilizando variables globales (`:root`) para gestionar colores, estados y modos de tema (claro/oscuro), lo que facilita la mantenibilidad y consistencia visual en todo el proyecto.  

Aspectos destacados del CSS:  

- **Variables CSS y theming dinámico:**  
  Uso de `:root` y `.light` para cambiar fácilmente entre modo oscuro y claro, adaptando colores de fondo, textos, bordes y elementos interactivos sin duplicar reglas.  

- **Diseño responsivo avanzado:**  
  Grid y Flexbox para estructuras como el layout de secciones, tarjetas de habilidades, proyectos y timeline de experiencia. Incluye media queries optimizadas para adaptarse desde escritorio hasta dispositivos móviles.  

- **Componentes reutilizables:**  
  Botones (`.btn`), chips (`.chip`), tarjetas (`.project-card`, `.skill-card`) y formularios diseñados con transiciones suaves, bordes redondeados y sombreado sutil para una experiencia interactiva consistente.  

- **Efectos visuales avanzados:**  
  Gradientes, glow sobre imágenes y elementos, radial gradients para hero section, combinaciones de background con imágenes y superposiciones, logrando profundidad y dinamismo sin sobrecargar el rendimiento.  

- **Accesibilidad y legibilidad:**  
  Contrastes altos, placeholders legibles, elementos interactivos claramente diferenciables y soporte para navegación por teclado (ej. menú hamburguesa y toggles de tema).  

Este enfoque demuestra cómo combinar **CSS modular, mantenible y visualmente atractivo** para crear interfaces modernas, responsivas y fáciles de actualizar.



# Interactividad y Lógica con JavaScript

El portfolio utiliza **JavaScript moderno** para implementar funcionalidades dinámicas y mejorar la experiencia del usuario. Algunos aspectos avanzados incluyen:

- **Gestión de temas dinámicos (modo claro/oscuro):**  
  Detecta la preferencia del sistema (`prefers-color-scheme`) y permite alternar entre temas, almacenando la selección del usuario en `localStorage` para persistencia entre sesiones.  

- **Navegación móvil accesible:**  
  Menú hamburguesa con atributos ARIA y control del estado expandido (`aria-expanded`), que se adapta automáticamente según el tamaño de pantalla y permite cerrar el menú al seleccionar un enlace.  

- **Scroll suave y manipulación del historial:**  
  Los enlaces internos usan `scrollIntoView` para un desplazamiento fluido y actualizan el historial del navegador, mejorando la experiencia de navegación y accesibilidad.  

- **Renderizado dinámico de proyectos:**  
  Una lista de proyectos se filtra y se genera dinámicamente en el DOM mediante JavaScript. Cada proyecto incluye imagen, descripción, etiquetas, y enlaces a demo y código, demostrando **manipulación eficiente del DOM y modularidad**.  

- **Validación y envío de formularios:**  
  Formularios de contacto con validación de campos y emails, integrados con **EmailJS** para enviar mensajes sin necesidad de backend. Incluye retroalimentación visual de éxito y error para mejorar la interacción del usuario.  

- **Componentes reutilizables y modularidad:**  
  Todas las funcionalidades se organizan en funciones claras (`applyTheme`, `renderProjects`, validación de formulario), lo que facilita la escalabilidad y mantenimiento del código.  

Este enfoque demuestra la combinación de **experiencia de usuario, accesibilidad, persistencia de preferencias y renderizado dinámico**, mostrando un dominio completo de JavaScript en proyectos frontend modernos.


# Análisis técnico

## index.html

### **1. Declaración y estructura básica**

* `<!DOCTYPE html>`: Indica que el documento usa HTML5.
* `<html lang="en">`: Establece el idioma principal del documento como inglés (`en`). Esto es importante para accesibilidad y SEO.

---

### **2. `<head>` y metadatos**

* `<meta charset="utf-8">`: Define la codificación de caracteres como UTF-8, que soporta prácticamente todos los caracteres y símbolos.
* `<meta name="viewport" content="width=device-width, initial-scale=1">`: Hace que la página sea responsive, ajustando la escala al ancho del dispositivo.
* `<title>Portfolio | Carlos</title>`: Define el título de la página que se muestra en pestañas del navegador y en resultados de búsqueda.
* `<meta name="description" content="...">`: Descripción del sitio para SEO.
* `<meta name="theme-color" content="#0ea5e9">`: Cambia el color de la barra de herramientas en dispositivos móviles compatibles.
* `<link rel="canonical" href="https://example.com/">`: Indica la URL principal para evitar contenido duplicado en SEO.
* `<link rel="icon" type="image/png" href="img/sailor.png">`: Ícono de la página (favicon) que aparece en la pestaña del navegador.

---

### **3. Open Graph y Twitter Cards (social media)**

* Metaetiquetas `og:*`:

  * `og:title`, `og:description`, `og:type`, `og:url`, `og:image`: Configuran cómo se ve la página cuando se comparte en redes sociales como Facebook o LinkedIn.
* Metaetiquetas `twitter:*`:

  * Definen la apariencia de los enlaces compartidos en Twitter (tipo de tarjeta, título, descripción e imagen).

---

### **4. Fuentes externas**

* `<link rel="preconnect" href="https://fonts.googleapis.com">` y `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`: Optimiza la carga de fuentes externas estableciendo conexiones anticipadas.
* `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">`: Importa la fuente "Inter" con distintos pesos para usar en el CSS.

---

### **5. Librerías y CSS**

* `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">`: Importa la biblioteca de iconos Font Awesome.
* `<link rel="stylesheet" href="style.css">`: Vincula tu archivo de estilos principal.

---

### **6. Observaciones y buenas prácticas**

* La estructura es moderna y completa para SEO y redes sociales.
* Buen uso de preconnect para optimizar fuentes.
* La fuente Inter permite consistencia tipográfica y legibilidad.
* Se podrían añadir comentarios en el `<head>` para documentar cada sección, especialmente si la documentación técnica será detallada.

---

### **7. Estructura general**

* `<header class="site-header">`: Sección principal de cabecera del sitio, semánticamente correcta para contener navegación y branding.
* `<div class="container header-inner">`: Contenedor para centralizar y organizar los elementos internos (marca, navegación y botones).

---

### **8. Branding**

* `<a href="#" class="brand">`: Enlace principal de la marca, típicamente lleva al inicio de la página.
* `<span class="brand-mark"><img src="img/sailor.png" alt="Boat"></span>`: Logo de la marca con texto alternativo “Boat” para accesibilidad.
* `<span class="brand-name">Carlos</span>`: Nombre visible de la marca.


---

### **8. Navegación**

* `<nav class="nav" aria-label="Primary">`: Elemento semántico para la navegación principal.

* `<button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle menu">`: Botón de menú tipo “hamburger” para dispositivos móviles, con atributos ARIA:

  * `aria-expanded`: Indica si el menú está abierto o cerrado.
  * `aria-controls`: Relaciona el botón con el menú que controla.
  * `aria-label`: Proporciona descripción accesible del botón.

* `<span class="nav-toggle-bar"></span>` ×3: Líneas del icono “hamburger”.

* `<ul id="nav-menu" class="nav-list">`: Lista de enlaces de navegación.

* `<li><a href="#section">...</a></li>`: Enlaces internos a secciones de la página, facilitando navegación y anclaje.

---

### **9. Botón de cambio de tema**

* `<button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">`: Permite alternar entre modo claro y oscuro.
* `<span class="sun">☀️</span>` y `<span class="moon">🌙</span>`: Indicadores visuales del estado del tema.

---

### **10. Estructura general de `<main>`**

* `<main>`: Elemento semántico que indica el contenido principal de la página.
* Contiene varias secciones (`<section>`) con `id` y `class` para navegación interna y estilos diferenciados.

---

### **11. Sección Hero (`#home`)**

* `<section class="hero" id="home">`: Sección principal de presentación inicial.
* `<div class="hero-copy">`: Contenido textual:

  * `<h1>`: Título principal que resume tu rol y especialidad.
  * `<p>`: Descripción breve de tu enfoque y tecnología utilizada.
  * `<div class="hero-ctas">`: Llamadas a la acción con botones `<a>` estilizados (`btn btn-primary`, `btn btn-ghost`).
* `<ul class="socials">`: Enlaces a redes sociales con iconos de Font Awesome, accesibles gracias a `aria-label`.
* `<div class="hero-art" aria-hidden="true">`: Imagen decorativa con efecto `glow`, marcada como no accesible (`aria-hidden="true"`) para lectores de pantalla.

---

### **12. Sección Sobre mí (`#about`)**

* `<div class="container two-col">`: Distribuye contenido en dos columnas: imagen y texto.
* `<div class="about-media">` y `<div class="avatar">`: Imagen del usuario, marcada como `aria-hidden="true"` ya que no aporta información extra.
* `<div class="about-copy">`: Contenido textual:

  * `<h2>`: Encabezado de sección.
  * `<p>`: Párrafos describiendo experiencia, formación y habilidades.
  * `<ul class="quick-facts">`: Lista de hechos rápidos sobre la metodología y valores personales.

---

### **13. Sección Habilidades (`#skills`)**

* `<section id="skills" class="section alt">`: Sección alternativa con estilo diferenciado (`alt`).
* `<div class="skills-grid">`: Grid para mostrar varias “skill-card” de manera uniforme.
* `<div class="skill-card">`: Cada tarjeta representa un conjunto de habilidades:

  * `<h3>`: Nombre de la habilidad o categoría.
  * `<ul class="tags">`: Lista de puntos clave relacionados con esa habilidad (HTML, CSS, JS, herramientas).

---

### **14. Sección Proyectos (`#projects`)**

* `<section id="projects" class="section">`: Contenedor semántico para mostrar proyectos.
* `<p class="section-lead">`: Descripción breve de la sección.
* `<div class="filters" role="tablist" aria-label="Project filters">`: Botones que funcionan como filtros para los proyectos.

  * Cada `<button class="chip" data-filter="...">` actúa como un tab controlable con ARIA (`role="tab"`, `aria-selected`).
  * `is-active` indica el filtro actualmente activo.
* Comentario HTML indica filtros adicionales que podrían habilitarse más adelante (PHP, SQL, frameworks).
* `<div id="projects-grid" class="projects-grid" aria-live="polite"></div>`: Contenedor donde se cargan los proyectos dinámicamente mediante JavaScript.

  * `aria-live="polite"` asegura que los cambios se anuncien de forma accesible sin interrumpir al usuario.

---

### **15. Sección Experiencia (`#experience`)**

* `<ul class="timeline">`: Lista de experiencias en orden cronológico.
* `<li class="timeline-item">`: Cada elemento representa un trabajo o proyecto.

  * `<div class="timeline-marker"></div>`: Marcador visual en la línea del tiempo.
  * `<div class="timeline-content">`: Contenido textual con:

    * `<h3>`: Cargo y empresa.
    * `<p class="meta">`: Fechas de experiencia.
    * `<p>`: Descripción detallada de responsabilidades y logros.

---

### **16. Sección Estudios (`#education`)**

* `<div class="education-toggle" role="tablist" aria-label="Tipo de formación">`: Botones para alternar entre tipos de formación (reglada y no reglada).

  * Cada `<button class="chip">` funciona como tab con `role="tab"` y `aria-selected` para accesibilidad.
* `<div id="education-content" aria-live="polite">`: Contenedor donde se carga dinámicamente la información educativa mediante JavaScript.
* `<ul class="timeline" id="education-timeline">`: Lista donde se agregan los elementos de formación.

---

### **17. Sección Contacto (`#contact`)**

* `<form id="contact-form" novalidate>`: Formulario de contacto con validación controlada por JavaScript (`novalidate` evita la validación HTML nativa).
* `<div class="form-grid">`: Grid para organizar los campos de entrada.
* Campos de formulario:

  * Nombre: `<input type="text" name="name" autocomplete="name" required>`
  * Email: `<input type="email" name="email" autocomplete="email" required>`
  * Mensaje: `<textarea name="message" rows="5" required>`
* `<div class="form-actions">`: Contiene el botón de envío y un párrafo `<p id="form-status" role="status" aria-live="polite"></p>` para mostrar el estado del envío de manera accesible.
* Buen uso de etiquetas `<label>` y `autocomplete` para mejorar la accesibilidad y UX.

---

### **18. Footer (`<footer class="site-footer">`)**

* `<p>© <span id="year"></span> ...</p>`: Elemento dinámico que actualiza el año automáticamente mediante JavaScript (`app.js`).
* `<a href="#home" class="to-top">`: Enlace para volver al inicio de la página, mejorando la navegación.

---

### **19. Scripts**

* `<script src="app.js" defer></script>`: Script principal de la página. `defer` asegura que se ejecute después de cargar el HTML.
* `<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>`: Librería EmailJS para envío de correos desde el frontend sin backend propio.
* Script inline para inicializar EmailJS:

```javascript
(function(){
  emailjs.init("wezdFJdAheTbrJQrJ");
})();
```

* Inicializa la librería con tu Public Key, permitiendo el envío de formularios desde JavaScript.

---

## styles.css

### **1. Variables CSS (`:root`)**

* Definen la paleta de colores y estilos globales para todo el sitio.
* Variables para modo oscuro:

  * `--bg`, `--bg-elev`: fondos de página y secciones elevadas.
  * `--text`, `--muted`: colores de texto principal y secundario.
  * `--primary`, `--primary-700`: colores de acento para botones, marcas y elementos destacados.
  * `--border`, `--card`, `--chip`: bordes y fondos de tarjetas/chips.
  * `--success`, `--danger`: colores de estado positivo o negativo.
  * `--project-cover-bg`, `--glow-color`: estilos de gradientes para proyectos y efectos de glow.
* Variables para modo claro (`:root.light`) con equivalentes adaptados a esquema claro y accesible.

---

### **2. Globales**

* `* { box-sizing: border-box; }`: Control consistente de tamaño de elementos.
* `html { scroll-behavior: smooth; }`: Desplazamiento suave.
* `body`: fuente Inter con fallback seguro, fondo con gradiente radial, color de texto, altura de línea.
* `img { max-width: 100%; display: block; }`: imágenes responsivas y sin desbordamiento.
* `.container`: ancho máximo y centrado automático.
* `p { text-align: justify; }`: párrafos justificados.

---

### **3. Tipografía y secciones**

* `.section`: padding vertical de 80px.
* `.section.alt`: fondo elevado (`var(--bg-elev)`).
* Encabezados `.section h2` y `.section-lead` con espaciado y color de texto secundario.

---

### **4. Botones y chips**

* `.btn`, `.btn-primary`, `.btn-ghost`: estilos de botones con transiciones, colores de fondo y hover.
* `.chip`: estilo de etiquetas de filtro/toggle, con clase `.is-active` para estado seleccionado.

---

### **5. Header y navegación**

* `.site-header`: sticky, fondo semi-transparente con blur, borde inferior.
* `.header-inner`: flex para distribuir branding y navegación.
* `.brand` y `.brand-mark`: diseño con gradiente dorado y bordes redondeados.
* `.nav-list` y `.nav-toggle`: menú responsivo con botón hamburguesa visible en pantallas pequeñas.
* `.theme-toggle`: botón para cambiar tema claro/oscuro, iconos sol/luna controlados por variables de estado.

---

### **6. Hero**

* `.hero-inner`: grid de 2 columnas (imagen y texto).
* `.hero-copy`: título responsive (`clamp`), párrafo con máximo ancho y color secundario.
* `.hero-ctas` y `.socials`: flexbox para botones y redes sociales.
* `.hero-art` y `.glow`: imagen de fondo combinada con gradientes y efecto de glow.

---

### **7. About y Skills**

* `.two-col`: grid de dos columnas (imagen + texto).
* `.avatar`: contenedor de imagen redondeada con `object-fit: cover`.
* `.quick-facts`: lista de hechos rápidos con estilo de checklist.
* `.skills-grid`: grid de 4 columnas para tarjetas de habilidades.
* `.skill-card`, `.tags`: diseño de tarjetas con bordes, fondo, padding y tags redondeadas.

---

### **8. Proyectos y Timeline**

* `.projects-grid`: grid de 3 columnas, tarjetas de proyecto `.project-card` con imagen y body.
* `.project-cover` y `.project-image`: aspecto ratio, fondo de gradiente, `object-fit: cover`.
* `.project-tags` y `.project-links`: etiquetas y enlaces dentro de cada proyecto.
* `.timeline` y `.timeline-item`: grid con marcador visual y contenido de experiencia o estudios.
* `.timeline-marker`: círculo con box-shadow, `.timeline-content`: tarjeta con borde y padding.

---

### **9. Formulario y Contacto**

* `.form-grid`: grid de dos columnas, label y textarea responsivos.
* Inputs y textarea: bordes redondeados, fondo de tarjeta, color de texto, placeholder estilizado.
* `.form-actions`: flex para botón y estado del formulario (`#form-status`).
* Clases `.is-success` y `.is-error` aplican colores de estado.

---

### **10. Footer**

* `.site-footer` y `.footer-inner`: flexbox para distribución, padding y borde superior.
* `.to-top`: enlace estilizado para volver al inicio, cambio de color en hover.

---

### **11. Media Queries**

* `max-width: 960px`: adapta hero, dos-col, skills-grid, projects-grid y form-grid a 1 o 2 columnas.
* `max-width: 720px`: activa menú hamburguesa, cambia nav-list a columna, ajusta grids y footer para móvil.

---
## app.js

### **1. Theme Handling**

* Variables globales y `localStorage` se usan para persistir la preferencia del usuario (`THEME_KEY`).
* `systemPrefersLight()` permite detectar la preferencia del sistema.
* `applyTheme(theme)` agrega o quita la clase `light` al `<html>`.
* `initTheme()` aplica el tema inicial basado en almacenamiento o sistema.
* Event listener en `#theme-toggle` alterna tema y lo guarda.

---

### **2. Mobile Navigation**

* Toggle del menú con `aria-expanded` y clase `.is-open`.
* Event listener en `navMenu` cierra menú al clicar en un enlace si la ventana ≤ 720px.
* Buen uso de accesibilidad (atributos ARIA) y responsividad.

---

### **3. Smooth Scroll**

* Todos los enlaces internos (`a[href^="#"]`) realizan scroll suave y actualizan la URL con `history.pushState`.
* Evita comportamiento por defecto si el target no existe o es `#`.

---

### **4. Footer Year**

* Dinámico: actualiza `#year` automáticamente con el año actual.
* Código simple y efectivo.

---

### **5. Projects**

* `projects` es un array de objetos con toda la info.
* `renderProjects(filter)` filtra por categoría y renderiza cards dinámicamente.
* Event listeners en filtros `.chip` para cambiar categoría y actualizar estado activo.

---

### **6. Education**

* `educationData` separado por `reglada` y `no-reglada`.
* `renderEducation(type)` genera timeline dinámico.
* Filtros toggles `.chip` con actualización de `aria-selected` y estado activo.

---

### **7. Contact Form**

* Validación simple de campos vacíos y email.
* Envío mediante EmailJS (`send`) y feedback al usuario en `#form-status`.
* Feedback de éxito (`.is-success`) y error (`.is-error`) con mensajes claros.

---

















