let layoutProducts = document.querySelector(".layout__products");
let layoutCart = document.querySelector(".layout__cart");
let cartProducts = document.querySelector(".cart__products");
let totalPrice = document.querySelector(".total__price");
const closeCart = document.querySelector('.cart__ico');
let cart = [];
//////////
const setProducts = (data) =>
  data.forEach((product) => {
    layoutProducts.innerHTML += `
          <article class="product">
              <div class="product__img-container">
                  <img class="product__img" src="${product?.image}"/>
              </div>

              <div class="product__title">${product?.title}</div>

              <div class="product__price">${product?.price}$</div>

              <button class="product__btn" data-id="${product?.id}" >Add</button>

          </article>
      `;
  });
////////
const checkQuantityInCart = (id) => {
  let exist = cart.findIndex((cartProduct) => cartProduct?.id === id);
  if (exist != -1) {
    return cart[exist];
  } else {
    return null;
  }
};
////////
const checkStore = (products, id) => {
  return products.find((product) => product?.id === id);
};
////////
const addToCart = (products, id) => {
  let cartProduct = checkQuantityInCart(id);
  let product = checkStore(products, id);
  if (cartProduct === null) {
    cart.push({
      id: product?.id,
      quantity: 1,
    });
  } else {
    cartProduct.quantity++;
    if (cartProduct?.quantity > product?.rating?.count) {
      alert("we only have " + product?.rating?.count + "aviable");
      cartProduct.quantity = product?.rating?.count;
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};
////////
const handleCart = (products) => {
  let addBtn = document.querySelectorAll(".product__btn");

  addBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      let productId = +btn.getAttribute("data-id");
      const product = checkStore(products, productId);
      if (product?.rating?.count > 0) {
        //add prduct to cart
        addToCart(products, productId);
        showCart(products);
      }
    });
  });
};
///////
const removeCart = (id) => {
  let cartProduct = checkQuantityInCart(id);
  if (cartProduct.quantity > 1) {
    cartProduct.quantity--;
  } else {
    console.log(cart);
    console.log("id: " + cartProduct.id);
    let idx = cart.findIndex((product) => product.id === cartProduct.id);
    console.log("index: " + idx);
    cart.splice(idx, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};
///////
const getTotal = (products) => {
  let total = 0;
  cart.forEach((product) => {
    let prduct = checkStore(products, product.id);
    let subTotal = prduct?.price * product.quantity;

    total += subTotal;
  });
  return total.toFixed(2);
};
//VERY IMPORTANT FUNCTION, IS GOING TO REFRESH EVERY TIME THE CART SIDE
const showCart = (products) => {
  if (cart.length > 0) {
    layoutCart.classList.remove("layout__cart--hide");
  } else {
    layoutCart.classList.add("layout__cart--hide");
  }
  cartProducts.innerHTML = "";
  cart.forEach((cartProduct) => {
    let product = checkStore(products, cartProduct.id);
    let subTotal = product?.price;
    cartProducts.innerHTML += `
          <article class="cart__item">
              <div class="cart__container-img">
                  <img class="cart__img" src="${product?.image}"/>
              </div>
  
              <div class="cart__content">
                  <h3 class="cart__product--title">${product?.title}</h3>
  
                  <button class="cart__btn-quatity">
                      <i class="btn-quantity__ico-minus fa-solid fa-minus" data-id="${
                        product?.id
                      }"></i>
                      <span class="btn-quantity__number">${
                        cartProduct?.quantity
                      }</span>
                      <i class="btn-quantity__ico-plus fa-solid fa-plus" data-id="${
                        product?.id
                      }"></i>
                  </button>
  
                  <p class="cart__subtotal">${
                    Math.trunc(subTotal * 100) / 100
                  }$</p>
              </div>
          </article>
      `;

    const total = getTotal(products);
    totalPrice.textContent = `${total}$`;

    const iconsMinus = document.querySelectorAll(".btn-quantity__ico-minus");
    iconsMinus.forEach((ico) => {
      ico.addEventListener("click", () => {
        let productId = +ico.getAttribute("data-id"); //very important to parse the string to number
        removeCart(productId);
        showCart(products);
      });
    });
    ///////////
    const iconsPlus = document.querySelectorAll(".btn-quantity__ico-plus");
    iconsPlus.forEach((ico) => {
      ico.addEventListener("click", () => {
        let productId = +ico.getAttribute("data-id"); //very important to parse the string to number
        addToCart(products, productId);
        showCart(products);
      });
    });
  });
};
///////////
closeCart.addEventListener('click', () => {
  layoutCart.classList.add("layout__cart--hide");
})
///////////
const loadCart = (products) => {
  let myCart = JSON.parse(localStorage.getItem("cart"));

  if (myCart) {
    cart = myCart;
  }
  showCart(products);
};
//////////
const setBlock = async () => {
  const limit = 4;
  try {
    const res = await fetch(`https://fakestoreapi.com/products?limit=${limit}`);
    const data = await res.json();
    setProducts(data);
    loadCart(data);
    handleCart(data);
  } catch (err) {
    console.error("Error fetching products:", err?.message);
    return [];
  }
};

setBlock();
