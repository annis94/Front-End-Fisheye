function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");

    // Masquer le reste de la page pour les lecteurs d'écran
    const mainContent = document.querySelector('main');
    mainContent.setAttribute("aria-hidden", "true");

    trapFocus(modal);
    const firstInput = modal.querySelector('input');
    firstInput.focus();
}

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    // Réafficher le reste de la page pour les lecteurs d'écran
    const mainContent = document.querySelector('main');
    mainContent.setAttribute("aria-hidden", "false");

    const openButton = document.querySelector('.contact_button--modal');
    openButton.focus();
}


// Fonction pour piéger le focus dans la modale
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll('input, textarea, button, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            // Si Maj + Tab (Tab arrière)
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus(); // Déplace le focus sur le dernier élément
                }
            } else {
                // Tab normal
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus(); // Déplace le focus sur le premier élément
                }
            }
        }
    });
}


function validateForm(event) {
    event.preventDefault(); // Empêche l'envoi du formulaire pour vérifier les données

    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validation des champs
    let isValid = true;
    let errorMessage = "";

    if (prenom === "") {
        isValid = false;
        errorMessage += "Le prénom est obligatoire.\n";
    }

    if (nom === "") {
        isValid = false;
        errorMessage += "Le nom est obligatoire.\n";
    }

    if (email === "") {
        isValid = false;
        errorMessage += "L'email est obligatoire.\n";
    } else if (!validateEmail(email)) {
        isValid = false;
        errorMessage += "L'email n'est pas valide.\n";
    }

    if (message === "") {
        isValid = false;
        errorMessage += "Le message est obligatoire.\n";
    }

    if (isValid) {
        console.log("Formulaire soumis avec succès !");
        console.log({
            prenom,
            nom,
            email,
            message
        });
        closeModal();
    } else {
        alert(errorMessage); // Affiche les erreurs de validation
    }
}

// Fonction pour valider l'email avec une expression régulière
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
