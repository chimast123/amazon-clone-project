import {
  calculateCartQuantity,
  cart,
  removeFromCart,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

hello();

const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

function updateCartQuantity() {
  calculateCartQuantity();

  const cartQuantity = calculateCartQuantity();

  document.querySelector(".js-item-count").innerHTML = `${cartQuantity} items`;

  return `${cartQuantity} items`;
}

updateCartQuantity();

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
  <div class="cart-item-container 
  js-cart-item-container-${matchingProduct.id} ">
            <div class="delivery-date">Delivery date: Tuesday, June 21</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">$${formatCurrency(
                  matchingProduct.priceCents
                )}</div>
                <div class="product-quantity">
                  <span class="js-quantity-count"> Quantity: <span class="quantity-label js-quantity-label">${
                    cartItem.quantity
                  }</span> </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id = "${
                    matchingProduct.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id = "${
                    matchingProduct.id
                  }">
                  Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Tuesday, June 21</div>
                    <div class="delivery-option-price">FREE Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Wednesday, June 15</div>
                    <div class="delivery-option-price">$4.99 - Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">Monday, June 13</div>
                    <div class="delivery-option-price">$9.99 - Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
});

function deliveryOptionsHTML() {}

document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();

    updateCartQuantity();
  });
});

document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    // FIX: Only update quantity count inside this container
    const quantityCount = container.querySelector(".js-quantity-count");
    quantityCount.innerHTML = "Quantity: ";

    container.classList.add("is-editing-quantity");

    const input = container.querySelector(".js-quantity-input");
    input.focus();

    // Add Enter key support
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const newQuantity = Number(input.value);

        if (newQuantity >= 0 && newQuantity < 1000) {
          updateQuantity(productId, newQuantity);

          quantityCount.innerHTML = `Quantity: <span class="quantity-label js-quantity-label">${newQuantity}</span>`;

          updateCartQuantity();
          container.classList.remove("is-editing-quantity");
        } else {
          alert("Please enter a quantity between 0 and 999.");
        }
      }
    });
  });
});

document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    const input = container.querySelector(".js-quantity-input").value;
    const newQuantity = Number(input);

    if (newQuantity >= 0 && newQuantity < 1000) {
      updateQuantity(productId, newQuantity);

      const quantityCount = container.querySelector(".js-quantity-count");
      quantityCount.innerHTML = `Quantity: <span class="quantity-label js-quantity-label">${newQuantity}</span>`;

      updateCartQuantity();
      container.classList.remove("is-editing-quantity");
    } else {
      alert("Please enter a quantity between 0 and 999.");
    }
  });
});
