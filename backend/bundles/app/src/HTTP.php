<?php

namespace Project\App;

class HTTP extends \PHPixie\DefaultBundle\HTTP
{
    protected $classMap = array(
        'auth'     => 'Project\App\HTTP\Auth',
        'catalogo' => 'Project\App\HTTP\Catalogo',
        'perfil'   => 'Project\App\HTTP\Perfil',
        'diario'   => 'Project\App\HTTP\Diario',
    );
}
