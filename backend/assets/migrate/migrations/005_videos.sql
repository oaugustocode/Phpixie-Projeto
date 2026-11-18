CREATE TABLE videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tecnologia_id INTEGER NOT NULL REFERENCES tecnologias(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    url TEXT NOT NULL,
    canal TEXT,
    descricao TEXT
)
