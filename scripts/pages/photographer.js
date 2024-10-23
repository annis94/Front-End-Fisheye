// ===== Initialisation et Variables Globales =====
let media = [];
const photographerId = new URLSearchParams(window.location.search).get('id');

// ===== Récupération et Affichage des Données =====
async function getPhotographerData(id) {
    try {
        const response = await fetch('../../data/photographers.json');
        if (!response.ok) throw new Error(`Erreur réseau : ${response.status}`);

        const data = await response.json();
        const photographer = data.photographers.find(p => p.id == id);
        if (!photographer) throw new Error("Photographe non trouvé.");

        media = data.media.filter(item => item.photographerId == id);
        if (media.length === 0) throw new Error("Aucun média trouvé.");

        displayPhotographerInfo(photographer);  // Affichage des infos du photographe
        displayPhotographerMedia(media);        // Affichage des médias du photographe
        updateTotalLikes();                     // Mise à jour des likes totaux
    } catch (error) {
        displayErrorMessage(error.message);     // Affichage d'un message d'erreur en cas de problème
    }
}

// ===== Affichage des Informations du Photographe =====
function displayPhotographerInfo({ name, city, country, tagline, portrait, price }) {
    document.querySelector('#photograph-info').innerHTML = `
        <h1>${name}</h1>
        <p class="photographer-location">${city}, ${country}</p>
        <p class="photographer-tagline">${tagline}</p>
    `;
    document.querySelector('#photo-profil').innerHTML = `
        <img src="../../assets/images/photographer/${portrait}" alt="Portrait de ${name}" class="photographer-image">
    `;
    document.querySelector('#modal-photographer-name').textContent = `Contactez-moi ${name} !`;
    document.getElementById("daily-rate").textContent = `${price} €/jour`;
}

// ===== Affichage des Médias du Photographe =====
function displayPhotographerMedia(media) {
    const mediaSection = document.querySelector('.media-section');
    mediaSection.innerHTML = media.map(({ image, video, photographerId, title, likes }, index) => `
        <article class="media-item">
            ${image ? `<img src="../../assets/images/media/${photographerId}/${image}" alt="${title}" class="clickable" tabindex="0" role="button">`
                    : `<video controls tabindex="0"><source src="../../assets/images/media/${photographerId}/${video}" type="video/mp4"></video>`}
            <div class="media-info-container">
                <h3>${title}</h3>
                <div class="likes-container">
                    <p class="likes-count">${likes}</p>
                    <span class="like-icon" tabindex="0"><i class="fas fa-heart"></i></span>
                </div>
            </div>
        </article>
    `).join('');

    // Ajout des événements pour gérer les likes et la lightbox
    document.querySelectorAll('.like-icon').forEach((icon, index) => {
        icon.addEventListener('click', () => handleLike(index, icon));       // Gestion des likes au clic
        icon.addEventListener('keydown', e => e.key === 'Enter' && handleLike(index, icon)); // Gestion des likes au clavier
    });

    addLightboxEvents();  // Ajout des événements pour la lightbox
}

// ===== Gestion des Likes =====
function handleLike(index, icon) {
    if (!media[index].hasLiked) {
        media[index].likes++;
        media[index].hasLiked = true;
        icon.previousElementSibling.textContent = media[index].likes;  // Mise à jour du compteur de likes
        updateTotalLikes();  // Mise à jour du total des likes
    }
}

// ===== Mise à Jour des Likes Totaux =====
function updateTotalLikes() {
    const totalLikes = media.reduce((acc, { likes }) => acc + likes, 0);
    document.getElementById('total-likes').textContent = totalLikes;  // Affichage des likes totaux
}

// ===== Gestion de la Lightbox =====
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    const { image, video, photographerId, title } = media[currentIndex];
    document.querySelector('.lightbox-content').innerHTML = image 
        ? `<img src="../../assets/images/media/${photographerId}/${image}" alt="${title}" tabindex="0">`
        : `<video controls tabindex="0"><source src="../../assets/images/media/${photographerId}/${video}" type="video/mp4"></video>`;
    document.getElementById('lightbox').style.display = 'flex';  // Affichage de la lightbox
    trapFocus(document.getElementById('lightbox'));  // Gestion du focus dans la lightbox
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';  // Fermeture de la lightbox
}

// ===== Ajout des Événements pour la Lightbox =====
function addLightboxEvents() {
    document.querySelectorAll('.clickable').forEach((el, index) => {
        el.addEventListener('click', () => openLightbox(index));  // Ouvrir la lightbox au clic
        el.addEventListener('keydown', e => e.key === 'Enter' && openLightbox(index));  // Ouvrir la lightbox au clavier
    });
    
    document.addEventListener('keydown', (event) => {
        if (document.getElementById('lightbox').style.display === 'flex') {
            switch(event.key) {
                case 'Escape': closeLightbox(); break;  // Fermeture de la lightbox avec la touche Échap
                case 'ArrowLeft': openLightbox((currentIndex - 1 + media.length) % media.length); break;  // Navigation à gauche
                case 'ArrowRight': openLightbox((currentIndex + 1) % media.length); break;  // Navigation à droite
            }
        }
    });
}

// ===== Gestion du Focus dans la Lightbox =====
function trapFocus(lightbox) {
    const focusableElements = lightbox.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    lightbox.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();  // Boucle vers le dernier élément si on est au premier avec Shift + Tab
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();  // Boucle vers le premier élément si on est au dernier avec Tab
            }
        }
    });
}

// ===== Gestion du Tri avec le Menu Déroulant =====
document.addEventListener('DOMContentLoaded', () => {
    if (photographerId) getPhotographerData(photographerId);  // Récupération des données du photographe

    const dropdownSelected = document.querySelector('.dropdown-selected');
    const dropdownOptions = document.querySelector('.dropdown-options');

    dropdownSelected.addEventListener('click', () => {
        dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';  // Affichage du menu déroulant
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            sortMedia(this.getAttribute('data-value'));  // Tri des médias selon le critère sélectionné
            updateDropdownSelection(this);  // Mise à jour de la sélection du tri
        });

        item.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                sortMedia(this.getAttribute('data-value'));  // Tri des médias avec la touche Entrée
                updateDropdownSelection(this);  // Mise à jour de la sélection du tri
            }
        });
    });

    // Initialisation par défaut avec la première option de tri
    const defaultOption = dropdownOptions.querySelector('[data-value="popularity"]');
    updateDropdownSelection(defaultOption);
});

// ===== Mise à Jour de la Sélection du Tri =====
function updateDropdownSelection(selectedOption) {
    const dropdownSelected = document.querySelector('.dropdown-selected');
    const dropdownOptions = document.querySelector('.dropdown-options');
    dropdownSelected.innerHTML = `${selectedOption.textContent} <span class="arrow">▼</span>`;
    dropdownOptions.style.display = 'none';  // Fermeture du menu après la sélection
}

// ===== Fonction de Tri des Médias =====
function sortMedia(criterion) {
    media.sort((a, b) => criterion === 'popularity' ? b.likes - a.likes :
                         criterion === 'date' ? new Date(b.date) - new Date(a.date) :
                         a.title.localeCompare(b.title));
    displayPhotographerMedia(media);  // Réaffichage des médias après tri
}

// ===== Affichage des Messages d'Erreur =====
function displayErrorMessage(message) {
    document.querySelector('main').innerHTML = `<div class="error-message">${message}</div>`;  // Affichage de l'erreur dans la page
}
