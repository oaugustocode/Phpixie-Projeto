# Central de Programadores

Site para quem está aprendendo a programar: documentação das tecnologias, trilhas de "como começar" com vídeos, diário de estudos e guia de currículo. Projeto de faculdade (escopo completo em [ESCOPO.md](ESCOPO.md)).

- **Backend:** PHPixie 3, PHP 7.4, SQLite (`backend/`)
- **Frontend:** React 19 + Vite (`frontend/`)

O frontend chama a API por proxy (`/api` → `http://127.0.0.1:8000`, ver `frontend/vite.config.js`), então o backend precisa estar rodando na porta **8000**.

## Requisitos

- **PHP 7.4** com as extensões `pdo_sqlite`, `sqlite3`, `mbstring` e `openssl` (o PHPixie 3 não funciona em PHP 8)
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) 20 ou superior (com npm)

> O projeto original usa um PHP 7.4 portátil em `backend/tools/php74/`, que **não vai para o repositório**. Nos comandos abaixo, `php` é o seu PHP 7.4. Se você tem esse PHP portátil, use `tools/php74/php.exe` no lugar.

## Backend

```sh
cd backend

# 1. dependências
composer install

# 2. banco SQLite (a pasta precisa existir; o arquivo é criado pelas migrations)
mkdir assets/database        # Windows (cmd/PowerShell): mkdir assets\database
php console framework:migrate
php console framework:seed

# 3. servidor em http://127.0.0.1:8000
php -S 127.0.0.1:8000 -t web web/index.php
```

Passos 1 e 2 só na primeira vez. Para recriar o banco do zero, apague `backend/assets/database/app.sqlite` e repita o passo 2.

Teste rápido da API (com o servidor rodando): `php tests/api_smoke.php`

## Frontend

Em outro terminal, com o backend já rodando:

```sh
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173.

Outros comandos: `npm run build` (gera `dist/`), `npm run lint`, `npm run preview`.

## Problemas comuns

- **Erro de conexão / `ECONNREFUSED` no frontend:** o backend não está rodando na porta 8000.
- **`unable to open database file`:** faltou criar `backend/assets/database/` antes de rodar as migrations.
- **Documentações não carregam:** o explorador usa a API pública do DevDocs (via proxy do Vite), então precisa de internet.

## Autores

Matheus Augusto Gomes de Andrade (RA 221621) e William Xavier Ribeiro (RA 221852).
