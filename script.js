async function generate(){
    // Récupération des plats depuis le fichier JSON
    const reponse = await fetch("data.json");
    const plats = await reponse.json();
    return plats; 
}



async function affichage() {
    const plats = await generate();
    const sectionCarte = document.querySelector(".carte");
    
    for(let i = 0; i < plats.length; i++){
        const article = plats[i];
        const boxElement = document.createElement("div");
        const imageElement = document.createElement("img");
        imageElement.src = article.image.desktop;
        const categorieElement=document.createElement("p");
        categorieElement.innerText = article.category;
        const nomElement= document.createElement("p");
        nomElement.innerText=article.name;
        const prixElement = document.createElement("p");
        prixElement.innerText = article.price;

        sectionCarte.appendChild(boxElement);
        boxElement.appendChild(imageElement);
        boxElement.appendChild(categorieElement);
        boxElement.appendChild(nomElement);
        boxElement.appendChild(prixElement);
    }
}

affichage();