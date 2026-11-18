# Central de Programadores

Projeto de faculdade, feito em dupla. É um site para quem está aprendendo a programar: documentação das tecnologias, trilhas de "como começar" com vídeos, um diário de estudos e um guia para montar o currículo.

## 1. Requisitos do trabalho

| Requisito | Como foi atendido |
|---|---|
| Tema livre | Central de programadores |
| Framework da dupla | PHPixie 3 no backend |
| Front-end em React | React 19 + Vite (`frontend/`) |
| Login com token | `POST /api/auth/login` devolve um token, e o React manda `Authorization: Bearer <token>` nas rotas protegidas |
| Pelo menos um CRUD | CRUD de anotações do diário de estudos (criar, listar, ver, editar e apagar), restrito ao dono |
| Mínimo de 5 tabelas | 9 tabelas (seção 2) |
| Relação 1:1 | `users` e `perfis` |
| Relação N:N | `trilhas` e `videos` (por `trilha_videos`); `anotacoes` e `tecnologias` (por `anotacao_tecnologias`) |
| Página "Quem somos" com RA e nomes | Matheus Augusto Gomes de Andrade (RA 221621) e William Xavier Ribeiro (RA 221852) |

## 2. Banco de dados (SQLite)

| Tabela | Campos principais | Relações |
|---|---|---|
| `users` | id, nome, email (único), senha_hash, criado_em | 1:1 com `perfis` |
| `perfis` | id, user_id (único), bio, github, linkedin, area_atuacao | 1:1 com `users` |
| `tecnologias` | id, nome, categoria (linguagem, framework, ferramenta ou conceito), resumo, url_documentacao | 1:N com `trilhas` e `videos`; N:N com `anotacoes` |
| `trilhas` | id, tecnologia_id, titulo, descricao, nivel, ordem | N:N com `videos` |
| `videos` | id, tecnologia_id, titulo, url, canal, descricao | N:N com `trilhas` |
| `trilha_videos` | trilha_id, video_id, ordem (chave composta) | associativa |
| `anotacoes` | id, user_id, titulo, resumo, codigo, status (estudando, revisar ou dominado), criado_em, atualizado_em | N:1 com `users`; N:N com `tecnologias` |
| `anotacao_tecnologias` | anotacao_id, tecnologia_id (chave composta) | associativa |
| `tokens` | series, userId, challenge, expires | N:1 com `users`; usada pelo `phpixie/security` |

As migrations 007 e 008 criaram uma versão anterior do projeto, com CRUD de currículos. A 011 apagou essas tabelas e criou o diário no lugar.

## 3. API (JSON)

Rotas públicas:
- `POST /api/auth/login` e `POST /api/auth/cadastro`
- `GET /api/tecnologias` e `GET /api/tecnologias/{id}`
- `GET /api/tecnologias/{id}/trilhas`
- `GET /api/trilhas` e `GET /api/trilhas/{id}` (esta inclui os vídeos)

Rotas protegidas (exigem `Authorization: Bearer <token>`):
- `POST /api/auth/logout`
- `GET /api/perfil` e `PUT /api/perfil`
- `GET /api/anotacoes` e `POST /api/anotacoes`
- `GET /api/anotacoes/{id}`, `PUT /api/anotacoes/{id}` e `DELETE /api/anotacoes/{id}`

## 4. Telas (React)

1. **Login e cadastro**
2. **Início**: apresentação e atalhos
3. **Documentações**: explorador que lê o catálogo do DevDocs, com busca
4. **Tecnologia**: resumo, link da documentação oficial e trilhas
5. **Trilha**: vídeos recomendados
6. **Como começar**: cinco canais de YouTube em português
7. **Como criar um currículo**: guia com modelo de exemplo
8. **Diário de estudos**: lista e formulário de anotações, com prévia
9. **Perfil**
10. **Quem somos**

## 5. Fora do escopo

- Recuperação de senha e confirmação de e-mail
- Painel para cadastrar tecnologias e vídeos (a carga inicial vem dos seeds)
- Deploy público

## 6. Observações

- O catálogo inicial tem PHP, JavaScript, React, SQL, Git e Lógica de Programação. Só a trilha de lógica tem vídeo (playlist do Gustavo Guanabara). As outras trilhas estão sem vídeo porque não colocamos URLs que não tivéssemos conferido.
- Tokens ficam na tabela `tokens`, o que permite fazer logout de verdade.
- O SQLite só aplica chaves estrangeiras com `PRAGMA foreign_keys = ON`. Isso é ligado em `Api::db()`.
- O projeto usa PHP 7.4.33 (`backend/tools/php74/`), a versão compatível com o PHPixie. Ela não tem mais suporte, então não serve para publicar na internet.
- Teste da API: `cd backend && tools/php74/php.exe tests/api_smoke.php`, com o servidor rodando (ver `frontend/README.md`).
