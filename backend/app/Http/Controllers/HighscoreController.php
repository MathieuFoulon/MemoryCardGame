<?php

namespace App\Http\Controllers;

use App\Models\Highscore;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class HighscoreController extends Controller
{
    /**
     * On appelle cette méthode lorsque l'on veut les 3 meilleurs scores à afficher ( méthode highscoreFinder dans app.js).
     * /highscores
     * GET
     */
    public function list(){
        $highscoreList = Highscore::findBest();
        return response()->json($highscoreList);

    }

    /**
     * On appelle cette méthode lorsque l'on veut envoyer notre score sur la BDD ( méthode highscorePusher dans app.js)
     * /highscores
     * POST
     */
    public function add(Request $request) {

        $newHigscore = new Highscore();
        // on récupère les infos envoyés depuis le frontend : le score ( le temps mis pour gagner) et le move ( le nombre de mouvements fait pour gagner)
        $newHigscore->score = $request->input('score');
        $newHigscore->move = $request->input('move');

        // on insère les données en BDD
        $isInserted = $newHigscore->save();
        // si tout s'est bien passé, on renvoie une 201, sinon une 500
        if ($isInserted){
            return response()->json($newHigscore, Response::HTTP_CREATED);
        }else{
            return response( "", Response::HTTP_INTERNAL_SERVER_ERROR );
        }
    }
}
