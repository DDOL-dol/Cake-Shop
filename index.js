var data = null;
var totalNum = 0;
var totalMoney = 0;
var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];

fetch("data.json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(d => {
        data = d;
        initializeCart();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });


function initializeCart() {
    $(".cart-btn").on("click tap",function () {
        var itemId = getItemId(this);
        selectPanel(itemId);
        updateItem(itemId, 1);
        $(`#cart-num-${itemId}`).text(arr[itemId]);
        addCartItem(itemId, data[itemId]['category'], 1, data[itemId]['price']);
        updateCart();
    });

    $(".cart-dec-btn").on("click tap", function () {
        var itemId = getItemId(this);
        updateItem(itemId, -1);
        if (arr[itemId] === 0) {
            clearPanel(itemId);
            clearCartItem(itemId);
        } else {
            $(`#cart-num-${itemId}`).text(arr[itemId]);
        }
        updateCartItem(itemId);
        updateCart();
    });

    $(".cart-inc-btn").on("click tap",function () {
        var itemId = getItemId(this);
        updateItem(itemId, 1);
        $(`#cart-num-${itemId}`).text(arr[itemId]);
        updateCartItem(itemId);
        updateCart();
    });
}

function updateCart() {
    $("#total-num").text(`Your Cart (${totalNum})`);
    $("#total-money").text(`\$ ${totalMoney}`);

    if (totalNum !== 0) {
        $("#non-empty-cart").removeClass("hidden");
        $("#empty-cart").addClass("hidden");
    } else {
        $("#non-empty-cart").addClass("hidden");
        $("#empty-cart").removeClass("hidden");
    }
}

function getItemId(object) {
    var id = $(object).attr("id");
    var split = id.split("-");
    var itemId = split.at(-1);
    return itemId;
}

function updateItem(itemId, num) {
    arr[itemId] += num;
    totalNum += num;
    totalMoney += data[itemId]['price'] * num;
}

function selectPanel(itemId) {
    $(`#cart-btn-non-select-${itemId}`).addClass("hidden");
    $(`#cart-btn-select-${itemId}`).removeClass("hidden");
    $(`#cart-dec-btn-${itemId}`).closest('.card-body').siblings('.card-img-top').css("border", "2px solid hsl(14, 86%, 42%)");
}

function clearPanel(itemId) {
    $(`#cart-btn-non-select-${itemId}`).removeClass("hidden");
    $(`#cart-btn-select-${itemId}`).addClass("hidden");
    $(`#cart-dec-btn-${itemId}`).closest('.card-body').siblings('.card-img-top').css("border", "0");
}


function addCartItem(itemId, itemName, quantity, singlePrice) {
    const totalPrice = (quantity * singlePrice).toFixed(2);
    // outer div with unique id
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row justify-content-between border-bottom my-3';
    rowDiv.id = `cart-item-${itemId}`;

    // first row
    const colAutoDiv1 = document.createElement('div');
    colAutoDiv1.className = 'col-auto align-items-center';

    // title
    const titleRowDiv = document.createElement('div');
    titleRowDiv.className = 'row cart-item-title mb-2';
    titleRowDiv.textContent = itemName;
    colAutoDiv1.appendChild(titleRowDiv);

    // num, price, total 
    const detailsRowDiv = document.createElement('div');
    detailsRowDiv.className = 'row mb-2';

    const numColDiv = document.createElement('div');
    numColDiv.className = 'col cart-item-num'; // num
    numColDiv.id = `item-num-${itemId}`;
    numColDiv.textContent = `${quantity}x`;
    detailsRowDiv.appendChild(numColDiv);

    const singleColDiv = document.createElement('div');
    singleColDiv.className = 'col cart-item-single';
    singleColDiv.textContent = `@${singlePrice}`; // single price
    detailsRowDiv.appendChild(singleColDiv);

    const totalColDiv = document.createElement('div');
    totalColDiv.className = 'col cart-item-total';
    totalColDiv.id = `item-total-${itemId}`;
    totalColDiv.textContent = `$${totalPrice}`; // total price
    detailsRowDiv.appendChild(totalColDiv);

    colAutoDiv1.appendChild(detailsRowDiv);

    const colAutoDiv2 = document.createElement('div');
    colAutoDiv2.className = 'col-auto d-flex align-items-center';

    const removeLink = document.createElement('a');
    const removeImg = document.createElement('img');
    removeImg.src = './assets/images/icon-remove-item.svg';
    removeImg.className = 'cart-item-remove-btn'; // remove btn
    removeImg.id = `remove-item-${itemId}`; // remove btn id
    removeLink.appendChild(removeImg);

    colAutoDiv2.appendChild(removeLink);

    rowDiv.appendChild(colAutoDiv1);
    rowDiv.appendChild(colAutoDiv2);

    document.getElementById('items-container').appendChild(rowDiv);

    // remove btn: add event listener
    removeImg.addEventListener('click', function () {
        updateItem(itemId, -arr[itemId]);
        updateCart();
        clearCartItem(itemId);
        clearPanel(itemId);
    });

    $(`remove-item-${itemId}`).on("tap", function () {
        updateItem(itemId, -arr[itemId]);
        updateCart();
        clearCartItem(itemId);
        clearPanel(itemId);
    });
}

function updateCartItem(itemId) {
    var num = arr[itemId]
    var price = data[itemId]['price'];
    $(`#item-num-${itemId}`).text(`${num}x`);
    $(`#item-total-${itemId}`).text(`$${num * price}`)
}

function clearCartItem(itemId) {
    document.getElementById(`cart-item-${itemId}`).remove();
}
