// Eeeet oui, notation objet, on est pas des chevaux d'traits !

const app = {
    baseURL: 'http://localhost:8080', // l'adresse de notre api
    notStartedElement: document.querySelector(".notStarted"), // la div qui affiche " pour démarrer le time.." : tant que le joueur n'a pas fait de mouvements, on la laisse
    progressionTimerElement: document.querySelector(".timeProgression"), // la div qui contiendra la représentation graphique du timer
    movesElement: document.querySelector(".moves"), // la div qui contiendra le nombre de mouvements qu'on a fait
    cardsElements: document.querySelectorAll('.card'), // la div qui contient les deux images superposées
    timer: null, // on initialise le timer à null
    seconds: 100, // pareil pour le nombre de secondes sur lequel travaillera le timer : 100 secondes
    movesNumber: 0, // notre nombre de mouvements effectués : au commencement du jeu : 0 mouvement fait
    hasFlippedCard: false, // c'est un booléen qui représente si une carte est retournée dans le jeu ou non
    firstCard: null, // la première carte cliquée
    secondCard: null, // la seconde carte cliquée
    flipBlocker: false, // c'est un booléen qui nous servira à indiquer si on doit bloquer ou non le fait de pouvoir retourner une carte
    cardsValidated: 0, // le nombre de paires gagnantes : au commencement 0 ( normal, p'tit malin )

    //init est la première fonction appellée : elle initialise le jeu
    init: function () {
        // on fait appel à notre mélangeur de cartes
        app.cardsDealer();



        // on fait appel à notre API pour nous renvoyer les highscores
        app.highscoreFinder();

        // on écrit dans la div correspondante qu'au lancement du jeu on est à 0 mouvements : on aurait pu le faire directement dans le HTML, mais c'est plus marrant comme ça
        app.movesElement.textContent = "Mouvements effectués : " + app.movesNumber;

        // on ajoute un écouteur d'évenement sur TOUTES les cartes, pas mal comme technique hein ?
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        // a partir de là, on attend que le joueur clique : va voir la méthode cardFlipper pour voir ce qu'il se passe ensuite !
        app.cardsElements.forEach(card => card.addEventListener('click', app.cardFlipper));
    },

    // notre distributeur de cartes : comme on utilise flexbox, on peut indiquer un ordre entre les enfants, et c'est ce qu'on fait ici, mais de manière totalement aléatoire !
    cardsDealer: function () {
        // on prends les cartes et on leur assigne un ordre une par une
        app.cardsElements.forEach(cardElement => {
            // on a 24 cartes, alors on utilise 24 comme multiplicateur : mais n'oublie pas, c'est random, et flexbox et l'ordre... 
            // en fait flexbox s'en fiche un peu de ce qu'il va se passer pour l'ordre, même si 24 nombres différents ne sont pas tirer, il arrangera lui même l'ordre entre les multiples 7 ou 6 ou 22... quoi qu'il arrive, on aura un jeu bien mélangé !
            let order = Math.floor(Math.random() * 24);
            cardElement.style.order = order;
        })
    },

    // c'est notre appel à l'API pour avoir les highscores
    highscoreFinder: function(){
        let config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };
        // on va sur notre route http://localhost:8080/highscores en GET
        fetch(app.baseURL + '/highscores', config)
        .then(function(response){
            console.log(response);
            return response.json();
        })
        // on a notre réponse et notre objet higscores ! on cible maintenant la div où on affichera tout ça
        .then(function(highscores){
            let highscoresElement = document.querySelector(".highscores");

            // c'est un peu tricky ici : on se sert de la boucle "for..of" pour naviguer dans highscores et sortir les données... Mais de base, un for...of ne renvoie pas d'index... C'est làa que .entries() fait son entrée !
            //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
            for(const [index, highscore] of highscores.entries()){
                let singleScoreElement = document.createElement("p"); // on crée un élément paragraphe qui accueillera nos données
                singleScoreElement.classList.add("singleScore"); // on lui ajoute la classe .singleScore

                // on oublie pas qu'un tableau commence toujours à l'index 0 ! 
                singleScoreElement.textContent = "Record n° "+ (index + 1)+" Réalisé en " + highscore.score + " secondes et " + highscore.move + " mouvements";
                
                highscoresElement.appendChild(singleScoreElement); // et on colle le tout dans la div parente
            }
        });
    },

    // notre compteur de temps : on y manipule du CSS pour faire réduire notre barre de progression, et on checke aussi s'il reste du temps !
    timeCounter: function () {
        app.progressionTimerElement.style.width = app.seconds + '%';
        app.notStartedElement.style.visibility = "hidden";
        app.progressionTimerElement.parentNode.style.visibility = "visible";
        // on décrémente le nombre de secondes restantes : une seconde en moins toutes les secondes
        app.seconds--;
        if (app.seconds < 0) {
            // si le timer descend en dessous de 0 alors on le coupe
            clearInterval(app.timer);

            // et on indique au joueur qu'il a perdu !
            app.gameLost();
        }
    },

    // c'est notre retourneur de cartes : si on clique dessus (face cachée), la carte montre le fruit
    cardFlipper: function (evt) {
        let clickedCard = evt.target.parentNode; // on va agir sur la div parente à l'image
        if (app.flipBlocker) {
            //si le bloqueur de carte est actif, on sort de la fonction sans rien faire : il est initialisé à false au lancement du jeu
            return;
        }
        if (clickedCard === app.firstCard) {
            // si la carte sur laquelle on a cliqué sur ma même carte : on sort de la fonction sans rien faire ( on attend en fait que le joueur clique sur une autre carte )
            return;
        }

        // si le joueur clique sur une carte :  on la retourne !
        clickedCard.classList.add('flip');

        if (!app.hasFlippedCard) {
            // si il n'y a pas encore de carte retournée, alors on détermine que cette carte sera la première de la future paire et on dit qu'il y a une carte retournée dans le jeu, attendant sa promise ! Mignon non ?
            app.hasFlippedCard = true;
            app.firstCard = clickedCard;
            return
        }

        // si ce n'est pas la première et que ce n'est pas la même carte, alors c'est la deuxième !
        app.secondCard = clickedCard;

        // on incrémente le nombre de mouvement ! une paire ( vraie comme fausse ) = 1 mouvement
        app.movesNumber++;
        app.movesElement.textContent = "Mouvements effectués : " + app.movesNumber;

        //comme on le disait plus haut : on attendais que le joueur commence la partie : il a tenté de créer une paire, donc on peut lancer le timer !
        if (app.movesNumber == 1) {
            //setInterval est une fonction de JavaScript qui permet de lancer une action tous les "n" temps : ici 1000 ms, soit 1 seconde !
            app.timer = setInterval(app.timeCounter, 1000);

        }

        // on a une paire ? il faudrait maintenant vérifier si elle est vraie ou fausse !
        app.equalityChecker(app.firstCard, app.secondCard);

    },

    // et bien c'est tout bête : comme je le disais dans index.html, on va se servir de l'attribut data-fruit !

    equalityChecker: function (card1, card2) {
        if (card1.dataset.fruit === card2.dataset.fruit) {
            // si les cartes correspondent, alors on ne les rends plus cliquables
            app.cardDisabler(card1, card2);
            // et on regarde si la partie est gagnée ou non
            app.winChecker();
            return;
        }
        // si les cartes ne correspondent pas, on les remet face cachée
        app.cardUnflipper(card1, card2);
    },

    // cette méthode permet de mettre les cartes en mode "validées" : on les laisse face apparente avec un petit liseret vert, et on incrément notre compteur de cartes validées 
    cardDisabler: function (card1, card2) {
        card1.removeEventListener('click', app.cardFlipper);
        card1.querySelector('.frontCard').classList.add('validated');
        card2.removeEventListener('click', app.cardFlipper);
        card2.querySelector('.frontCard').classList.add('validated');
        app.cardsValidated++;
        // on réinitialise l'état des cartes
        app.stateReseter();
    },

    // on vérifie si l'on a gagné ! c'est aussi très simple : on 12 paires, donc si app.cardsValidated = 12, on a fini !
    winChecker: function(){
        if(app.cardsValidated == 12){
            // on stoppe le décompte du temps
            clearInterval(app.timer);
            //on envoie notre score en BDD
            app.highscorePusher();

            // et on indique au joueur qu'il a gagné ! s'il clique sur le "ok" du modal, la page se recharge, donc le script aussi, et app.init() réinitialise le jeu
            if(confirm("C'est gagné en "+ (100 - app.seconds) +" secondes et "+ app.movesNumber+" mouvements ! on recommence ?")){
                location.reload();
            }
        }
    },

    // c'est notre méthode pour envoyer notre score en POST
    highscorePusher: function(){
        const data = {
            // vous vous rappelez qu'on avait du mettre en BDD les champs updated_at et created_at ? et bien pas d'inquiètude, l'ORM Eloquent se charge de remplir ces champs pour nous, on a juste à renvoyer le reste !
            score: 100 - app.seconds,
            move: app.movesNumber,

        };

        const httpHeaders = new Headers();
        httpHeaders.append("Content-Type", "application/json");

        const config = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: httpHeaders,
            // on convertit nos données aux format JSON
            body: JSON.stringify(data)
        };


        fetch(app.baseURL + '/highscores', config)
            .then(function (response) {
                console.log(response);
                if (response.status === 201) {
                    // si tout s'est bien passé on reçoit une 201
                    console.log("Score envoyé");
                    return response.json();
                } else {
                    // ah bah faut aller voir sur le serveur ce qu'il se passe ! un problème SQL peut-être ?
                    console.log('Une erreur est survenue !');
                }
            });
    },

    // si on perds, on veut que le jeu s'arrête : on désactive donc le clic sur toutes les cartes !
    allCardsDisabler: function () {
        app.flipBlocker = true;
        app.cardsElements.forEach(card => card.removeEventListener('click', app.cardFlipper));
    },

    // si on a fait une mauvaise paire, il faudrait l'indiquer au joueur avec un petit liseret rouge, et remettre les cartes faces cachées au bout d'une seconde, le temps qu'il mémorise ses cartes
    cardUnflipper: function (card1, card2) {
        app.flipBlocker = true;
        card1.querySelector('.frontCard').classList.add("wrong");
        card2.querySelector('.frontCard').classList.add("wrong");
        // on ajoute un petit délai d'une seconde avant de remettre les cartes faces cachées
        setTimeout(() => {
            card1.classList.remove("flip");
            card1.querySelector('.frontCard').classList.remove("wrong");
            card2.classList.remove("flip");
            card2.querySelector('.frontCard').classList.remove("wrong");
            app.stateReseter();
        }, 1000);
    },

    // PERDUUUUUUUUUUUUUUU BOOOUUUUUUH  ! Temps écoulé ! On desactive le clic sur les cartes et on demande si le joeur veut recommencer ! Si oui on recharge la page
    gameLost: function () {
        app.allCardsDisabler();
        if(confirm("Temps écoulé ! On remet ça ?")){
            location.reload();
        }
    },

    // ici on indique que les cartes non validées sont remis à leur état initial: on a aucune carte en cours jouée !
    stateReseter: function () {
        app.hasFlippedCard = false;
        app.flipBlocker = false;
        app.firstCard = null;
        app.secondCard = null;
    }



}

// notre page a fini de charger ? On lance le jeu !
document.addEventListener("DOMContentLoaded", app.init); 