// Classe de la Factory pour les médias
class MediaFactory {
    static createMedia(mediaData) {
        if (mediaData.type === "image") {
            return new ImageMedia(mediaData);
        } else if (mediaData.type === "video") {
            return new VideoMedia(mediaData);
        } else {
            throw new Error("Type de média inconnu");
        }
    }
}

// Classe pour les médias de type image
class ImageMedia {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.image = data.image; // chemin de l'image
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
    }

    getMediaDOM() {
        const article = document.createElement('article');
        const img = document.createElement('img');
        img.setAttribute('src', `../../assets/images/photographers/${this.image}`);
        img.setAttribute('alt', this.title);
        article.appendChild(img);
        return article;
    }
}

// Classe pour les médias de type vidéo
class VideoMedia {
    constructor(data) {
        this.id = data.id;
        this.photographerId = data.photographerId;
        this.title = data.title;
        this.video = data.video; // chemin de la vidéo
        this.likes = data.likes;
        this.date = data.date;
        this.price = data.price;
    }

    getMediaDOM() {
        const article = document.createElement('article');
        const video = document.createElement('video');
        video.setAttribute('controls', '');
        video.setAttribute('src', `../../assets/images/photographers/${this.video}`);
        video.setAttribute('alt', this.title);
        article.appendChild(video);
        return article;
    }
}

// Fonction qui génère un modèle de carte pour afficher un photographe
function photographerTemplate(data) {
    // Déstruction infos du photographe
    const { id, name, portrait, city, country, tagline, price } = data;
    const picture = `../../assets/images/photographer/${portrait}`;
    
    // Fonction pour créer la structure DOM de la carte du photographe
    function getUserCardDOM() {
        const article = document.createElement('article');
       
        // Création de lien unique pour chaque photographe en utilisant son ID
        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.setAttribute('aria-label', `Voir la page de ${name}`);
        link.setAttribute('role', 'link');

        const img = document.createElement('img');
        img.setAttribute('src', picture);
        img.setAttribute('alt', `Portrait de ${name}`);

        const h2 = document.createElement('h2');
        h2.textContent = name;

        // Ajout de l'image et le nom dans le lien
        link.appendChild(img);
        link.appendChild(h2);
        article.appendChild(link);
                
        // Ajout des autres informations comme la localisation le slogan et le tarif
        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        article.appendChild(location);

        const taglineElement = document.createElement('p');
        taglineElement.textContent = tagline;
        article.appendChild(taglineElement);

        const priceElement = document.createElement('p');
        priceElement.textContent = `${price}€/jour`;
        article.appendChild(priceElement);

        return article;
    }

    return { name, picture, getUserCardDOM };
}
