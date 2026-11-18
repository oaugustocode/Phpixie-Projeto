import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// O DevDocs responde 403 quando o Referer é outro site, então o proxy tira os dois cabeçalhos
const semReferer = (proxy) =>
  proxy.on('proxyReq', (req) => {
    if (!req.headersSent) {
      req.removeHeader('referer')
      req.removeHeader('origin')
    }
  })

// /api vai para o PHPixie (php -S 127.0.0.1:8000 -t web web/index.php), sem precisar de CORS.
// /devdocs-* espelham a API pública do DevDocs (catálogo e conteúdo) pelo mesmo motivo.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/devdocs-catalog': {
        target: 'https://devdocs.io',
        changeOrigin: true,
        // sem followRedirects: ele envolve a request e quebra o semReferer (headers já enviados)
        configure: (proxy) => {
          semReferer(proxy)
          // docs.json responde 303 para /assets/docs-<hash>.json: mantém o redirect dentro do proxy
          proxy.on('proxyRes', (res) => {
            if (res.headers.location) res.headers.location = res.headers.location.replace('https://devdocs.io', '/devdocs-catalog')
          })
        },
        rewrite: (p) => p.replace(/^\/devdocs-catalog/, ''),
      },
      '/devdocs-content': {
        target: 'https://documents.devdocs.io',
        changeOrigin: true,
        configure: semReferer,
        rewrite: (p) => p.replace(/^\/devdocs-content/, ''),
      },
    },
  },
})
