<?php

// Cada rota: [método, caminho, processor, ação]. Os processors são registrados em src/HTTP.php.
$routes = array(
    array('POST',   'api/auth/login',                 'auth',     'login'),
    array('POST',   'api/auth/cadastro',              'auth',     'cadastro'),
    array('POST',   'api/auth/logout',                'auth',     'logout'),
    array('GET',    'api/tecnologias',                'catalogo', 'tecnologias'),
    array('GET',    'api/tecnologias/<id>',           'catalogo', 'tecnologia'),
    array('GET',    'api/tecnologias/<id>/trilhas',   'catalogo', 'trilhasDaTecnologia'),
    array('GET',    'api/trilhas',                    'catalogo', 'trilhas'),
    array('GET',    'api/trilhas/<id>',               'catalogo', 'trilha'),
    array('GET',    'api/perfil',                     'perfil',   'perfil'),
    array('PUT',    'api/perfil',                     'perfil',   'salvarPerfil'),
    array('GET',    'api/anotacoes',                  'diario',   'anotacoes'),
    array('POST',   'api/anotacoes',                  'diario',   'criarAnotacao'),
    array('GET',    'api/anotacoes/<id>',             'diario',   'anotacao'),
    array('PUT',    'api/anotacoes/<id>',             'diario',   'editarAnotacao'),
    array('DELETE', 'api/anotacoes/<id>',             'diario',   'apagarAnotacao'),
);

$resolvers = array();
foreach ($routes as $i => $route) {
    $resolvers['r'.$i] = array(
        'path'              => $route[1],
        'methods'           => array($route[0]),
        'attributePatterns' => array('id' => '\d+'),
        'defaults'          => array('processor' => $route[2], 'action' => $route[3]),
    );
}

return array(
    'type'      => 'group',
    'resolvers' => $resolvers,
);
