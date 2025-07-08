/* --- assets/cart.js --- */
(() => {
  /* ==== Helpers ==== */

  // Obtiene el carrito del localStorage con manejo seguro
  const getCart = () => {
    try {
      const data = localStorage.getItem("cart");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error leyendo el carrito:", e);
      return [];
    }
  };

  // Guarda el carrito en localStorage con manejo seguro
  const setCart = (cart) => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Error guardando el carrito:", e);
    }
  };

  // Actualiza el contador visible en la UI
  const refreshBadge = () => {
    const badge = document.getElementById("cart-count");
    if (!badge) return;
    const count = getCart().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  };

  // Añade un item al carrito con validación mínima
  const addToCart = (item) => {
    if (
      !item ||
      typeof item !== "object" ||
      !item.id ||
      !item.name ||
      typeof item.price !== "number"
    ) {
      console.warn("Item inválido para añadir al carrito:", item);
      return false;
    }

    const cart = getCart();

    // Opcional: evitar items duplicados (comenta si quieres permitir duplicados)
    // const exists = cart.some(i => i.id === item.id);
    // if (exists) {
    //   console.info("El item ya está en el carrito:", item.id);
    //   return false;
    // }

    cart.push(item);
    setCart(cart);
    refreshBadge();
    return true;
  };

  // Elimina un item por índice
  const removeFromCart = (index) => {
    const cart = getCart();
    if (index < 0 || index >= cart.length) {
      console.warn("Índice inválido para eliminar del carrito:", index);
      return;
    }
    cart.splice(index, 1);
    setCart(cart);
    refreshBadge();
  };

  // Vacía el carrito
  const clearCart = () => {
    setCart([]);
    refreshBadge();
  };

  /* ==== Eventos ==== */

  // Inicializar contador al cargar la página
  document.addEventListener("DOMContentLoaded", refreshBadge);

  // Delegación de evento click para botones con data-add-cart
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-cart]");
    if (!btn) return;

    let item;
    try {
      item = JSON.parse(btn.dataset.addCart);
    } catch {
      console.error("JSON inválido en data-add-cart:", btn.dataset.addCart);
      return;
    }

    const added = addToCart(item);
    if (!added) return;

    // Cambio temporal en el texto del botón
    const originalText = btn.textContent;
    btn.textContent = "Añadido ✅";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  });

  /* ==== Exportar funciones para carrito.html ==== */
  window.CartOps = {
    getCart,
    removeFromCart,
    clearCart,
    refreshBadge,
  };
})();
