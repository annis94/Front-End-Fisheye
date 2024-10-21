let media = []; // Variable globale pour stocker les médias
// Récupération de l'ID du photographe depuis l'URL
const photographerId = new URLSearchParams(window.location.search).get('id');




// Récupère les données du photographe et les médias depuis le JSON
async function getPhotographerData(id) {
    try {
        // Récupération des données depuis le fichier JSON en utilisant fetch 
        const response = await fetch('../../data/photographers.json');
        
        if (!response.ok) {
            throw new Error(`Erreur réseau : Impossible de se connecter (${response.status})`);
        }

        // Tentative de parsing des données JSON
        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            throw new Error("Erreur de données : Les données sont mal formatées.");
        }

        // Trouve le photographe correspondant à l'ID
        const photographer = data.photographers.find(p => p.id == id);
        if (!photographer) {
            throw new Error("Photographe non trouvé. Veuillez vérifier l'ID.");
        }

        // Filtre les médias pour ce photographe
        media = data.media.filter(item => item.photographerId == id);
        if (media.length === 0) {
            throw new Error("Aucun média trouvé pour ce photographe.");
        }

        // Affiche les informations du photographe et ses médias
        displayPhotographerInfo(photographer);
        displayPhotographerMedia(media);

    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error.message);
        displayErrorMessage(error.message);
    }
}

// Affiche un message d'erreur à l'utilisateur avec des messages plus spécifiques
function displayErrorMessage(message) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('error-message');
    errorContainer.textContent = message;

    // Ajouter le message d'erreur dans la page (par exemple, dans la section principale)
    const main = document.querySelector('main');
    main.innerHTML = ''; // Supprime le contenu existant
    main.appendChild(errorContainer);
}





// Affiche les informations du photographe
function displayPhotographerInfo(photographer) {
    document.querySelector('#photograph-info').innerHTML = `
        <h1>${photographer.name}</h1>
        <p class="photographer-location">${photographer.city}, ${photographer.country}</p>
        <p class="photographer-tagline">${photographer.tagline}</p>
    `;
    document.querySelector('#photo-profil').innerHTML = `
        <img src="../../assets/images/photographer/${photographer.portrait}" alt="Portrait de ${photographer.name}" class="photographer-image">
    `;

    // Mettre à jour le titre de la modale avec le nom du photographe
    document.querySelector('#modal-photographer-name').textContent = `Contactez-moi ${photographer.name} !`;
}






// Gestion des likes pour chaque média
function displayPhotographerMedia(media) {
    const mediaSection = document.querySelector('.media-section');
    mediaSection.innerHTML = media.map((item, index) => `
        <article class="media-item">
            ${item.image ? `<img src="../../assets/images/media/${item.photographerId}/${item.image}" alt="${item.title}" class="clickable" tabindex="0" role="button">`
                         : `<video controls tabindex="0"><source src="../../assets/images/media/${item.photographerId}/${item.video}" type="video/mp4"></video>`}
            <div class="media-info-container">
                <h3>${item.title}</h3>
                <div class="likes-container">
                    <p class="likes-count">${item.likes}</p>
                    <span class="like-icon" tabindex="0"><i class="fas fa-heart"></i></span>
                </div>
            </div>
        </article>
    `).join('');

    // Gestion des likes
    document.querySelectorAll('.like-icon').forEach((icon, index) => {
        icon.addEventListener('click', () => {
            handleLike(icon, index);
        });

        // Pour la navigation clavier, l'utilisateur peut appuyer sur "Enter" pour liker
        icon.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleLike(icon, index);
            }
        });
    });

    // Mettre à jour les événements pour la lightbox également
    addLightboxEvents();
}

// Fonction de gestion du like pour éviter le multi-like
function handleLike(icon, index) {
    if (!media[index].hasLiked) {
        media[index].likes++; // Incrémenter les likes
        media[index].hasLiked = true; // Marquer comme liké
        updateLikeDisplay(icon, media[index].likes);
        updateTotalLikes(); // Mettre à jour le total des likes
    }
}

// Fonction pour mettre à jour l'affichage des likes
function updateLikeDisplay(icon, likes) {
    icon.previousElementSibling.textContent = likes;
}

// Fonction pour calculer et mettre à jour le total des likes
function updateTotalLikes() {
    const totalLikes = media.reduce((acc, item) => acc + item.likes, 0);
    document.getElementById('total-likes').textContent = totalLikes;
}

// Mettre à jour le tarif journalier à partir des données du photographe
function displayPhotographerInfo(photographer) {
    document.querySelector('#photograph-info').innerHTML = `
        <h1>${photographer.name}</h1>
        <p class="photographer-location">${photographer.city}, ${photographer.country}</p>
        <p class="photographer-tagline">${photographer.tagline}</p>
    `;
    document.querySelector('#photo-profil').innerHTML = `
        <img src="../../assets/images/photographer/${photographer.portrait}" alt="Portrait de ${photographer.name}" class="photographer-image">
    `;

    // Mettre à jour le titre de la modale avec le nom du photographe
    document.querySelector('#modal-photographer-name').textContent = `Contactez-moi ${photographer.name} !`;

    // Mettre à jour le tarif journalier
    const dailyRate = document.getElementById("daily-rate");
    dailyRate.textContent = `${photographer.price} €/jour`;

    // Appel de la fonction pour mettre à jour les likes totaux
    updateTotalLikes();
}







// Tri et mise à jour de l'affichage des médias
function sortMedia(criterion) {
    media.sort((a, b) => criterion === 'popularity' ? b.likes - a.likes :
                         criterion === 'date' ? new Date(b.date) - new Date(a.date) :
                         a.title.localeCompare(b.title));
    displayPhotographerMedia(media);
}

// Gestion du menu déroulant pour le tri des médias
document.addEventListener('DOMContentLoaded', () => {
    if (photographerId) getPhotographerData(photographerId);

    const dropdownSelected = document.querySelector('.dropdown-selected');
    const dropdownOptions = document.querySelector('.dropdown-options');
    const allOptions = Array.from(dropdownOptions.children);  // Stocker toutes les options initiales

    // Gérer l'affichage des options du tri
    dropdownSelected.addEventListener('click', () => {
        dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
    });

    // Fonction pour mettre à jour la liste des options après sélection
    function updateDropdown(selectedOption) {
        // Met à jour la sélection visible en haut
        dropdownSelected.innerHTML = `${selectedOption.textContent} <span class="arrow">▼</span>`;

        // Réinitialise les options en excluant celle sélectionnée
        dropdownOptions.innerHTML = ''; // Vide les options

        // Réorganise les options : ajoute celles qui ne sont pas sélectionnées
        allOptions.forEach(option => {
            if (option !== selectedOption) {
                dropdownOptions.appendChild(option);  // Ajoute seulement les options non sélectionnées
            }
        });

        dropdownOptions.style.display = 'none'; // Ferme les options après sélection

        // Réattache les événements après mise à jour du DOM
        attachDropdownEvents();
    }

    // Gére les événements de clic et de clavier sur chaque option
    function attachDropdownEvents() {
        document.querySelectorAll('.dropdown-item').forEach(item => {
            // Clic pour sélectionne l'option
            item.addEventListener('click', function() {
                sortMedia(this.getAttribute('data-value')); // Trie les médias
                updateDropdown(this); // Met à jour le menu après sélection
            });

            // Gére la touche "Enter" pour sélectionner avec le clavier
            item.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    sortMedia(this.getAttribute('data-value')); // Trie les médias
                    updateDropdown(this); // Met à jour le menu après sélection
                }
            });
        });
    }

    // Initialise le menu déroulant avec "Popularité" comme sélection par défaut
    const defaultOption = allOptions.find(option => option.getAttribute('data-value') === 'popularity');
    updateDropdown(defaultOption); // Appele updateDropdown pour mettre à jour dès le début

    // Attache les événements de sélection pour la première fois
    attachDropdownEvents();
});









// gestion de l'ouverture de la lightbox
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index; 
    const { image, video, photographerId, title } = media[currentIndex];
    const content = image ? `<img src="../../assets/images/media/${photographerId}/${image}" alt="${title}" tabindex="0">` 
                          : `<video controls tabindex="0"><source src="../../assets/images/media/${photographerId}/${video}" type="video/mp4"></video>`;
    const lightbox = document.getElementById('lightbox');
    document.querySelector('.lightbox-content').innerHTML = content;
    lightbox.style.display = 'flex'; 

    // Ajouter la gestion du focus et accessibilité
    trapFocus(lightbox);
    lightbox.setAttribute("aria-hidden", "false");

    // Déplacer le focus sur la lightbox
    const firstElement = lightbox.querySelector('button');
    firstElement.focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    lightbox.setAttribute("aria-hidden", "true");

    // Arrêter la lecture des vidéos si une vidéo est en cours de lecture
    const video = lightbox.querySelector('video');
    if (video) {
        video.pause();
    }

    // Renvoyer le focus à l'élément déclencheur (l'élément cliqué pour ouvrir la lightbox)
    const triggerElement = document.querySelector('.media-item .clickable');
    triggerElement.focus();
}

// Fonction pour piéger le focus dans la lightbox
function trapFocus(lightbox) {
    const focusableElements = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    lightbox.addEventListener('keydown', (event) => {
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
        } else if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            prevMedia();
        } else if (event.key === 'ArrowRight') {
            nextMedia();
        } else if (event.key === 'Enter' && document.activeElement.tagName === 'IMG') {
            openLightbox(currentIndex); // Si Enter est pressé sur une image, garde la lightbox ouverte
        }
    });
}

// gestion de la navigation vers le média précédent
function prevMedia() {
    openLightbox((currentIndex - 1 + media.length) % media.length); 
}

// gestion de la navigation vers le média suivant
function nextMedia() {
    openLightbox((currentIndex + 1) % media.length); 
}



// ajout des événements à chaque élément cliquable pour ouvrir la lightbox
function addLightboxEvents() {
    // Pour les éléments cliquables (images et vidéos)
    document.querySelectorAll('.clickable').forEach((el, index) => {
        // Ouvre la lightbox quand on clique avec la souris
        el.addEventListener('click', () => openLightbox(index));

        // Ouvre la lightbox quand on appuie sur "Enter" au clavier
        el.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                openLightbox(index);
            }
        });
    });
}

//gestion des touches clavier pour lightbox
document.addEventListener('keydown', (event) => {
    if (document.getElementById('lightbox').style.display === 'flex') {
        switch(event.key) {
            case 'Escape': 
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevMedia();
                break;
            case 'ArrowRight':
                nextMedia();
                break;
        }
    }
});



// Affiche la galerie des médias et ajoute les événements pour la lightbox
function displayPhotographerMedia(media) {
    const mediaSection = document.querySelector('.media-section');
    mediaSection.innerHTML = media.map(item => `
        <article class="media-item">
            ${item.image ? `<img src="../../assets/images/media/${item.photographerId}/${item.image}" alt="${item.title}" class="clickable" tabindex="0" role="button">`
                         : `<video controls tabindex="0"><source src="../../assets/images/media/${item.photographerId}/${item.video}" type="video/mp4"></video>`}
            <div class="media-info-container">
                <h3>${item.title}</h3>
                <div class="likes-container">
                    <p class="likes-count">${item.likes}</p>
                    <span class="like-icon" tabindex="0"><i class="fas fa-heart"></i></span>
                </div>
            </div>
        </article>
    `).join('');




    // Une fois les médias injectés, ca ajoute des événements sur les icônes de like
    document.querySelectorAll('.like-icon').forEach((icon, index) => {
        // Incrémente les "likes" avec un clic
        icon.addEventListener('click', () => {
            media[index].likes++; // Incrémenter le like
            icon.previousElementSibling.textContent = media[index].likes; // Mettre à jour l'affichage
            updateTotalLikes(); // Mettre à jour le total des likes
        });
        

        // ca ncrémente les "likes" avec la touche "Enter"
        icon.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const likeCount = media[index].likes++;
                icon.previousElementSibling.textContent = likeCount;
            }
        });
    });

    // Ajoute des événements pour la lightbox (si nécessaire)
    addLightboxEvents();
}




