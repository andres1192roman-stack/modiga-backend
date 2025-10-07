Modiga - App de Pedidos (PWA) - Entorno local (online centralizado)

Estructura:
- backend/: API en Node + Express, SQLite, endpoint para exportar Excel.
- frontend/: PWA en React + Vite (instalable desde el navegador).

Requisitos:
- Node.js v16+ y npm

Instrucciones:

1) Backend
   cd backend
   npm install
   npm start
   # backend corre en http://localhost:4000

2) Frontend
   cd frontend
   npm install
   npm run dev
   # frontend corre en http://localhost:5173 (por defecto)

Nota:
- Asegurate que el backend esté corriendo para que la app web funcione.
- La opción "Agregar a pantalla principal" del navegador permite usarla como app móvil.
- Para deploy, podés desplegar backend en Render/Railway y frontend en Vercel/Netlify.
