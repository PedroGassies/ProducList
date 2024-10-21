    /********** AFFICHAGE DES DONNEES DEPUIS FICHIER JSON ****************/

async function generate(){
    // Récupération des plats depuis le fichier JSON
    const reponse = await fetch("data.json");
    const plats = await reponse.json();
    return plats; 
}


async function affichage() {
    // Initialiser totalItems ici pour chaque affichage
    const plats = await generate();
    const sectionCarte = document.querySelector(".carte");
    
    for (let i = 0; i < plats.length; i++) {
        const article = plats[i];
        const boxElement = document.createElement("div");
        const imgBtnContainer = document.createElement("div"); // Nouvelle div pour l'image et le bouton
        const btnElement = document.createElement("div");
        btnElement.classList.add("btnDiv"); // Garde ta div btnDiv pour le style

        const imageElement = document.createElement("img");
        if (window.innerWidth < 768) {
            imageElement.src = article.image.mobile; // Image mobile pour petits écrans
        } else if (window.innerWidth <1024){
            imageElement.src=article.image.tablet;
        } else {
            imageElement.src = article.image.desktop; // Image desktop pour grands écrans
        }
        imageElement.classList.add("plat-image");

        const boutonElement = document.createElement("button");
        boutonElement.classList.add("btn-commande");

        const iconElement = document.createElement("img");
        iconElement.src = "./assets/images/icon-add-to-cart.svg";
        const textButton = document.createTextNode("Add to Cart");
        
        const texteElement = document.createElement("div");
        texteElement.classList.add("text");
        const categorieElement = document.createElement("p");
        categorieElement.classList.add("category");
        categorieElement.innerText = article.category;
        const nomElement = document.createElement("p");
        nomElement.classList.add("name");
        nomElement.innerText = article.name;
        const prixElement = document.createElement("p");
        prixElement.classList.add("price");
        prixElement.innerText = `$${article.price.toFixed(2)}`;

        // Construction de la structure
        sectionCarte.appendChild(boxElement);
        boxElement.appendChild(imgBtnContainer); // Ajouter le conteneur image + bouton
        imgBtnContainer.appendChild(imageElement);
        imgBtnContainer.appendChild(btnElement); // Utilise btnDiv ici
        btnElement.appendChild(boutonElement);
        boxElement.appendChild(texteElement);
        boutonElement.appendChild(iconElement);
        boutonElement.appendChild(textButton);
        texteElement.appendChild(categorieElement);
        texteElement.appendChild(nomElement);
        texteElement.appendChild(prixElement);

    }

    addToCart();
}


/*** MISE A JOUR DU NOMBRE D ELEMENTS DANS LE PANIER ***/
let totalItems = 0;

function updateCartCount() {
    const cartCountElement = document.querySelector(".panier h2");
    cartCountElement.innerText = `Your Cart (${totalItems})`;

    const emptyCartMessage = document.querySelector(".empty-cart-message");
    const emptyCartImage = document.querySelector(".empty-cart-image");
    const carbonNeutralMessage = document.querySelector(".carbon-neutral-message");

    if (totalItems > 0) {
        emptyCartMessage.style.display = "none";
        emptyCartImage.style.display = "none";
        carbonNeutralMessage.style.display = "flex";
        createConfirmOrderButton();
    } else {
        emptyCartMessage.style.display = "block";
        emptyCartImage.style.display = "block";
        carbonNeutralMessage.style.display = "none";
        removeConfirmOrderButton();
    }
}

// Fonction pour créer dynamiquement le bouton "Confirm Order"
function createConfirmOrderButton() {
    if (!document.getElementById("confirm-order")) {
        const confirmOrderBtn = document.createElement("button");
        confirmOrderBtn.id = "confirm-order";
        confirmOrderBtn.textContent = "Confirm Order";
        document.querySelector(".panier").appendChild(confirmOrderBtn); // Ajoute le bouton au panier
    }
}

// Fonction pour retirer dynamiquement le bouton "Confirm Order"
function removeConfirmOrderButton() {
    const confirmOrderBtn = document.getElementById("confirm-order");
    if (confirmOrderBtn) {
        confirmOrderBtn.remove();
    }
}

function addToCart() {
    document.querySelectorAll(".btn-commande").forEach(button => {
        button.addEventListener("click", function() {
            // Si l'article n'a pas encore été ajouté au panier
            if (!button.classList.contains("btn-commande-active")) {
                let quantity = 1;
                totalItems += quantity; // Seulement incrémenter lors du premier clic
                updateCartCount();

                const imgBtnContainer = this.closest(".btnDiv").parentElement;
                const imageElement = imgBtnContainer.querySelector(".plat-image");
                if (imageElement) {
                    imageElement.classList.add("border-active");
                }

                const initialButtonHTML = this.innerHTML;

                // Ajouter la classe active pour signaler que l'élément est dans le panier
                this.classList.remove("btn-commande");
                this.classList.add("btn-commande-active");

                // Remplacement du contenu avec les contrôles de quantité
                this.innerHTML = `
        <div class="quantity-controls">
            <button class="decrease">
                <img src="./assets/images/icon-decrement-quantity.svg" alt="Decrease quantity">
            </button>
            <span class="quantity">${quantity}</span>
            <button class="increase">
                <img src="./assets/images/icon-increment-quantity.svg" alt="Increase quantity">
            </button>
        </div>
    `;

                const decreaseBtn = this.querySelector(".decrease");
                const increaseBtn = this.querySelector(".increase");
                const quantityDisplay = this.querySelector(".quantity");

                // Gestion de l'augmentation
                increaseBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    quantity++;
                    totalItems++;
                    quantityDisplay.textContent = quantity;
                    updateCartCount();
                });

                // Gestion de la diminution
                decreaseBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (quantity > 1) {
                        quantity--;
                        totalItems--;
                        quantityDisplay.textContent = quantity;
                    } else {
                        // Si la quantité tombe à zéro, réinitialiser le bouton et la quantité
                        totalItems--;
                        updateCartCount();

                        // Rétablir le bouton initial avec le texte et le SVG "Add to Cart"
                        button.innerHTML = initialButtonHTML;
                        button.classList.remove("btn-commande-active");
                        button.classList.add("btn-commande");

                        if (imageElement) {
                            imageElement.classList.remove("border-active");
                        }
                    }
                    updateCartCount();
                });
            }
        });
    });
}



affichage();