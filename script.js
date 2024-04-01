async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/')
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error + "Fetch has failed")
    }
}

const productList = await fetchProducts()

async function createCardTemplate() {
    try {
        const response = await fetch('./card.html');
        const template = await response.text();
        return template;
    } catch (error) {
        console.error("Failed to fetch card template:", error);
        return null;
    }
}

async function createCard() {
    const cardTemplate = await createCardTemplate();
    if (!cardTemplate) {
        console.error("Card template not available");
        return;
    }

    productList.forEach(product => {
        const card = document.createElement('div');
        card.innerHTML = cardTemplate;

        card.querySelector('.card-img-top').src = product.image;
        card.querySelector('.card-title').textContent = product.title;
        card.querySelector('.card-price').textContent = `$${product.price}` ;
        
        const cardButton = card.querySelector('.card-button');
        cardButton.setAttribute('buttonid', product.id);

        cardButton.addEventListener('click', () => {
            const productForm = document.querySelector('.product-info');
            productInfo(product.image, 
                product.title, 
                product.description, 
                `Price: $${product.price}`, 
                product.id);

            const buyButton = document.querySelector('.buy-button')
            buyButton.setAttribute('buyButtonId', product.id)

            const productId = parseInt(cardButton.getAttribute('buttonid'));
            selectedProductIds.push(productId);

            addToCartQuantity();

        });

        document.getElementById("container-cards").appendChild(card.firstChild);

    });
}
let selectedProductIds = [];
const cartIcon = document.getElementById("kundvagn-ikon");
cartIcon.addEventListener('click', () => {
    localStorage.setItem('selectedProductIds', JSON.stringify(selectedProductIds));
});
createCard();

const buyButton = document.querySelector('.buy-button');
buyButton.addEventListener('click', function(event) {
    event.preventDefault();

    const form = document.querySelector('#kontaktForm')

    if(!form.checkValidity()) {
        const inputs = document.querySelectorAll("input")
        let firstInvalidInput = null;

        for (let input of inputs) {
            if (!input.checkValidity()) {
                firstInvalidInput = input;
                break;
            }
        }

        firstInvalidInput.reportValidity();
        firstInvalidInput = null;
    } else {
        createCustomerList();
        createProductList();
        window.location.href = 'order-conf.html';
    }
});


function productInfo(image, title, desc, price, productId) {
    const productInfo = document.querySelector('.product-info');
    productInfo.querySelector('.card-img-top').src = image;
    productInfo.querySelector('.info-title').textContent = title;
    productInfo.querySelector('.info-desc').textContent = desc;
    productInfo.querySelector('.info-price').textContent = price;

    const infoButton = productInfo.querySelector('.info-button');
    infoButton.setAttribute('buttonid', productId);
    infoButton.addEventListener('click', () => localStorage.setItem('productId',productId) );
    
}

function createCustomerList(){
    var nameOfCustomer = document.querySelector('.name').value;
    var emailOfCustomer = document.querySelector('.mail').value;
    var phoneOfCustomer = document.querySelector('.phone').value;
    var adressOfCustomer = document.querySelector('.adress').value;
    var zipcodeOfCustomer = document.querySelector('.zipcode').value;
    var cityOfCustomer = document.querySelector('.city').value;
    
    var customerData = {
        Name: nameOfCustomer,
        email: emailOfCustomer,
        phone: phoneOfCustomer,
        address: adressOfCustomer,
        zipcode: zipcodeOfCustomer,
        city: cityOfCustomer
    };

    localStorage.setItem('customerData', JSON.stringify(customerData));
}

function createProductList(){

    const productId = document.querySelector('.buy-button').getAttribute('buyButtonId')

    const product = productList.find(product => product.id === parseInt(productId))

    var productData = {
        Title: product.title,
        Price: product.price.toString(),
        Articlenumber: product.id.toString()
    }; 

    localStorage.setItem('productData', JSON.stringify(productData));

}

const cancelButton = document.querySelector('.cancel-button')
const prodInfo = document.querySelector('.product-info')
cancelButton.addEventListener('click', function(event){
prodInfo.style.display="none"
});

function addToCartQuantity(){
    let countDiv = document.querySelector('#item-count');
    countDiv.textContent = selectedProductIds.length;
}
