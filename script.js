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
    // Vérifier si le bouton est déjà actif
    if (!button.classList.contains("btn-commande-active")) {
        let quantity = 1;
        totalItems += quantity; // Ajouter au total
        updateCartCount();

        // Ajouter la classe active
        button.classList.add("btn-commande-active");
        imageElement.classList.add("border-active");

        // Remplacer le contenu du bouton par les contrôles de quantité
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
            quantity++; // Incrémenter la quantité locale
            totalItems++; // Incrémenter le total général
            quantityDisplay.textContent = quantity; // Mettre à jour l'affichage
            updateCartItem(itemName, quantity, itemPrice); // Mettre à jour le panier
            updateCartCount(); // Mettre à jour le compteur total
        });

        // Gestion de la diminution de la quantité
        decreaseBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            if (quantity > 1) {
                quantity--; // Décrémenter la quantité locale
                totalItems--; // Décrémenter le total général
                quantityDisplay.textContent = quantity; // Mettre à jour l'affichage
                updateCartItem(itemName, quantity, itemPrice); // Mettre à jour le panier
            } else {
                totalItems--; // Décrémenter le total général
                button.innerHTML = `
            <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart icon">
            Add to Cart
        `;
                button.classList.remove("btn-commande-active");
                imageElement.classList.remove("border-active");
                removeItemFromCart(itemName); // Retirer l'article du panier
            }
            updateCartCount(); // Mettre à jour le compteur total
        });


        // Ajouter l'article au panier
        addItemToCart(itemName, itemPrice, quantity);
        updateCartCount();
    }
}

/********** FONCTION POUR AJOUTER L'ARTICLE DANS LE PANIER **********/
function addItemToCart(name, price, quantity) {
    const articlesContainer = document.querySelector(".articles");

    // Vérifier si l'article est déjà dans le panier
    const existingCartItem = document.querySelector(`.cart-item[data-name="${name}"]`);
    if (existingCartItem) {
        // Si l'article est déjà dans le panier, mettre à jour la quantité
        const quantityElement = existingCartItem.querySelector(".cart-item-quantity");
        const totalPriceElement = existingCartItem.querySelector(".cart-item-total-price");

        const newQuantity = parseInt(quantityElement.textContent) + quantity;
        quantityElement.textContent = newQuantity + 'x'; // Mise à jour de la quantité dans le panier
        totalPriceElement.textContent = (newQuantity * price).toFixed(2) + "$"; // Mise à jour du prix total
    } else {
        // Si l'article n'est pas encore dans le panier, l'ajouter
        const articleElement = document.createElement("div");
        articleElement.classList.add("cart-item");
        articleElement.setAttribute("data-name", name);

        const infosElement = document.createElement("div")
        infosElement.classList.add("infos-element")
        const itemNameElement = document.createElement("p");
        itemNameElement.classList.add('name-element')
        itemNameElement.textContent = name;

        const itemQuantityElement = document.createElement("p");
        itemQuantityElement.classList.add("cart-item-quantity");
        itemQuantityElement.textContent = `${quantity}x`; // Afficher la quantité initiale dans le panier

        const itemPriceElement = document.createElement("p");
        itemPriceElement.classList.add("cart-item-price");
        itemPriceElement.textContent = `${price.toFixed(2)}$`;

        const totalPriceElement = document.createElement("p");
        const totalPrice = price * quantity;
        totalPriceElement.classList.add("cart-item-total-price");
        totalPriceElement.textContent = `${totalPrice.toFixed(2)}$`;

        // Création de l'élément SVG pour retirer l'article
        const removeItemElement = document.createElement("img");
        removeItemElement.src = "./assets/images/icon-remove-item.svg"; // Chemin vers ton image SVG
        removeItemElement.alt = "Remove item";
        removeItemElement.classList.add("remove-item"); // Ajoutez une classe pour le style si besoin

        // Événement de clic pour retirer l'article
        removeItemElement.addEventListener("click", function () {
            removeItemFromCart(name);
        });

        // Construction de la structure

        articleElement.appendChild(infosElement);
        infosElement.appendChild(itemNameElement);
        infosElement.appendChild(itemQuantityElement);
        infosElement.appendChild(itemPriceElement);
        infosElement.appendChild(totalPriceElement);

        articleElement.appendChild(removeItemElement); // Ajoutez l'élément de retrait
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


affichage();
