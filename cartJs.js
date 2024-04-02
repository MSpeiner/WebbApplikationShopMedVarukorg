async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/')
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error + "Fetch has failed")
        throw error;
    }
}
const matchedProducts = [];
async function fetchAndProcessProducts() {
    try {
        const productList = await fetchProducts();

        let selectedProductIds = [];
        const storedData = localStorage.getItem('selectedProductIds');
        if (storedData) {
            selectedProductIds = JSON.parse(storedData);
        }

        const idCounts = {};

        selectedProductIds.forEach(id => {
            idCounts[id] = (idCounts[id] || 0) + 1;
        });

        let totalOrderPrice = 0;

        const varukorgCenterbox = document.getElementById('varukorg-centerbox');

        productList.forEach(product => {
            if (selectedProductIds.includes(product.id)) {
                const quantity = idCounts[product.id] || 0;

                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                const productTotalPrice = product.price * quantity;

                const productContent = `
                <img src="${product.image}" alt="${product.title}" />
                <h3>${product.title}</h3>
                <p>Price: ${product.price}$</p>
                <p>Quantity: <span id="quantity-${product.id}">${quantity}</span></p>
                <p id="total-price-${product.id}">Total Price for this product: ${productTotalPrice}$</p>
                <input type="number" id="quantity-input-${product.id}" min="1" value="${quantity}">
                <br>
                <button type="submit" class="btn btn-danger remove-product">Remove Product</button>
                `;

                productDiv.innerHTML = productContent;

                matchedProducts.push({
                    id: product.id,
                    title: product.title,
                    image: product.image,
                    price: product.price,
                    quantity: quantity,
                    totalProductPrice: productTotalPrice
                });

                varukorgCenterbox.appendChild(productDiv);

                const quantityInput = document.getElementById(`quantity-input-${product.id}`);
                quantityInput.addEventListener('change', (event) => {
                    const newQuantity = parseInt(event.target.value);
                    const quantitySpan = document.getElementById(`quantity-${product.id}`);
                    quantitySpan.textContent = newQuantity;
                    idCounts[product.id] = newQuantity;
                    updateTotalPrice();
                    
                    const matchedProductIndex = matchedProducts.findIndex(matchedProduct => matchedProduct.id === product.id);
                    if (matchedProductIndex !== -1) {
                        matchedProducts[matchedProductIndex].quantity = newQuantity;
                        matchedProducts[matchedProductIndex].totalProductPrice = product.price * newQuantity;
                    }
                    

                    const totalPriceElement = document.getElementById(`total-price-${product.id}`);
                    totalPriceElement.textContent = `Total Price for this product: ${matchedProducts[matchedProductIndex].totalProductPrice}$`;
                
                    selectedProductIds = selectedProductIds.filter(id => id !== product.id);
                    for (let i = 0; i < newQuantity; i++) {
                        selectedProductIds.push(product.id);
                    }
                    localStorage.setItem('selectedProductIds', JSON.stringify(selectedProductIds));
                });

                totalOrderPrice += productTotalPrice;

                const removeButton = productDiv.querySelector('.remove-product');
                removeButton.addEventListener('click', () => {
                    const indexToRemove = matchedProducts.findIndex(item => item.id === product.id);
                    if (indexToRemove !== -1) {
                        matchedProducts.splice(indexToRemove, 1);
                    }
                    productDiv.remove();
                    updateTotalPrice();
                    selectedProductIds = selectedProductIds.filter(id => id !== product.id);
                    localStorage.setItem('selectedProductIds', JSON.stringify(selectedProductIds));
                    window.location.reload();
                });
            }
        });

        const totalPriceDiv = document.createElement('div');
        totalPriceDiv.classList.add('total-summary', 'total-price');
        totalPriceDiv.innerHTML = `<p>Totalt pris för alla produkter: ${totalOrderPrice}$</p>`;
        varukorgCenterbox.appendChild(totalPriceDiv);

        function updateTotalPrice() {
            totalOrderPrice = 0;
            productList.forEach(product => {
                const quantity = idCounts[product.id] || 0;
                if (quantity > -1) {
                    totalOrderPrice += product.price * quantity;
                }
            });
        
            totalPriceDiv.innerHTML = `<p>Totalt pris för alla produkter: ${totalOrderPrice.toFixed(2)}$</p>`;
        }

        return matchedProducts;
    } catch (error) {
        console.error("Ett fel uppstod:", error);
        throw error;
    }
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
    localStorage.setItem('matchedProducts', JSON.stringify(matchedProducts));
}

const finalBuyButton = document.querySelector('.final-buy');
const productForm = document.querySelector('.product-info');

finalBuyButton.addEventListener('click', function() {
    productForm.style.display = "block";
});

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

const cancelButton = document.querySelector('.cancel-button')
const prodInfo = document.querySelector('.product-info')
cancelButton.addEventListener('click', function(event){
prodInfo.style.display="none"
});

const clearButton = document.querySelector('.clear-button');
clearButton.addEventListener('click', function() {
    window.location.reload();
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        input.value = 0;
        const productId = input.id.split('-')[2];
        const quantitySpan = document.getElementById(`quantity-${productId}`);
        quantitySpan.textContent = 0;
        const matchedProductIndex = matchedProducts.findIndex(product => product.id === productId);
        if (matchedProductIndex !== -1) {
            matchedProducts[matchedProductIndex].quantity = 0;
        }
    });
    localStorage.setItem('selectedProductIds', JSON.stringify([]));
    updateTotalPrice(); 
});

fetchAndProcessProducts();