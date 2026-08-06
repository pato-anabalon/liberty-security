# Liberty Security — Initial Project Prompt

Quiero que me ayudes a diseñar y desarrollar desde cero el sitio web de Liberty Security.

No asumas que existen documentación, arquitectura, componentes, contenido ni decisiones previas. Este mensaje es la fuente inicial de verdad del proyecto.

Actúa como un equipo compuesto por:

- Estratega digital
- UX/UI designer
- UX writer
- Especialista SEO
- Desarrollador senior de Next.js
- Especialista en accesibilidad y rendimiento

Tu objetivo no es crear una landing page genérica. Debes construir un sitio real de producción tipo Landing que conecte estrategia comercial, identidad de marca, contenido, experiencia de usuario, SEO, analítica, rendimiento y mantenibilidad.

Antes de implementar código, realiza una única fase de alineación. Reúne en ella todas las preguntas que puedan cambiar materialmente el resultado, para evitar una cadena de preguntas e iteraciones posteriores.

## CONTEXTO DEL NEGOCIO

La empresa se llama `Liberty Security`.

Liberty Security está ubicada en Auckland, Nueva Zelanda, y ofrece:

- Event Security
- Close Protection
- Hotel Security
- Construction Site Security
- Club & Hospitality Security
- Private Security
- Static Guarding
- CCTV Monitoring

Su público principal son Public & Private Events: Empresas o personas que necesitan resguardo de sus eventos corporativos, privados o de públicos masivos pero que además buscan construir relaciones a largo plazo mediante un servicio confiable, una comunicación proactiva y un compromiso genuino con la protección de las personas.

El sitio debe ayudar a sus potenciales clientes a:

- Entender rápidamente qué hace Liberty Security
- Percibir una empresa seria, moderna y confiable
- Identificar qué servicio o plan es adecuado
- Comprender el valor comercial de trabajar con Liberty Security
- Reducir dudas y ansiedad antes de contactar
- Avanzar hacia una enquiry o conversación comercial

La web debe comunicar resultados de negocio y claridad de decisión. No debe vender complejidad técnica.

## POSICIONAMIENTO DE MARCA

Mensajes centrales:

- `Liberty Security`
- `Genuine commitment to protecting people`

Liberty Security debe sentirse:

- Premium
- Moderna
- Estratégica
- Creativa
- Clara
- Ágil
- Confiable
- Comercialmente enfocada
- Cercana a empresas reales de Auckland

El sitio no debe parecer:

- Una plantilla genérica de agencia
- Una startup de inteligencia artificial
- Una empresa excesivamente corporativa
- Una consultora difícil de entender
- Una exhibición de efectos visuales sin claridad comercial

## COPY Y TONO

Todo el contenido visible del sitio debe escribirse en inglés de Nueva Zelanda.

Puedes comunicarte conmigo en español.

El copy debe ser:

- Claro
- Directo
- Seguro
- Humano
- Profesional
- Orientado a Empresas o Personas que necesiten de nuestros servicios
- Fácil de comprender para personas sin experiencia en el rubro

Prioriza conceptos como:

- Respect — We treat every client, employee and member of the public with professionalism, courtesy and fairness.
- Communication — Clear and proactive communication is one of Liberty's greatest strengths.
- Honesty — We communicate openly, take responsibility and remain transparent.
- Initiative — We anticipate risks and solve problems before they escalate.
- Professionalism — Reflected in preparation, attitude, accountability and consistency.

No uses jerga técnica como argumento comercial principal.

No inventes:

- Testimonios
- Clientes
- Reviews
- Premios
- Métricas
- Porcentajes
- Resultados financieros
- Afirmaciones de posicionamiento
- Casos de éxito

Si todavía no existe evidencia suficiente, utiliza mensajes cualitativos honestos o deja el contenido pendiente.

## MODELO COMERCIAL

Sigue el mismo modelo de las empresas tradicionales de seguridad.

## ARQUITECTURA DE INFORMACIÓN

Propón una arquitectura que incluya como mínimo las secciones:

- `hero`
- `services`
- `about`
- `clients`
- `contact`

Durante la fase inicial, define para cada sección:

- Objetivo
- Audiencia
- Intención de búsqueda
- Mensaje principal
- CTA principal
- Evidencia necesaria
- Estado de indexación (posibilidad de mostrar y ocultar la sección)
- Secciones propuestas

## TECNOLOGÍA

Construye el proyecto con:

- Next.js App Router
- React
- TypeScript strict
- Tailwind CSS
- GSAP
- `@gsap/react`
- Lucide icons
- Vercel como plataforma de despliegue
- Github como plataforma de versionamiento

Utiliza una arquitectura inspirada en Atomic Design:

- `src/components/atoms`
- `src/components/molecules`
- `src/components/organisms`
- `src/components/templates`

Organiza:

- Rutas en `src/app`
- Contenido comercial centralizado en `src/lib/content.ts`
- Metadata y datos SEO centralizados en `src/lib/seo.ts`
- Utilidades compartidas en `src/lib`
- Assets estáticos en `public`
- Tokens y estilos globales en `src/app/globals.css`

Evita contenido comercial importante escrito directamente dentro de numerosos componentes.

Usa aliases como:

- `@/components/...`
- `@/lib/...`

Usa nombres propios de Liberty Security para archivos, componentes, funciones y animaciones.

## DIRECCIÓN VISUAL

La web debe sentirse premium, pulida, moderna, animada y comercialmente clara.

Paleta principal:

- Black #2B2B2B
- Cream White #F2EFE8
- Liberty Gold #C8A45D
- Liberty Blue #1E2A38
- Secondary White #F3E9D8
- Secondary Blue #3C507D

Dirección visual:

- Contraste fuerte
- Tipografía contemporánea
- Composiciones editoriales
- Espacio generoso y controlado
- Cards con profundidad
- Gradientes utilizados con moderación
- Formas geométricas
- Motivos visuales relativos a seguridad (escudos, cámaras de vigilancia, armas, huellas dactilares, handcuffs, etc)
- Detalles de movimiento refinados
- Secciones visualmente distintivas pero coherentes

La creatividad nunca debe perjudicar:

- Legibilidad
- Jerarquía
- Conversión
- Accesibilidad
- Rendimiento

No conviertas cada elemento en una pill.

Diferencia claramente:

- Botones
- Enlaces
- Chips informativos
- Badges
- Etiquetas
- Controles interactivos

Un chip informativo no debe parecer un CTA.

Usa Lucide o SVG para iconos. No uses emojis como iconos de interfaz.

## COMPONENTES Y CONSISTENCIA

Crea componentes reutilizables cuando exista repetición real.

Como mínimo, considera:

- Button
- Container
- Logo
- MetaChip
- TextField
- SectionHeading
- ScrollReveal
- Header
- Footer
- ServiceCard
- PlanCard
- CTA tracking wrapper
- ContactForm

No abstraigas prematuramente componentes utilizados una sola vez si la abstracción no aporta claridad.

Los componentes compartidos deben aceptar variantes explícitas para diferentes superficies, por ejemplo:

- Dark
- Cream White
- Liberty Gold

Evita duplicar un componente solo para cambiar colores o pequeños detalles.

## RESPONSIVE

Trabaja mobile-first.

Diseña y verifica como mínimo:

- Mobile alrededor de 375 px
- Tablet alrededor de 768 px
- Desktop alrededor de 1024 px
- Desktop amplio alrededor de 1440 px

La versión móvil no debe ser únicamente el desktop apilado.

Adapta según el dispositivo:

- Navegación
- Jerarquía
- Tamaño de títulos
- Cantidad de contenido
- Cards
- Tablas
- Comparaciones de planes
- Animaciones
- Vídeos
- Elementos decorativos

Evita:

- Horizontal scroll
- Textos cortados
- Títulos con descenders recortados
- Botones fuera del viewport
- Cards demasiado densas
- Tablas ilegibles en mobile
- Elementos decorativos que cubran el contenido

Cuando un vídeo o asset pesado solo sea necesario en desktop, evita renderizarlo o cargarlo en mobile. Ocultarlo con CSS no es suficiente.

## ANIMACIÓN

Utiliza GSAP para mejorar la jerarquía, el storytelling y la percepción premium.

Las animaciones deben ser:

- Deliberadas
- Fluidas
- Localizadas
- Mantenibles
- Compatibles con responsive
- Respetuosas de `prefers-reduced-motion`

Separa conceptualmente:

1. Animaciones `scrub`, vinculadas al scroll
2. Animaciones `once`, ejecutadas una sola vez al entrar en viewport
3. Hover interactions
4. Preloader

No mezcles estos comportamientos dentro de un helper ambiguo.

Una animación de entrada no debe reemplazar un hover existente.

Una animación `once` no debe comenzar a repetirse al volver a hacer scroll.

Una animación `scrub` no debe transformarse en una animación automática sin autorización.

Implementa las animaciones:

- En Client Components únicamente cuando sea necesario
- Con cleanup correcto
- Usando `useGSAP` o `gsap.context()`
- Limitadas a la sección correspondiente
- Preferentemente con `transform` y `opacity`
- Sin modificar secciones fuera de alcance

Si te entrego una web como referencia:

- Analiza únicamente el comportamiento solicitado
- No copies toda su identidad
- No copies automáticamente su hover
- No uses el nombre del sitio de referencia en el código
- Traduce la idea al lenguaje visual de Liberty Security

Mantén una alternativa estática clara cuando el usuario prefiera reduced motion.

## SEO

Implementa SEO como parte de la arquitectura inicial, no como una etapa final.

Debe contemplar:

- `lang="en-NZ"`
- Metadata específica por ruta
- Títulos y descriptions únicos
- Canonical URLs
- Open Graph
- Twitter metadata
- `robots.txt`
- `sitemap.xml`
- Organization o LocalBusiness JSON-LD
- Breadcrumb JSON-LD
- FAQ JSON-LD cuando exista contenido real
- Un H1 claro por ruta
- URLs legibles
- Enlazado interno
- Imágenes Open Graph
- Estado explícito de indexación por página

No dependas únicamente de metadata global.

La prioridad SEO inicial es construir una base sólida para búsquedas relacionadas con servicios de Liberty Security en Auckland.

## ACCESIBILIDAD

El sitio debe incluir:

- HTML semántico
- Jerarquía correcta de headings
- Navegación completa por teclado
- Focus states visibles
- Contraste suficiente
- Labels asociados a campos
- Mensajes de error accesibles
- Botones y enlaces utilizados según su función
- Áreas táctiles adecuadas
- Estados que no dependan solo del color
- Compatibilidad con `prefers-reduced-motion`
- Contenido comprensible sin depender de animaciones
- Estados de menú correctamente anunciados
- `aria-expanded`, `aria-controls` y atributos equivalentes cuando corresponda

## ANALÍTICA Y CONVERSIÓN

Los CTA importantes deben tener tracking.

Registra al menos:

- CTA seleccionado
- Ruta de origen
- Servicio o plan relacionado
- Destino
- Resultado del formulario

Mantén el tracking en componentes pequeños y reutilizables para evitar convertir innecesariamente componentes de servidor en componentes cliente.

Los CTA de planes deben poder enviar contexto hacia `#contact`, incluyendo:

- Tipo de servicio
- Plan seleccionado (SI APLICAN PLANES)
- Ruta de origen

## FORMULARIO DE CONTACTO

El formulario debe:

- Ser fácil de entender para personas no técnicas
- Funcionar correctamente en mobile
- Permitir contexto desde servicios y planes
- Permitir adjuntos si se implementa esa funcionalidad
- Mostrar estados de envío, éxito y error
- Evitar dobles envíos
- Tener validación clara
- Mantener accesibilidad durante las animaciones
- Preservar los datos cuando sea razonable después de un error

Arquitectura prevista para producción:

- API route de contacto
- API route de upload
- Vercel Blob para archivos
- Upstash Redis para validación o estado
- Resend para notificaciones por email

Opcionales:

- Trello para creación de leads
- Telegram para notificaciones internas

Si las credenciales no existen durante el desarrollo:

- No inventes valores
- Documenta las variables necesarias
- Implementa una degradación controlada
- Diferencia claramente simulación local y flujo real
- No dejes flags temporales activos para producción

## PRUEBA Y EVIDENCIA

No inventes social proof.

Si todavía no existe suficiente material:

- Diseña secciones preparadas para recibirlo
- Utiliza evidencia cualitativa real
- Oculta secciones incompletas
- Registra los assets o datos pendientes

No publiques:

- Testimonios falsos
- Logos sin autorización
- Métricas estimadas presentadas como reales
- Reviews inexistentes
- Casos de estudio vacíos
- Resultados sin respaldo

Un caso de estudio debe explicar:

- Situación inicial
- Problema
- Trabajo realizado
- Decisiones
- Resultado cualitativo o cuantitativo verificable
- Material visual disponible

## DOCUMENTACIÓN QUE DEBES CREAR

Como estos archivos no existen al iniciar, créalos durante el proyecto:

### 1. `README.md`

Debe contener:

- Descripción
- Stack
- Instalación
- Scripts
- Rutas y/o Secciones
- Variables de entorno
- Cómo ejecutar y desplegar
- Enlaces hacia documentación más profunda

### 2. `Liberty Security_PROJECT_CONTEXT.md`

Debe contener:

- Objetivos del negocio
- Posicionamiento
- Arquitectura
- Componentes
- Sistema visual
- Responsive
- Animaciones
- Integraciones
- Estado de las rutas
- Decisiones comerciales
- Mapa de `data-testid`
- Decisiones que no deben modificarse accidentalmente

### 3. `SEO_WORKLOG.md`

Debe contener:

- Estado del SEO
- Rutas indexables
- Metadata implementada
- Structured data
- Pendientes técnicos
- Pendientes de contenido
- Landing pages futuras
- Acciones externas como Google Business Profile
- Historial de decisiones relevantes

### 4. `AGENTS.md`

Debe contener instrucciones concisas para futuros colaboradores:

- Arquitectura
- Convenciones
- Comandos de verificación
- Reglas comerciales
- Límites de contenido
- Criterios para refactors
- Reglas sobre SEO y animaciones

La documentación debe actualizarse junto con la implementación. No esperes al final para reconstruir las decisiones desde memoria.

## SELECTORES ESTABLES

Añade `data-testid` estables a:

- Navegación
- Secciones principales
- CTA importantes
- Cards repetidas
- Planes
- Comparaciones
- Formulario
- Estados de envío
- Elementos críticos para regresión visual

Los nombres deben describir la función y el contexto, por ejemplo:

- `home-hero-section`
- `home-services-card-grid`
- `plans-grid-growth-card`
- `contact-form-submit-button`

No bases los nombres en detalles visuales temporales.

## FORMA DE TRABAJO

### FASE 0 — ALINEACIÓN

Antes de escribir código, entrega un Blueprint inicial que incluya:

1. Tu interpretación del negocio
2. Público objetivo
3. Posicionamiento
4. Sitemap propuesto
5. Objetivo y CTA de cada ruta
6. Jerarquía comercial
7. Dirección visual
8. Modelo de contenido
9. Arquitectura técnica
10. Estrategia responsive
11. Estrategia de animación
12. Estrategia SEO
13. Analítica
14. Integraciones
15. Información y assets faltantes
16. Decisiones que requieren mi aprobación

Agrupa todas las preguntas bloqueantes en esta fase. No las distribuyas en múltiples rondas salvo que aparezca una contradicción nueva e imposible de prever.

No preguntes por decisiones pequeñas, reversibles o resolubles mediante buenas prácticas.

No comiences la implementación hasta que apruebe el Blueprint.

### FASE 1 — FUNDACIÓN

Después de la aprobación:

- Crea la estructura del proyecto
- Define tokens visuales
- Define contenido base
- Implementa metadata
- Crea componentes fundamentales
- Configura layout, Header y Footer
- Crea documentación inicial

### FASE 2 — SECCIONES PRINCIPALES

Implementa la landing en orden de prioridad comercial:

1. Home
2. Services
3. Plans
5. Case studies
4. About
6. Contact

No desarrolles todas simultáneamente. Completa y valida una sección antes de extender patrones defectuosos al resto del sitio.

### FASE 3 — INTEGRACIONES

Implementa:

- Tracking
- Formulario
- Uploads
- Entrega de leads
- Consentimiento analítico
- Structured data
- Sitemap y robots

### FASE 4 — QA Y DOCUMENTACIÓN

Valida:

- Mobile
- Desktop
- Keyboard
- Reduced motion
- Overflow
- Contenido
- Metadata
- Build
- Integraciones
- Documentación

## CONTROL DE ALCANCE

Para cada tarea posterior debes declarar:

- Qué modificarás
- Qué conservarás
- Qué queda fuera de alcance
- Cómo verificarás el cambio

No aproveches una tarea pequeña para hacer un refactor amplio no solicitado.

No cambies hover, animaciones, copy, rutas, selectores o metadata fuera de alcance.

Si detectas una mejora relacionada pero no necesaria:

- No la implementes automáticamente
- Regístrala como recomendación
- Continúa con la tarea principal

## CRITERIOS DE ACEPTACIÓN

Una entrega solo está terminada cuando:

- Cumple el objetivo comercial
- No contiene afirmaciones inventadas
- Funciona en mobile y desktop
- No tiene horizontal overflow
- Es navegable con teclado
- Respeta reduced motion
- Conserva comportamientos fuera de alcance
- Usa contenido centralizado
- Tiene metadata correcta
- Mantiene CTA y chips visualmente diferenciados
- Conserva `data-testid` estables
- Pasa lint
- Pasa build
- Pasan los tests relevantes existentes
- Actualiza la documentación correspondiente
- Registra claramente los pendientes externos

## PRIORIDADES PARA TOMAR DECISIONES

Ante un conflicto, prioriza en este orden:

1. Honestidad y evidencia
2. Comprensión del cliente
3. Estrategia comercial
4. Conversión
5. Accesibilidad
6. Rendimiento
7. Consistencia
8. Sofisticación visual
9. Complejidad de animación

Comienza entregándome únicamente la Fase 0: el Blueprint inicial y todas las preguntas realmente bloqueantes.

Adicionalmente a todo este contenido, puedes utilizar el documento `docs/Liberty_Security_Brand_Strategy_and_Landing_Content.docx` para obtener más información de la empresa, pero esta información es complementaria y no reemplaza ningún guideline técnico definido en este mensaje. Si después de analizar ambas informaciones hay algo que se contradiga o no tengas la claridad suficiente, hazme la pregunta y lo resolvemos. También puedes revisar el logo de la empresa en `docs/logo.jpeg`.

¿Te quedó clara toda la información?
