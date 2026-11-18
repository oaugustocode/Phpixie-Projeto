<?php

namespace Project\App\HTTP;

/**
 * Login, cadastro e logout. O token Bearer é emitido aqui e lido por Api::userId().
 */
class Auth extends Api
{
    const TOKEN_LIFETIME = 604800; // 7 dias

    public function loginAction($request)
    {
        $email = $this->input($request, 'email');
        $senha = $this->input($request, 'senha');
        $user = $this->first('SELECT * FROM users WHERE email = ?', array($email));

        if (!$user || !$this->security()->password()->verify($senha, $user->senha_hash)) {
            throw new ApiError('E-mail ou senha incorretos.', 401);
        }

        $token = $this->tokens()->create($user->id, self::TOKEN_LIFETIME);
        return $this->json(array(
            'token'   => $token->string(),
            'usuario' => array('id' => (int) $user->id, 'nome' => $user->nome, 'email' => $user->email),
        ));
    }

    public function cadastroAction($request)
    {
        $nome  = $this->input($request, 'nome', true);
        $email = strtolower($this->input($request, 'email', true));
        $senha = $this->input($request, 'senha', true);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new ApiError('Informe um e-mail válido.', 422);
        }
        if (strlen($senha) < 6) {
            throw new ApiError('A senha precisa ter pelo menos 6 caracteres.', 422);
        }
        if ($this->first('SELECT id FROM users WHERE email = ?', array($email))) {
            throw new ApiError('Já existe uma conta com esse e-mail.', 409);
        }

        $this->transaction(function () use ($nome, $email, $senha) {
            $this->query(
                'INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)',
                array($nome, $email, $this->security()->password()->hash($senha))
            );
            // 1:1 — todo usuário nasce com um perfil vazio
            $this->query('INSERT INTO perfis (user_id) VALUES (?)', array($this->db()->insertId()));
        });

        return $this->loginAction($request);
    }

    public function logoutAction($request)
    {
        $this->userId($request);
        $this->tokens()->removeByString($this->bearer($request));
        return $this->json(array('ok' => true));
    }
}
