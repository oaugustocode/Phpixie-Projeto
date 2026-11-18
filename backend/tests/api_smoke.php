<?php
// Smoke test da API. Com o servidor rodando (php -S 127.0.0.1:8000 -t web web/index.php):
//   tools/php74/php.exe tests/api_smoke.php
// Cria um usuário descartável, exercita auth + CRUD do diário de estudos e apaga o usuário no fim.

$base = getenv('API_URL') ?: 'http://127.0.0.1:8000/api';

function call($method, $path, $body = null, $token = null)
{
    global $base;
    $headers = array();
    if ($body !== null) $headers[] = 'Content-Type: application/json';
    if ($token) $headers[] = "Authorization: Bearer $token";
    $ctx = stream_context_create(array('http' => array(
        'method' => $method, 'header' => implode("\r\n", $headers),
        'content' => $body === null ? '' : json_encode($body), 'ignore_errors' => true,
    )));
    $raw = file_get_contents($base . $path, false, $ctx);
    preg_match('/\d{3}/', $http_response_header[0], $m);
    return array((int) $m[0], json_decode($raw, true));
}

function check($cond, $label)
{
    echo ($cond ? 'ok   ' : 'FAIL ') . $label . "\n";
    if (!$cond) exit(1);
}

$email = 'smoke' . time() . '@teste.local';

list($s, $r) = call('GET', '/tecnologias');
check($s === 200 && count($r) > 0, 'catálogo público');

list($s, $r) = call('POST', '/auth/cadastro', array('nome' => 'Smoke', 'email' => $email, 'senha' => '123456'));
check($s === 200 && !empty($r['token']), 'cadastro devolve token');
$token = $r['token'];

list($s) = call('POST', '/auth/login', array('email' => $email, 'senha' => 'errada'));
check($s === 401, 'senha errada = 401');

list($s) = call('GET', '/anotacoes');
check($s === 401, 'rota protegida sem token = 401');

list($s, $a) = call('POST', '/anotacoes', array('titulo' => 'Closures', 'resumo' => 'R', 'codigo' => 'fn() => 1',
    'status' => 'revisar', 'tecnologias' => array(1, array('id' => 1), 99999)), $token);
check($s === 201 && $a['status'] === 'revisar' && count($a['tecnologias']) === 1, 'cria anotação, aceita ids/objetos e ignora tecnologia inexistente');

list($s) = call('POST', '/anotacoes', array('titulo' => 'T', 'resumo' => ''), $token);
check($s === 422, 'resumo obrigatório = 422');

list($s) = call('POST', '/anotacoes', array('titulo' => 'T', 'resumo' => 'R', 'status' => 'esquecido'), $token);
check($s === 422, 'status inválido = 422');

list($s, $r) = call('PUT', "/anotacoes/{$a['id']}", array('titulo' => 'T2', 'resumo' => 'R2', 'status' => 'dominado'), $token);
check($s === 200 && $r['titulo'] === 'T2' && $r['status'] === 'dominado' && $r['tecnologias'] === array(), 'edita anotação');

list($s, $r) = call('GET', '/anotacoes', null, $token);
check($s === 200 && count($r) === 1 && isset($r[0]['tecnologias']), 'lista anotações do dono');

list(, $outro) = call('POST', '/auth/cadastro', array('nome' => 'Outro', 'email' => "b$email", 'senha' => '123456'));
list($s) = call('DELETE', "/anotacoes/{$a['id']}", null, $outro['token']);
check($s === 404, 'outro usuário não apaga a anotação');

list($s) = call('DELETE', "/anotacoes/{$a['id']}", null, $token);
check($s === 200, 'dono apaga a anotação');

list($s) = call('POST', '/auth/logout', null, $token);
list($s2) = call('GET', '/perfil', null, $token);
check($s === 200 && $s2 === 401, 'logout invalida o token');

// limpeza: apaga os usuários de teste (cascade leva perfis e tokens)
$db = new PDO('sqlite:' . __DIR__ . '/../assets/database/app.sqlite');
$db->exec('PRAGMA foreign_keys = ON');
$db->prepare('DELETE FROM users WHERE email IN (?, ?)')->execute(array($email, "b$email"));
echo "tudo certo\n";
