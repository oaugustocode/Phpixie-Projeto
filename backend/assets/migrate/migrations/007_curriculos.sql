CREATE TABLE curriculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    nome_candidato TEXT NOT NULL,
    resumo TEXT,
    experiencias TEXT,
    formacao TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now')),
    atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
)
