// 1. Définir les variables globales
const words = ["EDOUARD"];
let chosenWord = "";
let displayedWord = [];
let errors = 0;
let usedLetters = new Set();
let maxErrors = 6; // Fixé à 6, plus de difficulté
const soundSuccess = new Audio("sounds/success.mp3");
const soundError = new Audio("sounds/error.mp3");
const soundWin = new Audio("sounds/win.mp3");
const soundLose = new Audio("sounds/lose.mp3");


function handleKeyPress(event) {
    let letter = event.key.toUpperCase(); // Convertir en majuscule

    if (/^[A-Z]$/.test(letter)) {
        checkLetter(letter); // Vérifier la lettre
    }
}

// 2. Fonction pour démarrer une nouvelle partie
function initGame() {
    console.clear();
    console.log("🔄 Nouvelle partie commencée !");

    // Choisir le mot unique
    chosenWord = words[0];
    console.log(`Mot choisi : ${chosenWord}`);

    if (!chosenWord || chosenWord.length === 0) {
        console.error("⚠️ Erreur : chosenWord est vide !");
        return;
    }

    displayedWord = Array(chosenWord.length).fill("_");
    console.log(`Mot masqué au début : ${displayedWord.join(" ")}`);

    document.getElementById("word-display").textContent = displayedWord.join(" ");
    document.getElementById("message").textContent = "";
    // maxErrors fixé à 6
    document.getElementById("error-counter").textContent = `Erreurs : 0 / ${maxErrors}`;
    document.getElementById("progress-bar").style.width = "0%";

    errors = 0;
    usedLetters.clear();
    console.log("🔄 Réinitialisation des lettres utilisées !");

    // Réinitialiser l'animation du mot après une victoire
    gsap.set("#word-display", { scale: 1, rotation: 0 });

    // Réinitialiser l'image à dévoiler
    const photo = document.getElementById("photo-reveal");
    if (photo) {
        photo.style.opacity = 1;
        photo.style.filter = "blur(20px)";
    }

    console.log("✅ Le jeu a bien été réinitialisé !");

    // 🔥 Réactiver l'écoute du clavier après une partie terminée
    document.addEventListener("keydown", handleKeyPress);
}

// 3. Écouter les entrées clavier
document.addEventListener("keydown", handleKeyPress);

// 4. Vérifier si la lettre est correcte ou non
function checkLetter(letter) {
    console.log(`Lettre pressée : ${letter}`);

    // 🔴 Vérifier si la partie est déjà perdue
    if (errors >= maxErrors) {
        console.log("🚫 Partie terminée ! Plus de lettres acceptées.");
        return;
    }

    // 🔴 Vérifier si la lettre a déjà été utilisée
    if (usedLetters.has(letter)) {
        console.log("⚠️ Lettre déjà utilisée !");
        document.getElementById("alert-message").textContent = `⚠️ La lettre "${letter}" a déjà été utilisée !`;
        return;
    }

    // 🔴 Ajouter la lettre à la liste des lettres utilisées
    usedLetters.add(letter);
    document.getElementById("alert-message").textContent = "";

    let found = false;
    let nbFoundThisTurn = 0;

    for (let i = 0; i < chosenWord.length; i++) {
        if (chosenWord[i] === letter) {
            displayedWord[i] = letter;
            found = true;
            nbFoundThisTurn++;
            document.getElementById("word-display").textContent = displayedWord.join(" ");
            gsap.fromTo(
                `#word-display`, 
                { scale: 0.8, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" }
            );
        }
    }

    document.getElementById("word-display").textContent = displayedWord.join(" ");

    // Dévoiler l'image progressivement selon le nombre de lettres trouvées (flou dynamique)
    if (found) {
        const totalFound = displayedWord.filter(l => l !== "_").length;
        const percent = totalFound / chosenWord.length;
        const photo = document.getElementById("photo-reveal");
        if (photo) {
            // Flou de 20px à 0px, mais reste à 4px tant qu'il manque au moins 1 lettre
            let blurValue = 20 - percent * 16; // de 20 à 4px
            if (totalFound < chosenWord.length) blurValue = Math.max(blurValue, 4);
            else blurValue = 0;
            photo.style.filter = `blur(${blurValue}px)`;
        }
    }

    if (!found) {
        errors++;
        console.log(`Erreur ${errors}/${maxErrors}`);

        if (errors <= maxErrors) {
            let bodyParts = document.querySelectorAll(".body-part");
            if (bodyParts[errors - 1]) {
                gsap.fromTo(bodyParts[errors - 1], { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "bounce.out" });
                bodyParts[errors - 1].style.display = "block";
            }
        }

        // 🔥 Secousse du pendu à chaque erreur
        gsap.fromTo(".pendu", { x: -5 }, { x: 5, duration: 0.1, repeat: 3, yoyo: true, ease: "power1.inOut" });

        document.getElementById("error-counter").textContent = `Erreurs : ${errors} / ${maxErrors}`;
        document.getElementById("progress-bar").style.width = `${(errors / maxErrors) * 100}%`;


        // 🔊 Joue le son d'erreur
          soundError.currentTime = 0;
          soundError.play();
    } else {
        // 🔊 Joue le son de succès
        soundSuccess.currentTime = 0;
        soundSuccess.play();
    }

    checkWinOrLose();
}

// 5. Vérifier si la partie est gagnée ou perdue
function checkWinOrLose() {
    console.log("🔍 Vérification de la victoire ou défaite...");

    if (!displayedWord || displayedWord.length === 0) {
        return;
    }

    console.log("Mot affiché actuel :", displayedWord.join(" "));

    if (!displayedWord.includes("_") && errors < maxErrors) {
    console.log("🎉 Victoire détectée !");
    document.getElementById("message").textContent = "🎉 Coucou c'est moi Édouard Joseph Charles HOUÉDÉ !!!";

    // 🔥 Zoom et rotation du mot en cas de victoire
    gsap.to("#word-display", { scale: 1.3, rotate: 5, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    gsap.to("#message", { scale: 1.2, duration: 0.5, ease: "bounce.out" });

    document.removeEventListener("keydown", handleKeyPress);

    // 🔊 Joue le son de victoire
      soundWin.currentTime = 0;
      soundWin.play();
} 

else if (errors === maxErrors) {
    console.log("😵 Défaite détectée !");
      document.getElementById("message").textContent = `😵 Tu as perdu ! Tu peux retenter ta chance !`;
      

    gsap.fromTo(
        ".pendu",
        { x: -5 },
        { x: 5, duration: 0.1, repeat: 5, yoyo: true, ease: "power1.inOut" }
    );

    document.removeEventListener("keydown", handleKeyPress);

    // 🔊 Joue le son de défaite
      soundLose.currentTime = 0;
      soundLose.play();
}

}

// 6. Gérer le bouton "Rejouer"
document.getElementById("restart").addEventListener("click", () => {
    console.log("🔄 Partie redémarrée !");
    
    chosenWord = "";
    displayedWord = [];
    errors = 0;
    
    initGame();
});

// 🎮 Génération du clavier virtuel
function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = ""; // 🔄 Vide le clavier pour recréer à chaque reset

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letters.forEach(letter => {
        const key = document.createElement("div");
        key.textContent = letter;
        key.classList.add("key");
        key.addEventListener("click", () => handleVirtualKeyPress(letter, key));
        keyboard.appendChild(key);
    });
}

// 🎮 Gérer le clic sur une touche du clavier virtuel
function handleVirtualKeyPress(letter, keyElement) {
    if (usedLetters.has(letter)) return; // Ignore si la lettre a déjà été jouée

    checkLetter(letter); // Vérifie la lettre

    // Désactive la lettre après utilisation
    keyElement.classList.add("disabled");
    keyElement.removeEventListener("click", () => handleVirtualKeyPress(letter, keyElement));
}

// 🔄 Appel de la fonction après chaque reset du jeu
document.getElementById("restart").addEventListener("click", () => {
    createKeyboard(); // Regénérer le clavier à chaque partie
});

// 🔄 Générer le clavier au chargement
createKeyboard();

// Appel initial
initGame();

