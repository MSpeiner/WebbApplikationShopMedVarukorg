document.addEventListener('DOMContentLoaded', function() {
    var customerData = JSON.parse(localStorage.getItem('customerData'));
    if (customerData) {
        var bstInfoSite = document.getElementById('beställare');
        for (var key in customerData) {
            if (customerData.hasOwnProperty(key)) {
                var p = document.createElement('p');
                p.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ': ' + customerData[key].charAt(0).toUpperCase() + customerData[key].slice(1);
                bstInfoSite.appendChild(p);
            } else {
                console.log("Något gick fel, nyckel saknas")
            }
        }
    } else{
        console.log("Något gick fel, input saknas")
    }

    var totalPriceFinal = 0;
    var productData = JSON.parse(localStorage.getItem('matchedProducts'));
    if (productData) {
        var bestProduct = document.querySelector('#bstprodukter');
        for (var i = 0; i < productData.length; i++) {
            var innerObject = productData[i];
            var pTagg = document.createElement('p');
            pTagg.className = 'confi-p';
            var productTotalPrice = innerObject.price * innerObject.quantity;
            totalPriceFinal += productTotalPrice;
            for (var key in innerObject) {
                if (innerObject.hasOwnProperty(key) && key !== 'image' && key !== 'id') {
                    var valueAsString = innerObject[key].toString();
                    pTagg.textContent += key.charAt(0).toUpperCase() + key.slice(1) + ': ' + valueAsString.charAt(0).toUpperCase() + valueAsString.slice(1) + ', ';
                }
            }
            bestProduct.appendChild(pTagg);
        }

        var totalPrisTag = document.createElement('p');
        totalPrisTag.textContent = "Total kostnad: " + totalPriceFinal.toFixed(2) +"$";
        bestProduct.appendChild(totalPrisTag);
    } else {
        console.log(`Något gick fel, saknar Input`);
    }

    var datumBstElement = document.getElementById('datumBst')
    datumBstElement.innerHTML = '<h5>Beställningsdatum: ' + genereraDagensDatum() + '</h5>';
});


function genereraDagensDatum() {
    var idag = new Date();
    var dagensDatum = idag.getDate();
    var dagensMånad = idag.getMonth() + 1;
    var dagensÅr = idag.getFullYear();
    var tidPunkt = '['  +idag.getHours() + ': '  + idag.getMinutes() + ': ' + idag.getSeconds() + ']';

    var datumText = dagensDatum + '-' + dagensMånad + '-' + dagensÅr + ' ' + tidPunkt;

    return datumText;
}