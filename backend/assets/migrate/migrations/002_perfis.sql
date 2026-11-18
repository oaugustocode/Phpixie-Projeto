CREATE TABLE perfis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    github TEXT,
    linkedin TEXT,
    area_atuacao TEXT
)
