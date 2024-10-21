// Fonction pour récupérer les données des photographes
async function getPhotographers() {
    try {
        //  Récupération des données depuis le fichier JSON en utilisant fetch
        const response = await fetch('../../data/photographers.json'); 
        
        // Vérification si la requête a échoué
        if (!response.ok) {
            throw new Error(`Erreur réseau : Impossible de récupérer les données (${response.status})`);
        }

        // Tentative de parsing des données JSON
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            throw new Error("Erreur de données : Les données sont mal formatées.");
        }

        // Vérification de la structure des données
        if (!data.photographers || !Array.isArray(data.photographers)) {
            throw new Error("Erreur de données : Format inattendu des données reçues.");
        }

        console.log(data.photographers);
        // Retourne uniquement les données des photographes
        return { photographers: data.photographers };

    } catch (error) {
        console.error('Erreur lors de la récupération des photographes :', error.message);
        
        // Affiche un message d'erreur sur la page
        displayErrorMessage("Impossible de charger la liste des photographes. Veuillez réessayer plus tard.");
        
        // Retourne un tableau vide pour éviter des erreurs dans d'autres parties du code
        return { photographers: [] };
    }
}

// Fonction pour afficher les données des photographes
async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    if (!photographers || photographers.length === 0) {
        // Si aucun photographe n'est disponible, afficher un message informant l'utilisateur
        displayErrorMessage("Aucun photographe à afficher pour le moment.");
        return;
    }

    photographers.forEach((photographer) => {
        try {
            const photographerModel = photographerTemplate(photographer);

            // Vérification si le modèle est bien créé
            if (photographerModel) {
                const userCardDOM = photographerModel.getUserCardDOM();
                photographersSection.appendChild(userCardDOM);
            } else {
                throw new Error("Erreur lors de la création du modèle de photographe.");
            }

        } catch (error) {
            console.error("Erreur lors de l'affichage d'un photographe :", error.message);
            // Afficher un message générique pour l'utilisateur si un problème survient avec un photographe spécifique
            displayErrorMessage("Une erreur est survenue lors de l'affichage d'un photographe.");
        }
    });
}

// Fonction d'initialisation pour récupérer et afficher les données
async function init() {
    // Récupère les données des photographes
    const { photographers } = await getPhotographers();
    // Affiche les données des photographes
    displayData(photographers);
}

// Fonction pour afficher un message d'erreur à l'utilisateur
function displayErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    errorContainer.textContent = message;

    // Ajouter le message d'erreur dans la section principale
    const main = document.querySelector('main');
    main.innerHTML = ''; // Supprime le contenu existant
    main.appendChild(errorContainer);
}

// Appel de la fonction d'initialisation
init();
