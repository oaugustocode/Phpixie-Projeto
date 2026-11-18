# Central de Programadores — frontend

React 19 + Vite. Conversa com a API PHPixie via proxy (`/api` → `127.0.0.1:8000`, ver `vite.config.js`).

```sh
# terminal 1 — backend
cd backend
tools/php74/php.exe -S 127.0.0.1:8000 -t web web/index.php

# terminal 2 — frontend
cd frontend
npm run dev        # http://localhost:5173
```

Smoke test da API (com o backend rodando): `cd backend && tools/php74/php.exe tests/api_smoke.php`
