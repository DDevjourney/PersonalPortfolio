## HTML

Bienvenido a mi portfolio, una demostración práctica de desarrollo web moderno con **HTML, CSS y JavaScript puro**. Este proyecto no solo muestra mi experiencia en la creación de interfaces intuitivas y responsivas, sino también la implementación de conceptos avanzados como la **accesibilidad web y la optimización de rendimiento**.

El portfolio está diseñado con estructura semántica, etiquetas ARIA y técnicas de carga eficiente de recursos, garantizando que la experiencia del usuario sea fluida en cualquier dispositivo. Incluye:  

- Navegación dinámica y responsive con un menú accesible mediante teclado y ARIA roles.  
- Sistema de temas claro/oscuro gestionado con JavaScript, manteniendo la preferencia del usuario.  
- Secciones filtrables de proyectos, mostrando cómo manipular el DOM de manera eficiente y modular.  
- Formularios con validación integrada y conexión a EmailJS para el envío de mensajes sin backend propio.  

Este repositorio es una representación práctica de mis competencias como desarrollador frontend y mi enfoque en la creación de experiencias web **modernas, accesibles y optimizadas para rendimiento**.



## Estilo y Diseño

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



## Interactividad y Lógica con JavaScript

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

