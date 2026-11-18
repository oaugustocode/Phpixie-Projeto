<?php

namespace Project\App\HTTP;

/**
 * Perfil do usuário (1:1 com users).
 */
class Perfil extends Api
{
    public function perfilAction($request)
    {
        return $this->json($this->carregarPerfil($this->userId($request)));
    }

    public function salvarPerfilAction($request)
    {
        $userId = $this->userId($request);
        $this->query(
            'UPDATE perfis SET bio = ?, github = ?, linkedin = ?, area_atuacao = ? WHERE user_id = ?',
            array(
                $this->input($request, 'bio'),
                $this->input($request, 'github'),
                $this->input($request, 'linkedin'),
                $this->input($request, 'area_atuacao'),
                $userId,
            )
        );
        $nome = $this->input($request, 'nome');
        if ($nome !== '') {
            $this->query('UPDATE users SET nome = ? WHERE id = ?', array($nome, $userId));
        }
        return $this->json($this->carregarPerfil($userId));
    }

    protected function carregarPerfil($userId)
    {
        return $this->first(
            'SELECT u.id, u.nome, u.email, p.bio, p.github, p.linkedin, p.area_atuacao
             FROM users u JOIN perfis p ON p.user_id = u.id WHERE u.id = ?',
            array($userId)
        );
    }
}
