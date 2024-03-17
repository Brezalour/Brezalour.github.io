document.addEventListener('click', function(event) {
    // Création de l'élément div pour représenter l'ondulation
    var ripple = document.createElement('div');
    
    // Ajout de la classe 'ripple' à l'élément div
    ripple.classList.add('ripple');
    
    // Positionnement de l'ondulation au clic de la souris
    ripple.style.top = event.clientY + 'px';
    ripple.style.left = event.clientX + 'px';
    
    // Ajout de l'ondulation à la page
    document.body.appendChild(ripple);
    
    // Suppression de l'ondulation après un court délai
    setTimeout(function() {
        ripple.remove();
    }, 1200); // Durée de l'ondulation en millisecondes
});

// Sélection de toutes les tuiles
const tiles = document.querySelectorAll('.tile');

// Ajout d'un gestionnaire d'événements de clic pour chaque tuile
tiles.forEach(tile => {
    tile.addEventListener('click', function() {
        // Ajout de la classe 'expanded' à la tuile cliquée
        this.classList.toggle('expanded');
        
        // Détection de clic en dehors de la tuile
        document.addEventListener('click', function(event) {
            if (!tile.contains(event.target)) {
                // Retrait de la classe 'expanded' de toutes les tuiles sauf celle cliquée
                tiles.forEach(otherTile => {
                    if (otherTile !== tile) {
                        otherTile.classList.remove('expanded');
                    }
                });
            }
        });
    });
});