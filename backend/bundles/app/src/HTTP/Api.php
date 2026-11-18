<?php

namespace Project\App\HTTP;

/**
 * Base dos processors JSON (Auth, Catalogo, Perfil, Diario). Rotas em assets/config/routeResolver.php.
 * Ações protegidas chamam userId(), que lê "Authorization: Bearer <token>".
 */
abstract class Api extends Processor
{
    protected $db;

    public function process($request)
    {
        try {
            return parent::process($request);
        } catch (ApiError $e) {
            return $this->json(array('erro' => $e->getMessage()), $e->getCode());
        }
    }

    protected function userId($request)
    {
        $token = $this->tokens()->getByString($this->bearer($request));
        if ($token === null) {
            throw new ApiError('Sessão expirada. Entre novamente.', 401);
        }
        return (int) $token->userId();
    }

    protected function bearer($request)
    {
        $header = $request->serverRequest()->getHeaderLine('Authorization');
        return preg_match('/^Bearer\s+(\S+)$/i', $header, $m) ? $m[1] : '';
    }

    protected function id($request)
    {
        return (int) $request->attributes()->get('id');
    }

    /** Lê um campo do corpo JSON (já interpretado pelo PHPixie). Textos são aparados; com $required, campo vazio dá erro 422. */
    protected function input($request, $field, $required = false, $default = '')
    {
        $value = $request->data()->get($field, $default);
        if (is_string($value)) {
            $value = trim($value);
        } elseif ($value === null) {
            $value = $default;
        }
        if ($required && $value === '') {
            throw new ApiError("O campo '$field' é obrigatório.", 422);
        }
        return $value;
    }

    protected function found($row, $message)
    {
        if (!$row) {
            throw new ApiError($message, 404);
        }
        return $row;
    }

    protected function json($data, $status = 200)
    {
        $response = $this->responses()->json($data);
        $response->setStatus($status);
        return $response;
    }

    protected function db()
    {
        if ($this->db === null) {
            $this->db = $this->components()->database()->get('default');
            // SQLite só aplica FKs (e ON DELETE CASCADE) com isso ligado, por conexão
            $this->db->execute('PRAGMA foreign_keys = ON');
        }
        return $this->db;
    }

    protected function query($sql, $params = array())
    {
        return $this->db()->execute($sql, $params);
    }

    protected function all($sql, $params = array())
    {
        return $this->query($sql, $params)->asArray();
    }

    protected function first($sql, $params = array())
    {
        return $this->query($sql, $params)->current();
    }

    protected function transaction($callback)
    {
        $this->db()->beginTransaction();
        try {
            $result = $callback();
            $this->db()->commitTransaction();
            return $result;
        } catch (\Exception $e) {
            $this->db()->rollbackTransaction();
            throw $e;
        }
    }

    protected function security()
    {
        return $this->components()->security();
    }

    protected function tokens()
    {
        $this->db(); // garante o PRAGMA antes do handler usar a conexão
        return $this->security()->tokens()->handler($this->components()->slice()->arrayData(array(
            'storage' => array('type' => 'database', 'connection' => 'default', 'table' => 'tokens'),
        )));
    }
}
