CREATE TABLE curriculo_tecnologias (
    curriculo_id INTEGER NOT NULL REFERENCES curriculos(id) ON DELETE CASCADE,
    tecnologia_id INTEGER NOT NULL REFERENCES tecnologias(id) ON DELETE CASCADE,
    nivel TEXT NOT NULL DEFAULT 'basico' CHECK (nivel IN ('basico', 'intermediario', 'avancado')),
    PRIMARY KEY (curriculo_id, tecnologia_id)
)
