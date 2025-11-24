# Aiyu Japan - Roadmap de Mejoras Frontend

## Priorización de Tareas

Las tareas están organizadas en **3 fases** según urgencia e impacto en la experiencia del usuario.

---

## 🔴 FASE 1: CRÍTICO - Correcciones Urgentes (1-2 días)
*Problemas que afectan la usabilidad actual y deben resolverse inmediatamente*

### 1.1 Arreglar estilos rotos en Dashboard (Tailwind v4)
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 4-6 horas  
**Impacto:** Alto - Afecta funcionalidad existente

**Descripción:**
- Revisar y corregir todos los estilos que dejaron de funcionar después de la migración a Tailwind v4
- Verificar componentes del dashboard (user y admin)
- Asegurar que todos los botones, cards y layouts funcionen correctamente

**Archivos afectados:**
- `app/routes/Dashboard.tsx`
- `app/routes/UserDashboard.tsx`
- `app/routes/AdminDashboard.tsx`
- `app/components/user/*`
- `app/components/admin/*`

**Verificación:**
- [ ] Dashboard de usuario renderiza correctamente
- [ ] Dashboard de admin renderiza correctamente
- [ ] Todos los botones son clickeables
- [ ] Cards y layouts responsive funcionan

---

### 1.2 Arreglar banner principal (botón de navegación camuflado)
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 2-3 horas  
**Impacto:** Alto - Afecta navegación principal

**Descripción:**
- Mejorar contraste del botón de navegación en el banner principal
- Agregar sombra o borde para que se distinga del fondo
- Asegurar visibilidad en mobile y desktop

**Archivos afectados:**
- `app/components/sections/HeroSection.tsx`
- `app/index.css` (si se necesitan estilos custom)

**Verificación:**
- [ ] Botón visible en todos los fondos
- [ ] Contraste adecuado (WCAG AA)
- [ ] Funciona en mobile y desktop

---

### 1.3 Agregar sombreado a elementos
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 3-4 horas  
**Impacto:** Medio-Alto - Mejora visual general

**Descripción:**
- Agregar `box-shadow` consistente a cards, buttons y elementos principales
- Crear utilidades de sombra en Tailwind v4
- Aplicar en toda la aplicación para mejor jerarquía visual

**Archivos afectados:**
- `app/index.css` (agregar utilidades de sombra)
- Todos los componentes de UI

**Verificación:**
- [ ] Cards tienen sombra sutil
- [ ] Botones tienen sombra en hover
- [ ] Elementos elevados tienen más sombra
- [ ] Consistencia en toda la app

---

## 🟡 FASE 2: ALTA PRIORIDAD - Mejoras de UX (3-5 días)
*Cambios que mejoran significativamente la experiencia del usuario*

### 2.1 Reorganizar navegación del Header
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 4-5 horas  
**Impacto:** Alto - Simplifica navegación

**Tareas:**
1. ✅ Eliminar "Home" de la navegación
2. ✅ Eliminar "Dashboard" de la navegación
3. ✅ Eliminar mensaje "Welcome" cuando el usuario inicia sesión
4. ✅ Cambiar "Dashboard" por menú desplegable "My Account" (solo cuando usuario está logueado)

**Archivos afectados:**
- `app/components/Layout/Header.tsx`

**Estructura del menú "My Account":**
```
My Account ▼
├── Profile
├── Orders
├── Shipping Requests
├── Storage
├── Japan Address
└── Settings
```

**Verificación:**
- [ ] "Home" no aparece en navegación
- [ ] "Dashboard" no aparece en navegación
- [ ] No hay mensaje "Welcome" visible
- [ ] Menú "My Account" funciona correctamente
- [ ] Links del menú redirigen correctamente

---

### 2.2 Mejorar navegación mobile
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 2-3 horas  
**Impacto:** Alto - Mejora UX mobile

**Descripción:**
- Colocar botones de "Language" y "Logout" uno al lado del otro en el menú desplegable mobile
- Optimizar espacio en el menú mobile

**Archivos afectados:**
- `app/components/Layout/Header.tsx` (sección mobile)

**Verificación:**
- [ ] Botones alineados horizontalmente
- [ ] Espacio optimizado
- [ ] Fácil acceso en mobile

---

### 2.3 Reorganizar Dashboard - Mover Japan Address
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 3-4 horas  
**Impacto:** Medio - Mejora organización

**Descripción:**
- Crear nueva opción "Japan Address" en el dashboard principal
- Mover funcionalidad actual de "Account" a esta nueva sección
- Mantener "Account" solo para información personal

**Archivos afectados:**
- `app/routes/UserDashboard.tsx`
- Crear nuevo componente: `app/components/user/JapanAddressPage.tsx`

**Verificación:**
- [ ] Nueva tab "Japan Address" visible
- [ ] Funcionalidad movida correctamente
- [ ] "Account" solo muestra info personal

---

### 2.4 Reorganizar Homepage - Migrar secciones
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 4-5 horas  
**Impacto:** Alto - Mejora contenido principal

**Tareas:**
1. ✅ Migrar "How it Works" de Services a Homepage
2. ✅ Migrar "Why choose Aiyu Japan" de Services a Homepage
3. ✅ Eliminar "Ready to Shop" del Homepage
4. ✅ Reducir padding Y del Instagram feed

**Archivos afectados:**
- `app/routes/Home.tsx`
- `app/routes/Services.tsx`
- `app/components/sections/HowItWorksSection.tsx`
- `app/components/sections/WhyChooseSection.tsx` (crear si no existe)
- `app/components/sections/SocialMediaSection.tsx`

**Verificación:**
- [ ] Secciones migradas al homepage
- [ ] "Ready to Shop" eliminado
- [ ] Instagram feed con padding reducido
- [ ] Orden lógico de secciones

---

### 2.5 Ordenar sitios recomendados
**Prioridad:** 🟡 ALTA  
**Tiempo estimado:** 2-3 horas  
**Impacto:** Medio - Mejora consistencia

**Descripción:**
- Ordenar sitios recomendados de izquierda a derecha, hacia abajo
- Mantener mismo orden que en Shopping Guide
- Asegurar responsive en mobile

**Archivos afectados:**
- `app/components/sections/RecommendedStoresSection.tsx`

**Verificación:**
- [ ] Orden consistente con Shopping Guide
- [ ] Layout de izquierda a derecha
- [ ] Responsive en mobile

---

## 🟢 FASE 3: MEDIA PRIORIDAD - Nuevas Funcionalidades (1-2 semanas)

### 3.1 Mejorar página de Tiendas Recomendadas
**Prioridad:** 🟢 MEDIA  
**Tiempo estimado:** 6-8 horas  
**Impacto:** Medio - Mejora contenido

**Descripción:**
- Crear página dedicada con grid de tiendas
- Agregar filtros por categoría
- Mejorar información de cada tienda
- Agregar links directos

**Archivos afectados:**
- `app/routes/StoreGuide.tsx` (mejorar existente)
- `app/components/sections/RecommendedStoresSection.tsx`

**Verificación:**
- [ ] Grid responsive
- [ ] Filtros funcionan
- [ ] Links externos funcionan
- [ ] Información completa de tiendas

---

### 3.2 Mejorar layout en Services
**Prioridad:** 🟢 MEDIA  
**Tiempo estimado:** 4-5 horas  
**Impacto:** Medio - Mejora presentación

**Descripción:**
- Reorganizar layout después de mover secciones al homepage
- Mejorar jerarquía visual
- Optimizar contenido restante

**Archivos afectados:**
- `app/routes/Services.tsx`

**Verificación:**
- [ ] Layout limpio y organizado
- [ ] Contenido relevante
- [ ] Responsive

---

### 3.3 Integración de i18n (Inglés y Español)
**Prioridad:** 🟢 MEDIA  
**Tiempo estimado:** 2-3 días  
**Impacto:** Alto - Expande audiencia

**Descripción:**
- Instalar y configurar `i18next`
- Crear archivos de traducción (EN, ES)
- Implementar selector de idioma
- Traducir toda la aplicación

**Archivos afectados:**
- Crear: `app/i18n/` (carpeta con traducciones)
- Crear: `app/i18n/en.json`
- Crear: `app/i18n/es.json`
- Modificar: `app/root.tsx` (inicializar i18n)
- Modificar: Todos los componentes con texto

**Pasos:**
1. Instalar dependencias: `npm install i18next react-i18next i18next-browser-languagedetector`
2. Configurar i18n en `app/root.tsx`
3. Crear archivos de traducción
4. Reemplazar textos hardcodeados con `t('key')`
5. Agregar selector de idioma en Header

**Verificación:**
- [ ] Selector de idioma funciona
- [ ] Traducciones completas
- [ ] Persistencia de idioma seleccionado
- [ ] Cambio de idioma en tiempo real

---

## 🔵 FASE 4: BAJA PRIORIDAD - CMS & Blog (2-3 semanas)

### 4.1 Configurar Strapi CMS
**Prioridad:** 🔵 BAJA  
**Tiempo estimado:** 1-2 días  
**Impacto:** Alto a largo plazo - Gestión de contenido

**Descripción:**
- Instalar y configurar Strapi localmente
- Crear Collection Types para Blog y Noticias
- Configurar permisos y roles
- Deploy a producción

**Pasos:**
1. Instalar Strapi: `npx create-strapi-app@latest strapi-cms`
2. Crear Collection Types:
   - **Blog Post**: Title, Content (Rich Text), Slug, Featured Image, Author, Published Date, Locale
   - **News**: Title, Content, Slug, Image, Date, Locale
3. Configurar API tokens
4. Deploy a Heroku/Railway/Render

**Verificación:**
- [ ] Strapi instalado y corriendo
- [ ] Collection Types creados
- [ ] API accesible
- [ ] Deploy en producción

---

### 4.2 Integrar Strapi con Frontend
**Prioridad:** 🔵 BAJA  
**Tiempo estimado:** 2-3 días  
**Impacto:** Alto a largo plazo

**Descripción:**
- Crear rutas para blog y noticias
- Implementar loaders de React Router v7
- Crear componentes de blog
- Integrar con Strapi API

**Archivos a crear:**
- `app/routes/blog._index.tsx` (lista de posts)
- `app/routes/blog.$slug.tsx` (post individual)
- `app/routes/news._index.tsx` (lista de noticias)
- `app/routes/news.$slug.tsx` (noticia individual)
- `app/lib/strapi.ts` (cliente API)

**Ejemplo de loader:**
```tsx
// app/routes/blog.$slug.tsx
export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  const response = await fetch(
    `${STRAPI_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`
  );
  const data = await response.json();
  return data;
}
```

**Verificación:**
- [ ] Blog posts se cargan desde Strapi
- [ ] Noticias se cargan desde Strapi
- [ ] SSR funciona correctamente
- [ ] Imágenes se muestran
- [ ] SEO optimizado

---

## 📊 Resumen de Estimaciones

| Fase | Tiempo Total | Prioridad |
|------|--------------|-----------|
| Fase 1: Crítico | 1-2 días | 🔴 CRÍTICA |
| Fase 2: Alta | 3-5 días | 🟡 ALTA |
| Fase 3: Media | 1-2 semanas | 🟢 MEDIA |
| Fase 4: Baja | 2-3 semanas | 🔵 BAJA |

**Total estimado:** 4-6 semanas para completar todo el roadmap

---

## 🎯 Recomendación de Ejecución

### Sprint 1 (Semana 1): Correcciones Críticas
- ✅ Arreglar estilos Dashboard (Tailwind v4)
- ✅ Arreglar banner principal
- ✅ Agregar sombreado a elementos

### Sprint 2 (Semana 2): Mejoras de UX
- ✅ Reorganizar navegación Header
- ✅ Mejorar navegación mobile
- ✅ Reorganizar Dashboard (Japan Address)
- ✅ Reorganizar Homepage

### Sprint 3 (Semana 3-4): Nuevas Funcionalidades
- ✅ Mejorar página Tiendas Recomendadas
- ✅ Mejorar layout Services
- ✅ Integración i18n (EN/ES)

### Sprint 4 (Semana 5-6): CMS & Blog
- ✅ Configurar Strapi
- ✅ Integrar Strapi con Frontend

---

## 📝 Notas Importantes

1. **Tailwind v4**: Todas las nuevas funcionalidades deben usar Tailwind v4 (sin `@apply` en componentes)
2. **React Router v7**: Usar loaders para data fetching (especialmente para CMS)
3. **SSR**: Asegurar que todas las páginas nuevas soporten SSR
4. **Testing**: Probar cada fase antes de pasar a la siguiente
5. **Mobile First**: Todas las mejoras deben ser responsive

---

## 🚀 Próximos Pasos Inmediatos

1. **Revisar y aprobar** este roadmap
2. **Crear branch** para Fase 1: `feature/phase-1-critical-fixes`
3. **Comenzar** con arreglo de estilos en Dashboard
4. **Comunicar** progreso diario

---

**Última actualización:** 2025-11-24  
**Versión:** 1.0
