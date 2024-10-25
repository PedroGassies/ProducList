/********** AFFICHAGE DES DONNEES DEPUIS FICHIER JSON ****************/

async function generate() {
    // Récupération des plats depuis le fichier JSON
    const reponse = await fetch("data.json");
    const plats = await reponse.json();
    return plats;
}

async function affichage() {
    const plats = await generate();
    const sectionCarte = document.querySelector(".carte");

    for (let i = 0; i < plats.length; i++) {
        const article = plats[i];
        const boxElement = document.createElement("div");
        const imgBtnContainer = document.createElement("div");
        const btnElement = document.createElement("div");
        btnElement.classList.add("btnDiv");

        const imageElement = document.createElement("img");
        if (window.innerWidth < 768) {
            imageElement.src = article.image.mobile;
        } else if (window.innerWidth < 1024) {
            imageElement.src = article.image.tablet;
        } else {
            imageElement.src = article.image.desktop;
        }
        imageElement.classList.add("plat-image");
        imageElement.setAttribute("data-name", article.name);

        const boutonElement = document.createElement("button");
        boutonElement.classList.add("btn-commande");
        boutonElement.setAttribute("data-name", article.name);

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
        boxElement.appendChild(imgBtnContainer);
        imgBtnContainer.appendChild(imageElement);
        imgBtnContainer.appendChild(btnElement);
        btnElement.appendChild(boutonElement);
        boxElement.appendChild(texteElement);
        boutonElement.appendChild(iconElement);
        boutonElement.appendChild(textButton);
        texteElement.appendChild(categorieElement);
        texteElement.appendChild(nomElement);
        texteElement.appendChild(prixElement);

        boutonElement.addEventListener("click", function () {
            addToCart(article.name, article.price, boutonElement, imageElement);
        });
    }
    updateCartCount();
}

/********** FONCTION POUR AJOUTER UN ARTICLE DANS LE PANIER **********/
function addToCart(itemName, itemPrice, button, imageElement) {
    if (!button.classList.contains("btn-commande-active")) {
        let quantity = 1;
        totalItems += quantity;
        updateCartCount();

        button.classList.add("btn-commande-active");
        imageElement.classList.add("border-active");

        button.innerHTML = `
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

        const decreaseBtn = button.querySelector(".decrease");
        const increaseBtn = button.querySelector(".increase");
        const quantityDisplay = button.querySelector(".quantity");

        // Gestion de l'augmentation de la quantité
        increaseBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            quantity++;
            totalItems++;
            quantityDisplay.textContent = quantity;
            updateCartItem(itemName, quantity, itemPrice);
            updateCartCount();
        });

        // Gestion de la diminution de la quantité
        decreaseBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (quantity > 1) {
                quantity--;
                totalItems--;
                quantityDisplay.textContent = quantity;
                updateCartItem(itemName, quantity, itemPrice);
            } else {
                totalItems--;
                button.innerHTML = `
                    <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
                    Add to Cart
                `;
                button.classList.remove("btn-commande-active");
                imageElement.classList.remove("border-active");
                removeItemFromCart(itemName);
            }
            updateCartCount();
        });

        // Ajouter l'article avec l'image au panier
        addItemToCart(itemName, itemPrice, quantity, imageElement.src);
        updateCartCount();
    }
}

/********** FONCTION POUR AJOUTER L'ARTICLE DANS LE PANIER **********/
function addItemToCart(name, price, quantity, thumbnail) {
    const articlesContainer = document.querySelector(".articles");

    // Vérifier si l'article existe déjà dans le panier
    const existingCartItem = document.querySelector(`.cart-item[data-name="${name}"]`);
    if (existingCartItem) {
        const quantityElement = existingCartItem.querySelector(".cart-item-quantity");
        const totalPriceElement = existingCartItem.querySelector(".cart-item-total-price");

        // Mettre à jour la quantité et le prix total
        const newQuantity = parseInt(quantityElement.textContent) + quantity;
        quantityElement.textContent = `${newQuantity}x`;
        totalPriceElement.textContent = `${(newQuantity * price).toFixed(2)}$`;
    } else {
        // Création d'un nouvel article dans le panier
        const articleElement = document.createElement("div");
        articleElement.classList.add("cart-item");
        articleElement.setAttribute("data-name", name);

        const itemImageElement = document.createElement("img");
        itemImageElement.src = thumbnail;
        itemImageElement.alt = name;
        itemImageElement.classList.add("cart-item-image");

        const infosElement = document.createElement("div");
        infosElement.classList.add("infos-element");

        const itemNameElement = document.createElement("p");
        itemNameElement.classList.add('name-element');
        itemNameElement.textContent = name;

        const itemQuantityElement = document.createElement("p");
        itemQuantityElement.classList.add("cart-item-quantity");
        itemQuantityElement.textContent = `${quantity}x`;

        const itemPriceElement = document.createElement("p");
        itemPriceElement.classList.add("cart-item-price");
        itemPriceElement.textContent = `${price.toFixed(2)}$`;

        const totalPriceElement = document.createElement("p");
        const totalPrice = quantity * price;
        totalPriceElement.classList.add("cart-item-total-price");
        totalPriceElement.textContent = `${totalPrice.toFixed(2)}$`;

        const removeItemElement = document.createElement("img");
        removeItemElement.src = "./assets/images/icon-remove-item.svg";
        removeItemElement.alt = "Remove item";
        removeItemElement.classList.add("remove-item");

        // Gestion de la suppression de l'article
        removeItemElement.addEventListener("click", function () {
            removeItemFromCart(name);
        });

        // Structure de l'article dans le panier
        articleElement.appendChild(itemImageElement);
        infosElement.appendChild(itemNameElement);
        infosElement.appendChild(itemQuantityElement);
        infosElement.appendChild(itemPriceElement);
        infosElement.appendChild(totalPriceElement);
        articleElement.appendChild(infosElement);
        articleElement.appendChild(removeItemElement);

        articlesContainer.appendChild(articleElement);
    }
}

/********** MISE A JOUR DU COMPTEUR D'ARTICLES DANS LE PANIER **********/
let totalItems = 0;

function updateCartCount() {
    const cartCountElement = document.querySelector(".panier h2");
    cartCountElement.innerText = `Your Cart (${totalItems})`;

    const emptyCartMessage = document.querySelector(".empty-cart-message");
    const emptyCartImage = document.querySelector(".empty-cart-image");
    const carbonNeutralMessage = document.querySelector(".carbon-neutral-message");
    const totalPriceDiv = document.querySelector('.order-total-message');

    // Vider les enfants précédents pour éviter les duplications
    totalPriceDiv.innerHTML = '';

    const orderTotal = document.createElement('p');
    const totalPriceElement = document.createElement('p');

    totalPriceDiv.appendChild(orderTotal);
    totalPriceDiv.appendChild(totalPriceElement);

    // Calcul du prix total des articles dans le panier
    let totalPrice = 0;
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(item => {
        const quantityElement = item.querySelector(".cart-item-quantity");
        const itemPriceElement = item.querySelector(".cart-item-price");

        const quantity = parseInt(quantityElement.textContent);
        const itemPrice = parseFloat(itemPriceElement.textContent.replace('$', ''));

        // Ajouter au total en fonction de la quantité
        totalPrice += itemPrice * quantity;
    });

    if (totalItems > 0) {
        emptyCartMessage.style.display = "none";
        emptyCartImage.style.display = "none";

        orderTotal.innerText = 'Order Total';
        totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;  // Afficher le prix total formaté

        carbonNeutralMessage.style.display = "flex";
        createConfirmOrderButton();
    } else {
        emptyCartMessage.style.display = "block";
        emptyCartImage.style.display = "block";
        carbonNeutralMessage.style.display = "none";
        removeConfirmOrderButton();
    }
}


/********** CREATION ET SUPPRESSION DU BOUTON "CONFIRM ORDER" **********/
function createConfirmOrderButton() {
    if (!document.getElementById("confirm-order")) {
        const confirmOrderBtn = document.createElement("button");
        confirmOrderBtn.id = "confirm-order";
        confirmOrderBtn.textContent = "Confirm Order";
        document.querySelector(".panier").appendChild(confirmOrderBtn);
        confirmOrderBtn.addEventListener('click', openModal);
    }
}

function removeConfirmOrderButton() {
    const confirmOrderBtn = document.getElementById("confirm-order");
    if (confirmOrderBtn) {
        confirmOrderBtn.remove();
    }
}

function updateCartItem(name, quantity, price) {
    const existingCartItem = document.querySelector(`.cart-item[data-name="${name}"]`);
    if (existingCartItem) {
        const quantityElement = existingCartItem.querySelector(".cart-item-quantity");
        const totalPriceElement = existingCartItem.querySelector(".cart-item-total-price");

        quantityElement.textContent = quantity + 'x'; // Mettre à jour la quantité
        totalPriceElement.textContent = (quantity * price).toFixed(2) + "$"; // Mettre à jour le prix total
    }
}
// Fonction pour retirer un article du panier
function removeItemFromCart(name) {
    const existingCartItem = document.querySelector(`.cart-item[data-name="${name}"]`);
    if (existingCartItem) {
        const quantityElement = existingCartItem.querySelector(".cart-item-quantity");
        const quantity = parseInt(quantityElement.textContent); // Obtenir la quantité actuelle

        // Retirer l'article du DOM
        existingCartItem.remove();

        // Retrouver le bouton associé à l'article
        const button = document.querySelector(`.btn-commande-active[data-name="${name}"]`);
        const image = document.querySelector(`.plat-image.border-active[data-name="${name}"]`);

        if (button) {
            // Réinitialiser uniquement le bouton et l'image associés
            button.classList.remove("btn-commande-active");
            if (image) {
                image.classList.remove('border-active');
            }

            button.innerHTML = `
                <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
                Add to Cart
            `;



            // Réinitialiser la quantité à zéro sur le bouton associé
            const quantityDisplay = button.querySelector(".quantity");
            if (quantityDisplay) {
                quantityDisplay.textContent = 0; // Réinitialiser la quantité
            }
            // Mettre à jour le compteur total en fonction de la quantité
            totalItems -= quantity;
        }

        // Mettre à jour le compteur total
        updateCartCount(); // Mettre à jour le compteur total
    }
}

// Fonction pour ouvrir la modale
function openModal() {
    // Créer la modale
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Créer le contenu de la modale
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const confirmedImage = document.createElement('img');
    confirmedImage.src = "./assets/images/icon-order-confirmed.svg";
    modalContent.appendChild(confirmedImage);

    // Créer un en-tête
    const modalHeader = document.createElement('h1');
    modalHeader.textContent = 'Order Confirmed';
    modalContent.appendChild(modalHeader);

    // Créer un paragraphe
    const modalParagraph = document.createElement('p');
    modalParagraph.textContent = 'We hope you enjoy your food!';
    modalContent.appendChild(modalParagraph);

    // Créer une div pour les articles de la modale
    const modalArticles = document.createElement('div');
    modalArticles.className = 'articles';

    // Récupérer les articles du panier
    const cartItems = document.querySelectorAll(".cart-item");
    let orderTotal = 0; // Initialiser le total de la commande

    cartItems.forEach(cartItem => {
        // Créer un div pour chaque article
        const modalItem = document.createElement('div');
        modalItem.className = 'modal-item';

        // Récupérer les informations de l'article
        const itemImage = cartItem.querySelector('.cart-item-image').src;
        const itemName = cartItem.querySelector('.name-element').textContent;
        const itemQuantity = cartItem.querySelector('.cart-item-quantity').textContent;
        const itemPrice = parseFloat(cartItem.querySelector('.cart-item-price').textContent.replace('$', '')); // Retirer le $
        const itemTotalPrice = parseFloat(cartItem.querySelector('.cart-item-total-price').textContent.replace('$', '')); // Retirer le $

        orderTotal += itemTotalPrice; // Ajouter le prix total de l'article au total de la commande

        // Ajouter l'image de l'article
        const imageElement = document.createElement("img");
        imageElement.src = `${itemImage}`;

        // Créer une div pour le nom de l'article
        const nameElement = document.createElement('p');
        nameElement.textContent = `${itemName}`;
        nameElement.classList.add("name");

        // Créer une div pour la quantité et le prix
        const quantityPriceDiv = document.createElement('div');
        quantityPriceDiv.className = 'quantity-price';

        const quantityElement = document.createElement('p');
        quantityElement.textContent = `${itemQuantity}`;
        quantityElement.classList.add("quantity");

        const priceElement = document.createElement('p');
        priceElement.textContent = `@ $${itemPrice.toFixed(2)}`; // Réajouter le $ devant le prix et formater à 2 décimales
        priceElement.classList.add("price");

        // Ajouter la quantité et le prix dans quantityPriceDiv
        quantityPriceDiv.appendChild(quantityElement);
        quantityPriceDiv.appendChild(priceElement);

        // Créer une div pour itemDetails
        const itemDetailsDiv = document.createElement('div');
        itemDetailsDiv.className = 'item-details';

        // Ajouter le nom et la div quantityPrice dans itemDetails
        itemDetailsDiv.appendChild(nameElement);
        itemDetailsDiv.appendChild(quantityPriceDiv);

        // Ajouter les éléments dans modalItem
        modalItem.appendChild(imageElement);
        modalItem.appendChild(itemDetailsDiv);
        modalItem.appendChild(document.createElement('p')).textContent = `$${itemTotalPrice.toFixed(2)}`; // Total price avec $ avant

        // Ajouter l'article complet dans la liste des articles de la modale
        modalArticles.appendChild(modalItem);
    });

    // Créer une div pour afficher le total de la commande
    const totalDiv = document.createElement('div');
    totalDiv.className = 'order-total-container'; // Optionnel : ajouter une classe pour le style

    // Créer le premier paragraphe pour "Order Total"
    const orderTotalLabel = document.createElement('p');
    orderTotalLabel.textContent = 'Order Total';
    orderTotalLabel.className = 'order-total-label'; // Optionnel : ajouter une classe pour le style

    // Créer le deuxième paragraphe pour le montant
    const totalAmount = document.createElement('p');
    totalAmount.textContent = `$${orderTotal.toFixed(2)}`; // Afficher le total avec $ devant
    totalAmount.className = 'order-total-amount'; // Optionnel : ajouter une classe pour le style

    // Ajouter les paragraphes dans la div totalDiv
    totalDiv.appendChild(orderTotalLabel);
    totalDiv.appendChild(totalAmount);

    // Ajouter la div totalDiv à la fin des articles dans modalArticles
    modalArticles.appendChild(totalDiv);

    // Ajouter modalArticles au contenu de la modale
    modalContent.appendChild(modalArticles);

    // Bouton de fermeture
const closeButton = document.createElement('button');
closeButton.textContent = 'Start New Order';
closeButton.onclick = function () {
    resetCart(); // Réinitialiser le panier et les quantités
    document.body.removeChild(modal); // Fermer la modale
};
modalContent.appendChild(closeButton);


    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function resetCart() {
    // Réinitialise le compteur d'articles
    totalItems = 0;
    updateCartCount();

    // Supprimer tous les articles du panier
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => item.remove());

    // Réinitialiser les quantités des articles dans la carte
    const buttons = document.querySelectorAll('.btn-commande-active');
    buttons.forEach(button => {
        button.classList.remove('btn-commande-active');
        button.innerHTML = `
            <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
            Add to Cart
        `;
        
        // Réinitialiser les éléments d'image
        const imageElement = button.parentElement.parentElement.querySelector('.plat-image');
        imageElement.classList.remove('border-active');
    });
}


affichage();
