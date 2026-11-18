-- Diário de estudos substitui o CRUD de currículos
DROP TABLE curriculo_tecnologias

-- statement

DROP TABLE curriculos

-- statement

CREATE TABLE anotacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    resumo TEXT,
    codigo TEXT,
    status TEXT NOT NULL DEFAULT 'estudando' CHECK (status IN ('estudando', 'revisar', 'dominado')),
    criado_em TEXT NOT NULL DEFAULT (datetime('now')),
    atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
)

-- statement

CREATE TABLE anotacao_tecnologias (
    anotacao_id INTEGER NOT NULL REFERENCES anotacoes(id) ON DELETE CASCADE,
    tecnologia_id INTEGER NOT NULL REFERENCES tecnologias(id) ON DELETE CASCADE,
    PRIMARY KEY (anotacao_id, tecnologia_id)
)
