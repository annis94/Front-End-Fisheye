async function getPhotographers() {
    try {
        //  récupération des données depuis le fichier JSON en Utilisant fetch 
        const response = await fetch('../../data/photographers.json'); 
        const data = await response.json();

        console.log(data.photographers);
        // Retourne uniquement les données des photographes
        return { photographers: data.photographers };
    } catch (error) {
        console.error('Erreur lors de la récupération des photographes :', error);
        return { photographers: [] };
    }
}


    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        // Récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }
    
    init();
    

    