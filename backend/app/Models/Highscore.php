<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Highscore extends Model
{
    // on utilise le Query Builder d'Eloquent pour faire notre requête SQL : cette méthode renvoie un tableau de 3 tableaux associatifs
    public static function findBest(){
        $highscores  = Highscore::orderBy('score', 'ASC')
                        ->take(3)
                        ->get();
        return $highscores;
    }
}
