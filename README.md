# clima.now — Dashboard del clima con Next.js 16

Aplicación web responsive que consulta la API pública de [Open-Meteo](https://open-meteo.com/) para mostrar clima actual, pronóstico por horas, pronóstico de 7 días, calidad del aire y ciudades favoritas.

## Requisitos cubiertos

| Requisito | Implementación |
| --- | --- |
| Next.js 16+ con App Router | `next@16.4.6`, directorio `src/app` |
| TypeScript | Tipado estricto (`strict: true`) en todo el proyecto |
| Estilos | Tailwind CSS 4 + estilos globales personalizados |
| 4+ rutas | `/`, `/buscar`, `/ciudad/[slug]`, `/favoritos`, `/acerca` |
| API externa / Route Handlers | Open-Meteo + `/api/geocoding` y `/api/weather` |
| Server + Client Components | Páginas y servicios en servidor; formularios, gráficas y favoritos en cliente |
| Hooks | `useState` y `useEffect` en búsqueda, favoritos y unidades |
| Responsive | Rejillas adaptables y menú móvil |
| Loading UI | `app/loading.tsx`, `buscar/loading.tsx`, `ciudad/[slug]/loading.tsx` y `Suspense` |
| Error UI | `app/error.tsx`, `app/global-error.tsx` y `app/not-found.tsx` |
| Variables de entorno | `.env.local` (ignorado) y `.env.example` (plantilla) |
| Despliegue | Preparado para Vercel (instrucciones abajo) |

## Ejecutar en local

```bash
cd nextjs-clima
npm install
cp .env.example .env.local   # en Windows: Copy-Item .env.example .env.local
npm run dev
```

Abre <http://localhost:3000>.

### Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — compilación de producción
- `npm start` — servir la compilación de producción
- `npm run lint` — ESLint

## Variables de entorno

Configuración en `.env.local` (nunca se sube a Git):

| Variable | Descripción |
| --- | --- |
| `OPEN_METEO_GEO_URL` | Endpoint de geocodificación |
| `OPEN_METEO_FORECAST_URL` | Endpoint de pronóstico |
| `OPEN_METEO_AIR_URL` | Endpoint de calidad del aire |
| `WEATHER_API_TOKEN` | Opcional. Bearer token si se usa un proveedor privado |
| `DEFAULT_CITY` / `DEFAULT_COUNTRY` | Ciudad mostrada en el dashboard |
| `DEFAULT_LAT` / `DEFAULT_LON` | Coordenadas por defecto |
| `FORECAST_DAYS` | Días de pronóstico (1-14) |
| `REVALIDATE_SECONDS` | Segundos de caché de las peticiones externas |

Open-Meteo es gratuito y no exige API key. Aun así, toda la configuración sensible se centraliza en `src/lib/config.ts`, que solo se importa desde código de servidor.

## Estructura

```
src/
├── app/
│   ├── api/geocoding/route.ts     # Proxy de búsqueda de ciudades
│   ├── api/weather/route.ts       # Proxy de pronóstico
│   ├── buscar/                    # Página de búsqueda
│   ├── ciudad/[slug]/             # Detalle dinámico de ciudad
│   ├── favoritos/                 # Favoritos en localStorage
│   ├── acerca/                    # Stack y requisitos
│   ├── error.tsx / global-error.tsx / not-found.tsx
│   ├── loading.tsx
│   ├── layout.tsx / page.tsx / globals.css
├── components/                    # UI reutilizable (cliente y servidor)
├── context/units-context.tsx      # Unidades °C/°F persistentes
├── hooks/use-favorites.ts         # Estado de favoritos
├── lib/                           # Config, servicios y utilidades
└── types/weather.ts
```

## Despliegue en Vercel

1. Sube los cambios a GitHub (`git push origin main`). El proyecto está dentro de la carpeta `nextjs-clima` del repositorio.
2. Entra en [vercel.com/new](https://vercel.com/new) e importa el repositorio `JairoAdrianVR/Bootcamp-FSJ35`.
3. Configura:
   - **Root Directory:** `nextjs-clima`
   - **Framework Preset:** Next.js (detección automática)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Añade las variables de entorno del archivo `.env.example` en *Environment Variables*. `WEATHER_API_TOKEN` puede quedar vacío.
5. Pulsa **Deploy**. Vercel asignará una URL pública tipo `https://<proyecto>.vercel.app`.
6. Opcional: añade un dominio propio en *Project Settings → Domains*.

> Nota: si despliegas desde la raíz del repositorio en lugar de usar *Root Directory*, Vercel no encontrará `package.json`. Asegúrate de seleccionar `nextjs-clima`.

## API externa

- Geocodificación: `https://geocoding-api.open-meteo.com/v1/search`
- Pronóstico: `https://api.open-meteo.com/v1/forecast`
- Calidad del aire: `https://air-quality-api.open-meteo.com/v1/air-quality`

Datos proporcionados por Open-Meteo bajo licencia CC BY 4.0.
