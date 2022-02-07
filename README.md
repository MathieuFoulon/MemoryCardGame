# Backend

Pour rester dans le thème du cours sur les API d' O'Clock, on va rester sur le microframework Lumen !

L'installation va être plutôt simple, on se place dans le dossier `backend`, on se fait un petit coup de `composer install`, on crée son fichier `.env` avec les infos nécessaires ( voir le `.env.example`)
Ensuite, un petit tout sur Adminer, et on se crée notre base de données "memorygame" !
On y insère une table "highscores" avec 5 champs : 
- "id" en int auto-increment
- "score" en int
- "move" en int
- "created_at" en datetime
- "updated_at" en datetime

Je vous propose ensuite de créer 4 données, histoire d'avoir quelque chose à afficher pour le front ( mettez des valeurs farfelues sur "score" au dessus de 90, comme ça vous aurez plus de chance d'apparaître dedans lors de vos prochaines parties :D )

Et voilà ! On peut lancer notre petit serveur PHP avec la commande `php -S 0.0.0.0:8080 -t public`  ( toujours depuis le dossier `backend`!

# Frontend



Aaaaaah là on va rigoler un peu plus, des souvenirs de batailles navales me viennent à l'ésprit, navigant sur les eaux mornes de la douleur que nous infligeait JavaScript, à nous, pauvres étudiants que nous étions à l'époque.

Bon en fait c'est pas vrai, mais on va rigoler parce qu'on va se rendre compte que c'est plutôt simple, bien que la taille du fichier app.js fasse un peu peur.

Alors on flippe pas, on essaye le jeu, on lit le code doucement, y a plein de commentaires exprès, c'est plus que du pas à pas, je vous prends carrément par la main.

J'espère aussi que vous aimez les fruits, parce que perso, j'en peux plus.

Petit travail à faire : le fichier index.html est un peu long non ? Il doit bien y avoir moyen, grâce à JavaScript, de réduire sa taille... 

Aller hop, on va dans sur notre localhost chercher le dossier `frontend` de ce projet, et je vous souhaite une bonne partie et bon courage !
