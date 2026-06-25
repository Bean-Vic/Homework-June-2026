(function () {
  "use strict";

  var PRODUCTS = [
    { id: "product-a", name: "Product A", price: 15 },
    { id: "product-b", name: "Product B", price: 12 },
    { id: "product-c", name: "Product C", price: 20 },
    { id: "product-d", name: "Product D", price: 8 }
  ];

  var INITIAL_CART = [
    { id: "product-a", quantity: 2 },
    { id: "product-c", quantity: 1 }
  ];

  var formatCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format;

  function withLocalStorage(Component, storageKey) {
    return class LocalStorageComponent extends Component {
      constructor(props) {
        var cachedCart = readCart(storageKey);
        super(Object.assign({}, props, {
          initialCart: cachedCart || props.initialCart,
          defaultCart: props.initialCart
        }));
        this.storageKey = storageKey;
      }

      setState(nextState) {
        super.setState(nextState);
        writeCart(this.storageKey, this.state.cart);
      }
    };
  }

  function readCart(storageKey) {
    try {
      var raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;

      return parsed
        .filter(function (item) {
          return PRODUCTS.some(function (product) {
            return product.id === item.id;
          }) && Number.isInteger(item.quantity) && item.quantity > 0;
        })
        .map(function (item) {
          return { id: item.id, quantity: item.quantity };
        });
    } catch (error) {
      return null;
    }
  }

  function writeCart(storageKey, cart) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      // Storage can be blocked in some privacy modes; the cart still works in memory.
    }
  }

  class MiniShoppingCart {
    constructor(props) {
      this.props = props;
      this.state = {
        selectedProductId: props.products[0].id,
        quantity: 1,
        cart: props.initialCart.slice(),
        status: ""
      };
    }

    mount(root) {
      this.root = root;
      this.render();
    }

    setState(nextState) {
      this.state = Object.assign({}, this.state, nextState);
      this.render();
    }

    getProduct(productId) {
      return this.props.products.find(function (product) {
        return product.id === productId;
      });
    }

    addSelectedItem() {
      var productId = this.state.selectedProductId;
      var quantity = Math.max(1, Number(this.state.quantity) || 1);
      var product = this.getProduct(productId);
      var existingItem = this.state.cart.find(function (item) {
        return item.id === productId;
      });
      var nextCart;

      if (existingItem) {
        nextCart = this.state.cart.map(function (item) {
          if (item.id !== productId) return item;
          return { id: item.id, quantity: item.quantity + quantity };
        });
      } else {
        nextCart = this.state.cart.concat([{ id: productId, quantity: quantity }]);
      }

      this.setState({
        cart: nextCart,
        quantity: 1,
        status: product.name + " added to cart."
      });
    }

    changeCartQuantity(productId, delta) {
      var nextCart = this.state.cart
        .map(function (item) {
          if (item.id !== productId) return item;
          return { id: item.id, quantity: item.quantity + delta };
        })
        .filter(function (item) {
          return item.quantity > 0;
        });

      this.setState({
        cart: nextCart,
        status: "Cart updated."
      });
    }

    removeItem(productId) {
      var product = this.getProduct(productId);
      this.setState({
        cart: this.state.cart.filter(function (item) {
          return item.id !== productId;
        }),
        status: product.name + " removed."
      });
    }

    resetCart() {
      this.setState({
        cart: this.props.defaultCart.slice(),
        quantity: 1,
        status: "Cart reset to the sample order."
      });
    }

    cartTotal() {
      var self = this;
      return this.state.cart.reduce(function (sum, item) {
        var product = self.getProduct(item.id);
        return sum + product.price * item.quantity;
      }, 0);
    }

    render() {
      var self = this;

      this.root.innerHTML = [
        '<form class="controls" id="add-form">',
        '  <div class="field">',
        '    <label for="product-select">Item</label>',
        '    <select id="product-select" name="product"></select>',
        '  </div>',
        '  <div class="field">',
        '    <label for="quantity-input">Quantity</label>',
        '    <input id="quantity-input" name="quantity" type="number" min="1" step="1">',
        '  </div>',
        '  <button class="add-button" type="submit">Add</button>',
        '</form>',
        '<p class="status" aria-live="polite"></p>',
        '<section class="cart-body" aria-labelledby="cart-heading">',
        '  <div class="cart-heading">',
        '    <h2 id="cart-heading">Cart</h2>',
        '    <button class="utility-button" id="reset-cart" type="button">Reset</button>',
        '  </div>',
        '  <div id="cart-summary"></div>',
        '</section>',
        '<div class="total-row"><span>Total:</span><span id="cart-total"></span></div>'
      ].join("");

      this.renderControls();
      this.renderCart();

      this.root.querySelector("#add-form").addEventListener("submit", function (event) {
        event.preventDefault();
        self.addSelectedItem();
      });

      this.root.querySelector("#product-select").addEventListener("change", function (event) {
        self.setState({
          selectedProductId: event.target.value,
          status: ""
        });
      });

      this.root.querySelector("#quantity-input").addEventListener("input", function (event) {
        self.setState({
          quantity: Math.max(1, Number(event.target.value) || 1),
          status: ""
        });
      });

      this.root.querySelector("#reset-cart").addEventListener("click", function () {
        self.resetCart();
      });
    }

    renderControls() {
      var select = this.root.querySelector("#product-select");
      var quantity = this.root.querySelector("#quantity-input");
      var status = this.root.querySelector(".status");

      select.innerHTML = this.props.products.map(function (product) {
        return '<option value="' + product.id + '">' +
          product.name + " - " + formatCurrency(product.price) +
          "</option>";
      }).join("");

      select.value = this.state.selectedProductId;
      quantity.value = this.state.quantity;
      status.textContent = this.state.status;
    }

    renderCart() {
      var self = this;
      var summary = this.root.querySelector("#cart-summary");
      var total = this.root.querySelector("#cart-total");
      var resetButton = this.root.querySelector("#reset-cart");

      resetButton.disabled = this.state.cart.length === 0;
      total.textContent = formatCurrency(this.cartTotal());

      if (this.state.cart.length === 0) {
        summary.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
        return;
      }

      summary.innerHTML = [
        '<table class="cart-table">',
        '  <thead>',
        '    <tr>',
        '      <th scope="col">Item</th>',
        '      <th scope="col">Quantity</th>',
        '      <th scope="col">Line Total</th>',
        '      <th scope="col">Action</th>',
        '    </tr>',
        '  </thead>',
        '  <tbody>',
        this.state.cart.map(function (item) {
          var product = self.getProduct(item.id);
          var lineTotal = product.price * item.quantity;

          return [
            '    <tr>',
            '      <td data-label="Item"><strong>' + product.name + '</strong></td>',
            '      <td data-label="Quantity">',
            '        <span class="quantity-stepper" aria-label="' + product.name + ' quantity">',
            '          <button class="step-button" data-action="decrease" data-product-id="' + item.id + '" type="button" aria-label="Decrease ' + product.name + '">-</button>',
            '          <span class="quantity-value">' + item.quantity + '</span>',
            '          <button class="step-button" data-action="increase" data-product-id="' + item.id + '" type="button" aria-label="Increase ' + product.name + '">+</button>',
            '        </span>',
            '      </td>',
            '      <td data-label="Line Total">' + formatCurrency(lineTotal) + '</td>',
            '      <td data-label="Action"><button class="remove-button" data-action="remove" data-product-id="' + item.id + '" type="button">Remove</button></td>',
            '    </tr>'
          ].join("");
        }).join(""),
        '  </tbody>',
        '</table>'
      ].join("");

      summary.querySelectorAll("[data-action]").forEach(function (button) {
        button.addEventListener("click", function (event) {
          var action = event.currentTarget.getAttribute("data-action");
          var productId = event.currentTarget.getAttribute("data-product-id");

          if (action === "increase") self.changeCartQuantity(productId, 1);
          if (action === "decrease") self.changeCartQuantity(productId, -1);
          if (action === "remove") self.removeItem(productId);
        });
      });
    }
  }

  var PersistentMiniShoppingCart = withLocalStorage(MiniShoppingCart, "mini-shopping-cart-state");

  var app = new PersistentMiniShoppingCart({
    products: PRODUCTS,
    initialCart: INITIAL_CART
  });

  app.mount(document.getElementById("app"));
})();
