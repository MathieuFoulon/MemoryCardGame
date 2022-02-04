<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

//Ici on va créer deux routes pour notre API, une en GET et une en POST
//Celle en GET nous renverra les 3 meilleurs scores , et celle en POST enverra notre score si on gagne 

$router->get(
    '/highscores',
    [
        'as' => 'highscores-list',
        'uses' => 'HighscoreController@list'
    ]
);
$router->post(
    '/highscores',
    [
        'as' => 'highscores-add',
        'uses' => 'HighscoreController@add'
    ]
);
