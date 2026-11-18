<?php

namespace Project\App\HTTP;

/** Erro do cliente, convertido em resposta JSON por Api::process(). O código é o status HTTP. */
class ApiError extends \Exception
{
}
