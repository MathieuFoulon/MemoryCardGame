<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    /**
     * Provide a centralized display of a JSON, with CORS, to all Controllers
     *
     * @param mixed $data
     * @param integer $httpStatusCode
     * @return void
     */
    protected function sendJsonResponse($data, $httpStatusCode=200) {
        // Return response, with headers
        return response()->json($data, $httpStatusCode)
        ->header('Access-Control-Allow-Origin', '*') // Pour l'exemple en local on autorise toute provenance des requêtes ( il faut donc faire attention en production)
        ->header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    }

    /**
     * Provide a centralized empty response, with CORS, to all Controllers
     *
     * @param integer $httpStatusCode
     * @return void
     */
    protected function sendEmptyResponse($httpStatusCode=200) {
        // Return response, with headers
        return response('', $httpStatusCode)
            ->header('Access-Control-Allow-Origin', '*') // Pour l'exemple en local on autorise toute provenance des requêtes ( il faut donc faire attention en production)
            ->header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    }
}
