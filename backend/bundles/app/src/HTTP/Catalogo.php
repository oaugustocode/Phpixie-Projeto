<?php

namespace Project\App\HTTP;

/**
 * Tecnologias e trilhas (leitura pública, sem login).
 */
class Catalogo extends Api
{
    public function tecnologiasAction($request)
    {
        return $this->json($this->all('SELECT * FROM tecnologias ORDER BY categoria, nome'));
    }

    public function tecnologiaAction($request)
    {
        return $this->json($this->found(
            $this->first('SELECT * FROM tecnologias WHERE id = ?', array($this->id($request))),
            'Tecnologia não encontrada.'
        ));
    }

    public function trilhasDaTecnologiaAction($request)
    {
        return $this->json($this->all(
            'SELECT * FROM trilhas WHERE tecnologia_id = ? ORDER BY ordem',
            array($this->id($request))
        ));
    }

    public function trilhasAction($request)
    {
        return $this->json($this->all(
            'SELECT t.*, tc.nome AS tecnologia_nome,
                    (SELECT COUNT(*) FROM trilha_videos tv WHERE tv.trilha_id = t.id) AS total_videos
             FROM trilhas t JOIN tecnologias tc ON tc.id = t.tecnologia_id
             ORDER BY t.ordem, tc.nome'
        ));
    }

    public function trilhaAction($request)
    {
        $trilha = $this->found($this->first(
            'SELECT t.*, tc.nome AS tecnologia_nome FROM trilhas t
             JOIN tecnologias tc ON tc.id = t.tecnologia_id WHERE t.id = ?',
            array($this->id($request))
        ), 'Trilha não encontrada.');

        $trilha->videos = $this->all(
            'SELECT v.* FROM videos v JOIN trilha_videos tv ON tv.video_id = v.id
             WHERE tv.trilha_id = ? ORDER BY tv.ordem',
            array($trilha->id)
        );
        return $this->json($trilha);
    }
}
