CREATE TABLE trilhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tecnologia_id INTEGER NOT NULL REFERENCES tecnologias(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    nivel TEXT NOT NULL CHECK (nivel IN ('iniciante', 'intermediario', 'avancado')),
    ordem INTEGER NOT NULL DEFAULT 0
)
