// Fonction qui génère un modèle de carte pour afficher un photographe
function photographerTemplate(data) {
        // Déstruction infos du photographe
        const { id, name, portrait, city, country, tagline, price } = data;

        const picture = `../../assets/images/photographer/${portrait}`;
    
    // Fonction pour créer la structure DOM de la carte du photographe
    function getUserCardDOM() {
        const article = document.createElement( 'article' );
       
                // Creation de lien unique pour chaque photographe en utilisant son ID
                const link = document.createElement('a');
                link.setAttribute('href', `photographer.html?id=${id}`);
                link.setAttribute('aria-label', `Voir la page de ${name}`);

                const img = document.createElement('img');
                img.setAttribute('src', picture);
                img.setAttribute('alt', `Portrait de ${name}`);

                const h2 = document.createElement('h2');
                h2.textContent = name;

                //ajout de l'image et le nom dans le lien
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


