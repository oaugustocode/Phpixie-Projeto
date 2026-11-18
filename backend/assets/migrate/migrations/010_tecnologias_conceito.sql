PRAGMA foreign_keys = OFF

-- statement

CREATE TABLE tecnologias_novo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL CHECK (categoria IN ('linguagem', 'framework', 'ferramenta', 'conceito')),
    resumo TEXT,
    url_documentacao TEXT
)

-- statement

INSERT INTO tecnologias_novo (id, nome, categoria, resumo, url_documentacao)
SELECT id, nome, categoria, resumo, url_documentacao FROM tecnologias

-- statement

DROP TABLE tecnologias

-- statement

ALTER TABLE tecnologias_novo RENAME TO tecnologias

-- statement

PRAGMA foreign_keys = ON
