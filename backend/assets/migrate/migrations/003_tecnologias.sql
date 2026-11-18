CREATE TABLE tecnologias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL CHECK (categoria IN ('linguagem', 'framework', 'ferramenta')),
    resumo TEXT,
    url_documentacao TEXT
)
