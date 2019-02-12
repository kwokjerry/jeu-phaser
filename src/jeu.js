(function () {  // IIFE
    "use strict";

    //Variable pour référencer le jeu
    var leJeu;//Référence au jeu dans les différentes fonctions
    var leSon; //Référence le son dans les différentes fonctions
    
    //Constantes du jeu
    const TAILLE_IMAGE = 160;
	const NB_COLONNES = 4;
	const NB_LIGNES = 5;
	const NB_IMAGES = NB_COLONNES * NB_LIGNES;
    const ESPACEMENT = 10; // L'espacement souhaité entre les images sur les lignes et les 
    const NOM_LOCAL_STORAGE = "scoreTP1"; //Sauvegarde et enregistrement du meilleur score 
    const NO_IMG_DESSUS = 1; //Image du dessus à afficher
    const TEMPS_JEU = 10; //Le temps du jeu en secondes
    const NB_POISSON = 17;  //Le nombre de poisson dans le jeu
    
    //Variables de score pour le jeu 
    var score; // Le score du jeu
    var meilleurScore; //Meilleur score antérieur enregistré
    
    //On créera le jeu quand la page HTML sera chargée
    window.addEventListener("load", function () {
        
        leJeu= new Phaser.Game(640, 960);

        //Ajout des états du jeu, et sélection de l'état au démarrage
        leJeu.state.add("Demarrage", Demarrage);
        leJeu.state.add("ChargementMedias", ChargementMedias);
        leJeu.state.add("IntroJeu", IntroJeu);
        leJeu.state.add("Jeu", Jeu);
        leJeu.state.add("FinJeu", FinJeu);
        
        //Vérification d'un meilleur score antérieur enregistré
        meilleurScore = localStorage.getItem(NOM_LOCAL_STORAGE) == null ? 0 : localStorage.getItem(NOM_LOCAL_STORAGE);
        
        //Définir l'écran (state) au démarrage
        leJeu.state.start("Demarrage");
        
     }, false);
    
    
	////////////////////////////////
	//         Demarrage          //
	////////////////////////////////	

	/**
	 * Fonction de démarrage permettant de centrer le canvas
	 * Charger la barre de chargement
	 */
	var Demarrage = function () {};

	Demarrage.prototype = {

		init: function () {
			//Centrer le jeu dans l'écran et définir son mode de mise à l’échelle
            leJeu.scale.pageAlignHorizontally = true;
            leJeu.scale.pageAlignVertically = true;
            
            leJeu.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		},

		preload: function () {
			//Charger les images pour illustrer le chargement
			//Chemin commun à toutes les images
			leJeu.load.path = "medias/img/";
            
            leJeu.load.images(["barreChargement", "barreChargementVide"]);
		},

		create: function () {
			leJeu.state.start("ChargementMedias");
		}
	}
    
    ////////////////////////////////
	//      ChargementMedias      //
	////////////////////////////////

	/**
	 * Fonction constructeur (classe) permettant de définir l'écran (state)
	 * pour le chargement des médias
	 */
    var ChargementMedias = function () {};

	ChargementMedias.prototype = {
        
        /*===============================================
        *==================SOURCES IMAGES================
        *================================================
        * - Les sprites de jeu ont été faites par moi sur Adobe Illustrator.
        * - Les boutons ont été faites par moi sur Adobe Photoshop
        * - La texture de bois: https://www.pinterest.ca/pin/401242648032127583/
        * - Barre de chargement: https://www.iconexperience.com/g_collection/icons/?icon=progress_bar
        * - Fond intro et fin: https://www.vectorstock.com/royalty-free-vector/cafe-shop-exterior-street-restraunt-building-vector-16477564
        * - Les sons gratuits: https://www.zapsplat.com/
        *=================================================
        *=================================================
        */
        
        
        init: function () {
			//Changer la couleur de l'écran du jeu
			leJeu.stage.backgroundColor = 0x400A14;
		},

		preload: function () {
			//Charger les images du jeu
			//Chemin commun à toutes les feuilesde sprite
			leJeu.load.path = "medias/img/";
            
            //Chargement des images pour les écrans d'intro, de fin du jeu et des boutons
            leJeu.load.image("introImg", "fondIntro.png", 640, 960);
            leJeu.load.image("finImg", "fondFin.png", 640, 960);
            leJeu.load.spritesheet("jouerBtn", "boutonJouer.png", 250, 100);
            leJeu.load.spritesheet("rejouerBtn", "boutonRejouer.png", 250, 100);
            leJeu.load.spritesheet("retourBtn", "boutonRetour.png", 250, 100);
            
            //Chargement de la feuille de sprite des éléments du jeu
            leJeu.load.spritesheet("imagesJeu", "sprites.png", TAILLE_IMAGE, TAILLE_IMAGE);
            
            //Chargement des sons du jeu
            //Chemin commun à tous les sons
			leJeu.load.path = "medias/sons/";
            leJeu.load.audio("sonBouton", ["button_sound.mp3", "button_sound.ogg"]);
            leJeu.load.audio("sonErreur", ["error_sound.mp3", "error_sound.ogg"]);
            leJeu.load.audio("sonFin", ["game_over_sound.mp3", "game_over_sound.ogg"]);
            leJeu.load.audio("sonIntro", ["intro_sound.mp3", "intro_sound.ogg"]);
            
            //Afficher les barres pour illustrer l'avancement du chargement
			//Afficher et centrer l'image du fond...
            var fondBarreChargement = leJeu.add.image(leJeu.width / 2, leJeu.height / 2, "barreChargementVide");
			fondBarreChargement.anchor.set(0.5);
			
			//Afficher la barre de chargement comme telle...
			var barreChargement = leJeu.add.sprite(0, 0, "barreChargement");
			barreChargement.anchor.set(0.5);
			
            barreChargement.centerX = leJeu.width / 2;
            barreChargement.centerY = leJeu.height / 2;
            
            leJeu.load.setPreloadSprite(barreChargement);
            
		},

		create: function () {
			//Aller à l'écran du jeu
			leJeu.state.start("IntroJeu");
		}
	}; //Fin ChargementMedias.prototype
    
    
    ////////////////////////////////
    //          IntroJeu          //
    ////////////////////////////////
    
    /**
	 * Fonction constructeur (classe) permettant de définir l'écran (state)
	 * pour la scène du jeu
	 */
	var IntroJeu = function () {};

	IntroJeu.prototype = {
        
        /*===============================================
        *===================INSTRUCTIONS=================
        *================================================
        * - Le but est de récolter le plus de points.
        * - L'utilisateur disposera de 10 secondes pour l'ensemble du jeu.
        * - Le joueur devra cliquer sur les casses hamburgers pour avoir un point.
        * - S'il clique sur les poissons morts, le jeu se terminera.
        * - Cependant, pour rallonger le durée du jeu, il sera posible d'avoir
        *   une seconde de plus à chaque 2 points récoltés(score).
        * - Pour arriver à avoir le plus de point, la clef de la reussite est 
        *   de garder un rythme constant dans ses cliques toute en évitant les mauvaises casses.
        *=================================================
        *=================================================
        */
        
		create: function () {
			//Afficher l'image d'introduction du jeu
            leJeu.add.image(0,0, "introImg");
            
            //Jouer le son d'introduction du jeu
            leJeu.add.audio("sonIntro",1).play();
            
            //Créer le texte pour le titre du jeu et son style
            var titreTxt = leJeu.add.text(leJeu.width/2, leJeu.width/16, "Ô Restaurant!", {
                font: "72px Chicle",
                fill: "black",
                align: "center"
            });
            titreTxt.anchor.set(0.5, 0);
            
            //Créer le bouton pour jouer au jeu
            var boutonJouer = leJeu.add.button(leJeu.width/2, leJeu.height/1.23, "jouerBtn",this.debuterJeu, this,1,0,2,0);
            boutonJouer.anchor.set(0.5);
            
            //Créer le texte pour l'intruction bref
            var instructionTxt = leJeu.add.text(leJeu.width / 2, leJeu.height / 0.98, "Ramassez le plus de points en un temps limite! \n" + "Gardez un rythme constant!", {
                font: "24px Chicle",
                fill: "orange",
                align: "center"
            });
            instructionTxt.anchor.set(0.5, 2);
            
            //Créer les animations pour le titre du jeu et le bouton de jeu
            leJeu.add.tween(titreTxt).from({y:0}, 2000, Phaser.Easing.Elastic.Out, true);
            leJeu.add.tween(boutonJouer.scale).to({x:1.2,y:1.2}, 1000, Phaser.Easing.Elastic.Out, true);
		},
        
		debuterJeu: function (target) {
            //Faire jouer le son du bouton
            leJeu.add.audio("sonBouton", 1).play();
            //Commencer le jeu
			leJeu.state.start("Jeu");
		}

	} //Fin IntroJeu.prototype
    
    
    ////////////////////////////////
    //             JEU            //
    ////////////////////////////////
    
    /**
	 * Fonction constructeur (classe) permettant de définir l'écran (state)
	 * pour la scène d'intro du jeu
	 */
	var Jeu = function () {
        this.tempsRestant; // Temps restant pour le jeu
        this.tempsTxt; // Objet de type text pour afficher le temps restant
        this.scoreTxt; // Objet de type text pour afficher le score au fur et à mesure
    };

	Jeu.prototype = {
        
        init:function(){
            //Initialiser le score
            score = 0;
            //Initialiser le temps restant
			this.tempsRestant = TEMPS_JEU;
        }, 
        
        create: function(){ 
            //Créer le style pour le state de jeu
            var leStyle = {
				font: "bold 48px Chicle",
				fill: "white"
			};
            
            //Initialiser et afficher le score
            this.scoreTxt= leJeu.add.text(0,leJeu.height, "SCORE: " + score, leStyle);
            this.scoreTxt.anchor.set(-0.5,1.5);
            leJeu.add.tween(this.scoreTxt.scale).to({x:1.2,y:1.2}, 1000, Phaser.Easing.Elastic.Out, true);
            
            //Initialiser et afficher le temps
            this.tempsTxt= leJeu.add.text(leJeu.width,leJeu.height, "TEMPS: " + this.tempsRestant, leStyle);
            this.tempsTxt.anchor.set(1.5,1.5);
            leJeu.add.tween(this.tempsTxt.scale).to({x:1.2,y:1.2}, 1000, Phaser.Easing.Elastic.Out, true);
            
            //Initialiser et afficher le texte plus une seconde
            this.plusUnPointTxt= leJeu.add.text(leJeu.width,leJeu.height, "+1", leStyle);
            this.plusUnPointTxt.anchor.set(2,2.5);

            //Placer les Sprites
            this.placerSprites();
            
            //Partir la minuterie pour le temps du jeu
            leJeu.time.events.loop(Phaser.Timer.SECOND, this.diminuerTemps, this);
            
        }, // Fin create
        
        placerSprites: function(){
            this.tableauImage = [];     //Créer le tableau pour les images
            this.tableauPoisson = [];   //Créer le tableau pour les iamges de poisson
            //Boucle qui permet de remplir les tabelaux
            for(var i = 0; i < NB_IMAGES; i++) {
                this.tableauImage.push(0);
                this.tableauPoisson.push(i);
            }
            
            //Mélanger le tableau des index des images avec Phaser...
            var indexPoisson; 
            for (var i = 0; i < NB_POISSON; i++){
                indexPoisson = Phaser.ArrayUtils.removeRandomItem(this.tableauPoisson);
                this.tableauImage[indexPoisson] = 1;
            }
            //console.log(tableauImage);
            
            //Instancier les casses   
            var uneImage, posX, posY;
            for(var i = 0; i < NB_IMAGES; i++){
                posX =  (i % NB_COLONNES) * TAILLE_IMAGE;
                posY =  Math.floor(i / NB_COLONNES) * TAILLE_IMAGE;
                
                //Créer le bouton
                uneImage = leJeu.add.button( posX, posY , "imagesJeu", this.cliquerCasse, this);
                
                //Si une image est égale à 0, c'est un hamburger et sinon c'est un poisson
                if(this.tableauImage[i] === 0){
                    uneImage.frame=0;  
                } else {
                    uneImage.frame=1;
                }
                //uneImage.noImage = this.tableauImage[i];
                //uneImage.frame = uneImage.indexPoisson;
            }
        },
        
        /**
         * Fonction qui remelanger les casses et les reaffiches 
         * quand on appuie sur un hamburger
         * @param leHamburger pour cibler le hamburger appuie par l'utilisateur
         */
        cliquerCasse: function (leHamburger){
            //Appel de la fonction ajoutTemps
            this.ajoutTemps();
            
            //Si la casse appuyer est une casse de la frame 0 (hamburger) ...
            if(leHamburger.frame === 0){
                //Créer l'animation d'appararition rapide des casses de hamburger
                var animBlocApparait = leJeu.add.tween(leHamburger).to({alpha: 1}, 100, Phaser.Easing.Linear.None, true);
                //Quand l'animation est terminé, on appelel la fonction de replacer les casses
                animBlocApparait.onComplete.add(this.placerSprites, this);
                
                //Incrémenter le score de 1
                score++;
                this.scoreTxt.text = "SCORE: " + score;
                
                //Faire jouer le son du bouton
                leJeu.add.audio("sonBouton", 1).play();

            } else {
				//C'est la fin du jeu...
				leJeu.state.start("FinJeu");
			}
            
        },

        /**
         * Fonction qui gère le tween de changement de couleur du texte 
         * plus une seconde dans le temps
         * @param cible pour cibler le hamburger appuie par l'utilisateur
         * @param couleurDebut pour donner la coouleur du texte au départ du tween
         * @param couleurDebut pour donner la coouleur du texte à la fin du tween
         * @param duree pour le tween
         * @param delai pour le tween
         */
        tweenTeintePlusUn(cible, couleurDebut, couleurFin, duree = 250, delai = 0) {
            //Vérifier si c'est un objet valide
            if (cible) {
                //Creer une varable d'objet step
                var couleurRemplissage = { step: 0 };
                
                //creer un tween qui increment le step de 0 a 100
                var animCouleur = this.game.add.tween(couleurRemplissage).to({ step: 1000 }, duree, Phaser.Easing.Linear.None, delai);

                //ajouter une function de Phaser qui change la teinte, Phaser.Colour.interpolateColor
                animCouleur.onUpdateCallback(() => {
                    cible.tint = Phaser.Color.interpolateColor(couleurDebut, couleurFin, 1000, couleurRemplissage.step);
                });

                //Appeler la fonction animCouleur
                animCouleur.start();
            }
        },
        
        ajoutTemps:function(){
            //Si le score modulo de 2 donne 1(pair), on augment le temps d'une seconde
            if(score%2 === 1){
                this.tempsRestant+=1;
                this.tempsTxt.text = "TEMPS: " + this.tempsRestant;
                
                //Faire animer le scale du texte plus une seconde
                leJeu.add.tween(this.plusUnPointTxt.scale).from({x:1.5, y:1.5}, 1000, Phaser.Easing.Elastic.Out, true);
                
                //Appel la fonction tweenTeintePlusUn avec les paramètres demandés
                this.tweenTeintePlusUn(this.plusUnPointTxt, 0xffffff, 0x00FF00, 1000, 0);
            }       
        },
        
        diminuerTemps:function(){
            //Diminuer le temps à chaque seconde
            this.tempsRestant --;
            this.tempsTxt.text = "TEMPS: " + this.tempsRestant;

            //Si toutes les secondes sont écoulées, c'est la fin du jeu
            if(this.tempsRestant == 0){
                leJeu.state.start("FinJeu");
            }
        }
        
        
        //==================================================
        //======  TEST DE REPLACER UNE CASSE À LA FOIS  ====
        //==================================================
        
        /*replacerHamburger: function(leHamburger){
            //leHamburger.destroy();
            //leHamburger.frame=1;
            
            this.tableauImageApresClique = [];
            this.tableuPoissonApresClique = [];
            
            for(var i = 0; i < NB_IMAGES_APRES_CLIQUE; i++){
                this.tableauImageApresClique.push(1);
                this.tableuPoissonApresClique.push(i);
            }
            
            this.tableauImageApresClique.push(leHamburger);
            //leHamburger.frame=1;
            
            var indexPoissonApresClique; 
            for (var i = 0; i < NB_POISSON; i++){
                indexPoissonApresClique = Phaser.ArrayUtils.removeRandomItem(this.tableuPoissonApresClique);
                this.tableauImageApresClique[indexPoissonApresClique] = 0;
            }
            
            var uneImageApresClique, ApresCliquePosX, ApresCliquePosY;
            for(var i = 0; i < NB_IMAGES; i++){
                ApresCliquePosX =  (i % NB_COLONNES) * TAILLE_IMAGE;
                ApresCliquePosY =  Math.floor(i / NB_COLONNES) * TAILLE_IMAGE;
                
                uneImageApresClique = leJeu.add.button( ApresCliquePosX, ApresCliquePosY , "imagesJeu");
                
                if(this.uneImageApresClique[i] === 0){
                    uneImageApresClique.frame=0;  
                } else {
                    uneImageApresClique.frame=1;
                }
            }
            
            if(this.tableauImages[0] === 1){
                var rand = this.tableauImages[Math.floor(Math.random() * this.tableauImages.length)]
                console.log("allo");
            }   
        },*/

	} //Fin IntroJeu.prototype
    
    
    ////////////////////////////////
    //          FinJeu          //
    ////////////////////////////////
    
    /**
	 * Fonction constructeur (classe) permettant de définir l'écran (state)
	 * pour la scène de fin du jeu
	 */
	var FinJeu = function () {};

	FinJeu.prototype = {

		create: function () {
			//Image de fin de jeu
            leJeu.add.image(0,0, "finImg");
            
            //Faire jouer le son de la fin du jeu
            leJeu.add.audio("sonFin", 1).play();
            
            //Le style pour le state de fin de jeu
			var style = {
				font: "bold 48px Chicle",
				fill: "#fff",
				align: "center"
			};
            
            //Texte pour dire la fin du jeu
            var finTxt = leJeu.add.text(leJeu.width / 2, leJeu.width / 2.5, "C'est fini!", style);
            finTxt.anchor.set(0.5, 0);
            
            
            //Vérification et enregistrement du meilleur score
			meilleurScore = Math.max(score, meilleurScore);
			localStorage.setItem(NOM_LOCAL_STORAGE, meilleurScore);

            //Variable contenant le texte
			var leScore = "Votre score:\n";
			leScore += score + " points \n\n";
			leScore += "Meilleur score:\n";
			leScore += meilleurScore + " points";

            // Le texte pour afficher les scores
			var finJeuTxt = leJeu.add.text(leJeu.width / 2, leJeu.height / 2, leScore, style);
			finJeuTxt.anchor.set(0.5);
            
            //Créer un bouton de rejouer
            var boutonRejouer= leJeu.add.button(leJeu.width/2, leJeu.height/ 1.2, "rejouerBtn",this.rejouer, this,1,0,2,0);
            boutonRejouer.anchor.set(0.5);
            
            //Créer un bouton pour retourner à l'intro du jeu
            var boutonRetourIntroJeu= leJeu.add.button(leJeu.width/2, leJeu.height/ 1.1, "retourBtn",this.retourIntroJeu, this,1,0,2,0);
            boutonRetourIntroJeu.anchor.set(0.5);
            
            //Animation du bouton - Il tourne sur 360 degrés
			leJeu.add.tween(boutonRejouer).to({angle:360}, 1000, Phaser.Easing.Elastic.Out, true);
            
            //Animation du bouton - Il tourne sur -360 degrés
            leJeu.add.tween(boutonRetourIntroJeu).to({angle:-360}, 1000, Phaser.Easing.Elastic.Out, true);
		},

		rejouer: function(){
            //Faire jouer le son du bouton
            leJeu.add.audio("sonBouton", 1).play();
            //Aller à l'écran de jeu en cliquant dans l'écran
            leJeu.state.start("Jeu");      
        },
        
        retourIntroJeu: function(){
            //Faire jouer le son du bouton
            leJeu.add.audio("sonBouton", 1).play();
            //Aller à l'écran de jeu en cliquant dans l'écran
            leJeu.state.start("IntroJeu");      
        }

	} //Fin IntroJeu.prototype
    
})();// Fin IIFE