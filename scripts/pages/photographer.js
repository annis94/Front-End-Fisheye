let media = []; // Variable globale pour stocker les médias
// Récupération de l'ID du photographe depuis l'URL
const photographerId = new URLSearchParams(window.location.search).get('id');




// Récupère les données du photographe et les médias depuis le JSON
async function getPhotographerData(id) {
    try {
        // Récupération des données depuis le fichier JSON en utilisant fetch 
        const response = await fetch('../../data/photographers.json');
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();

        // Trouve le photographe correspondant à l'ID
        const photographer = data.photographers.find(p => p.id == id);
        if (photographer) {
            displayPhotographerInfo(photographer);
        } else {
            throw new Error("Photographe non trouvé");
        }

        // Filtre les médias pour ce photographe
        media = data.media.filter(item => item.photographerId == id);
        if (media.length > 0) {
            displayPhotographerMedia(media);
        } else {
            throw new Error("Aucun média trouvé pour ce photographe");
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);

        // Affiche un message d'erreur à l'utilisateur
        displayErrorMessage("Une erreur est survenue lors du chargement des données du photographe. Veuillez réessayer plus tard.");
    }
}


//affichage d'un message d'erreur à l'utilisateur
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
}



// Affiche la galerie des médias du photographe
function displayPhotographerMedia(media) {
    const mediaSection = document.querySelector('.media-section');
    mediaSection.innerHTML = media.map(item => `
        <article class="media-item">
            ${item.image ? `<img src="../../assets/images/media/${item.photographerId}/${item.image}" alt="${item.title}" class="clickable">`
                         : `<video controls><source src="assets/images/media/${item.video}" type="video/mp4"></video>`}
            <div class="media-info-container">
                <h3>${item.title}</h3>
                <div class="likes-container">
                    <p class="likes-count">${item.likes}</p>
                    <span class="like-icon"><i class="fas fa-heart"></i></span>
                </div>
            </div>
        </article>
    `).join('');



    // Gestion des likes
    document.querySelectorAll('.like-icon').forEach((icon, index) => {
        icon.addEventListener('click', () => {
            const likeCount = media[index].likes++;
            icon.previousElementSibling.textContent = likeCount;
        });
    });
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

    dropdownSelected.addEventListener('click', () => {
        dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            sortMedia(this.getAttribute('data-value'));
            dropdownSelected.innerHTML = `${this.textContent} <span class="arrow">▼</span>`;
            dropdownOptions.style.display = 'none';
        });
    });
});



// gestion de l'ouverture de la lightbox
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index; 
    const { image, video, photographerId, title } = media[currentIndex];
    const content = image ? `<img src="../../assets/images/media/${photographerId}/${image}" alt="${title}">` 
                          : `<video controls><source src="assets/images/media/${video}" type="video/mp4"></video>`;
    document.querySelector('.lightbox-content').innerHTML = content; 
    document.getElementById('lightbox').style.display = 'flex'; 
}

// gestion de la fermeture de la lightbox
function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none'; 
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
    document.querySelectorAll('.clickable').forEach((el, index) => 
        el.addEventListener('click', () => openLightbox(index)) 
    );
}

// Affiche la galerie des médias et ajoute les événements pour la lightbox
function displayPhotographerMedia(media) {
    const mediaSection = document.querySelector('.media-section');
    mediaSection.innerHTML = media.map(item => `
        <article class="media-item">
            ${item.image 
                ? `<img src="../../assets/images/media/${item.photographerId}/${item.image}" alt="${item.title}" class="clickable">`
                : `<video controls><source src="../../assets/images/media/${item.photographerId}/${item.video}" type="video/mp4">
                   Votre navigateur ne supporte pas les vidéos HTML5.</video>`}
            <div class="media-info-container">
                <h3>${item.title}</h3>
                <div class="likes-container">
                    <p class="likes-count">${item.likes}</p>
                    <span class="like-icon"><i class="fas fa-heart"></i></span>
                </div>
            </div>
        </article>
    `).join('');

    addLightboxEvents(); // Ajoute les événements pour la lightbox
}

