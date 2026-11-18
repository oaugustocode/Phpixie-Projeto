<?php

namespace Project\App\HTTP;

/**
 * Diário de estudos: CRUD de anotações, só do dono.
 */
class Diario extends Api
{
    const STATUS_ANOTACAO = array('estudando', 'revisar', 'dominado');

    public function anotacoesAction($request)
    {
        $anotacoes = $this->all(
            'SELECT id, titulo, status, atualizado_em FROM anotacoes
             WHERE user_id = ? ORDER BY atualizado_em DESC, id DESC',
            array($this->userId($request))
        );
        foreach ($anotacoes as $anotacao) {
            $anotacao->tecnologias = $this->tecnologiasDaAnotacao($anotacao->id);
        }
        return $this->json($anotacoes);
    }

    public function anotacaoAction($request)
    {
        return $this->json($this->carregarAnotacao($this->userId($request), $this->id($request)));
    }

    public function criarAnotacaoAction($request)
    {
        $userId = $this->userId($request);
        $dados = $this->dadosAnotacao($request);

        $id = $this->transaction(function () use ($userId, $dados) {
            $this->query(
                'INSERT INTO anotacoes (user_id, titulo, resumo, codigo, status) VALUES (?, ?, ?, ?, ?)',
                array($userId, $dados['titulo'], $dados['resumo'], $dados['codigo'], $dados['status'])
            );
            $id = $this->db()->insertId();
            $this->salvarTecnologias($id, $dados['tecnologias']);
            return $id;
        });

        return $this->json($this->carregarAnotacao($userId, $id), 201);
    }

    public function editarAnotacaoAction($request)
    {
        $userId = $this->userId($request);
        $id = $this->id($request);
        $this->carregarAnotacao($userId, $id); // 404 se não for do usuário
        $dados = $this->dadosAnotacao($request);

        $this->transaction(function () use ($id, $dados) {
            $this->query(
                "UPDATE anotacoes SET titulo = ?, resumo = ?, codigo = ?, status = ?,
                 atualizado_em = datetime('now') WHERE id = ?",
                array($dados['titulo'], $dados['resumo'], $dados['codigo'], $dados['status'], $id)
            );
            $this->query('DELETE FROM anotacao_tecnologias WHERE anotacao_id = ?', array($id));
            $this->salvarTecnologias($id, $dados['tecnologias']);
        });

        return $this->json($this->carregarAnotacao($userId, $id));
    }

    public function apagarAnotacaoAction($request)
    {
        $userId = $this->userId($request);
        $id = $this->id($request);
        $this->carregarAnotacao($userId, $id);
        $this->query('DELETE FROM anotacoes WHERE id = ? AND user_id = ?', array($id, $userId));
        return $this->json(array('ok' => true));
    }

    protected function carregarAnotacao($userId, $id)
    {
        $anotacao = $this->found(
            $this->first('SELECT * FROM anotacoes WHERE id = ? AND user_id = ?', array($id, $userId)),
            'Anotação não encontrada.'
        );
        $anotacao->tecnologias = $this->tecnologiasDaAnotacao($id);
        return $anotacao;
    }

    protected function tecnologiasDaAnotacao($anotacaoId)
    {
        return $this->all(
            'SELECT t.id, t.nome FROM anotacao_tecnologias at
             JOIN tecnologias t ON t.id = at.tecnologia_id WHERE at.anotacao_id = ? ORDER BY t.nome',
            array($anotacaoId)
        );
    }

    protected function dadosAnotacao($request)
    {
        $status = $this->input($request, 'status', false, 'estudando');
        if (!in_array($status, self::STATUS_ANOTACAO, true)) {
            throw new ApiError('Status inválido. Use: ' . implode(', ', self::STATUS_ANOTACAO) . '.', 422);
        }

        // aceita [1, 2] ou [{ id: 1 }, { id: 2 }]
        $tecnologias = array();
        foreach ((array) $this->input($request, 'tecnologias', false, array()) as $item) {
            $tecId = is_array($item) ? (isset($item['id']) ? $item['id'] : null) : $item;
            if (!is_numeric($tecId)) {
                throw new ApiError('Tecnologia inválida.', 422);
            }
            $tecnologias[(int) $tecId] = true;
        }

        return array(
            'titulo'      => $this->input($request, 'titulo', true),
            'resumo'      => $this->input($request, 'resumo', true),
            'codigo'      => $this->input($request, 'codigo'),
            'status'      => $status,
            'tecnologias' => array_keys($tecnologias),
        );
    }

    protected function salvarTecnologias($anotacaoId, $tecnologias)
    {
        foreach ($tecnologias as $tecnologiaId) {
            // SELECT ignora ids que não existem em vez de quebrar na FK
            $this->query(
                'INSERT INTO anotacao_tecnologias (anotacao_id, tecnologia_id)
                 SELECT ?, id FROM tecnologias WHERE id = ?',
                array($anotacaoId, $tecnologiaId)
            );
        }
    }
}
