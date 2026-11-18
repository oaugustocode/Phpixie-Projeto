CREATE TABLE trilha_videos (
    trilha_id INTEGER NOT NULL REFERENCES trilhas(id) ON DELETE CASCADE,
    video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (trilha_id, video_id)
)
