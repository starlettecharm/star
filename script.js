function toggleMenu() {
    var menu = document.getElementById("navbar-menu");
    menu.classList.toggle("active");
}

function toggleProfile() {
    var profile = document.getElementById("profile-menu");
    profile.classList.toggle("active");
}

function toggleCart() {
    var cartSidebar = document.querySelector(".cart-sidebar");
    if (cartSidebar.style.right === "0px") {
        cartSidebar.style.right = "-30%";
    } else {
        cartSidebar.style.right = "0px";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var cartItems = document.getElementById("cartItems");
    var itemCount = document.getElementById("itemCount");
    var addCartButtons = document.querySelectorAll(".addCart");
    var productItems = document.querySelectorAll(".product-item");
    var cartDropArea = document.getElementById("cartDropArea");

    addCartButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var productName = button.getAttribute("product-name");
            var productPrice = button.getAttribute("product-price");
            addToCart(productName, productPrice);
        });
    });

    productItems.forEach(function (item) {
        item.setAttribute("draggable", true);

        item.addEventListener("dragstart", function (event) {
            var productName = item.querySelector("h4").innerText;
            var productPrice = item.querySelector("p").innerText.replace("₱", "");
            event.dataTransfer.setData("text", JSON.stringify({
                name: productName,
                price: productPrice
            }));
        });
    });

    cartDropArea.addEventListener("dragover", function (event) {
        event.preventDefault();
    });

    cartDropArea.addEventListener("drop", function (event) {
        event.preventDefault();
        var data = JSON.parse(event.dataTransfer.getData("text"));
        addToCart(data.name, data.price);
    });

    function addToCart(name, price) {
        var cartItemNames = cartItems.getElementsByClassName("cart-item-title");
        for (var i = 0; i < cartItemNames.length; i++) {
            if (cartItemNames[i].innerText === name) {
                var quantityInput = cartItemNames[i].parentElement.querySelector(".cart-quantity-input");
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateItemCount();
                updateTotalAmount();
                return;
            }
        }

        var cartItem = document.createElement("li");
        cartItem.className = "cart-row";
        cartItem.innerHTML = `
            <span class="cart-item-title">${name}</span>
            <span class="cart-price">₱${price}</span>
            <div class="cart-quantity">
                <input class="cart-quantity-input" type="number" value="1" min="1">
                <button class="btn-remove">X</button>
            </div>
        `;
        cartItems.appendChild(cartItem);

        // event listeners for new cart item
        cartItem.querySelector(".cart-quantity-input").addEventListener("change", function () {
            if (isNaN(this.value) || this.value <= 0) {
                this.value = 1;
            }
            updateItemCount();
            updateTotalAmount(); 
        });

        cartItem.querySelector(".btn-remove").addEventListener("click", function () {
            cartItem.remove();
            updateItemCount();
            updateTotalAmount(); 
        });

        updateItemCount();
        updateTotalAmount(); 
    }

    function updateItemCount() {
        var cartRows = cartItems.getElementsByClassName("cart-row");
        var totalItems = 0;

        for (var i = 0; i < cartRows.length; i++) {
            var quantityInput = cartRows[i].querySelector(".cart-quantity-input");
            totalItems += parseInt(quantityInput.value);
        }

        itemCount.textContent = totalItems + " items";
    }

    function updateTotalAmount() {
        var cartRows = cartItems.getElementsByClassName("cart-row");
        var totalAmount = 0;

        for (var i = 0; i < cartRows.length; i++) {
            var priceElement = cartRows[i].querySelector(".cart-price");
            var quantityInput = cartRows[i].querySelector(".cart-quantity-input");

            var price = parseFloat(priceElement.innerText.replace("₱", ""));
            var quantity = parseInt(quantityInput.value);

            totalAmount += price * quantity;
        }

        var totalAmountElement = document.getElementById("totalAmount");
        totalAmountElement.textContent = "TOTAL: ₱" + totalAmount.toFixed(2);
    }

    //call updateTotalAmount when cart is updated
    cartItem.querySelector(".cart-quantity-input").addEventListener("change", function () {
        if (isNaN(this.value) || this.value <= 0) {
            this.value = 1;
        }
        updateItemCount();
        updateTotalAmount();
    });

    cartItem.querySelector(".btn-remove").addEventListener("click", function () {
        cartItem.remove();
        updateItemCount();
        updateTotalAmount();
    });

    updateTotalAmount();
});