import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getProductDisplayName,
  isBestSellerProduct,
  normalizeCategory,
} from "../data/productOptions";
import API_BASE_URL from "../config/api";

const normalizeProduct = (product, fallbackId = Date.now()) => {
  const normalizedProduct = { ...product };
  delete normalizedProduct.size;
  delete normalizedProduct.sizes;

  const images = Array.isArray(product?.images) && product.images.length > 0
    ? product.images
    : Array.isArray(product?.image) && product.image.length > 0
      ? product.image
      : [product?.url || product?.imageUrl || ""];

  return {
    ...normalizedProduct,
    id: product?.id ?? product?._id ?? fallbackId,
    name: getProductDisplayName(product?.name || product?.productName) || "Untitled Product",
    productName: product?.productName || product?.name || "Untitled Product",
    category: normalizeCategory(product?.category),
    price: Number(product?.price ?? 0),
    oldPrice: Number(product?.originalPrice || 999),
    rating: Number(product?.rating || 0),
    reviews: Number(product?.reviews || 0),
    description: product?.description || "",
    isBestSeller: isBestSellerProduct(product),
    images: images.filter(Boolean),
    badge: product?.badge || "",
  };
};

const normalizeCartItems = (items) =>
  items.map((item) => normalizeProduct(item)).reduce((normalized, item) => {
    const existing = normalized.find((product) => product.id === item.id);
    if (existing) {
      existing.quantity += Number(item.quantity) || 1;
    } else {
      normalized.push({ ...item, quantity: Number(item.quantity) || 1 });
    }
    return normalized;
  }, []);

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("ladies-fashion-cart");

    return savedCart ? normalizeCartItems(JSON.parse(savedCart)) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem(
      "ladies-fashion-wishlist"
    );

    return savedWishlist
      ? JSON.parse(savedWishlist).map((product) => normalizeProduct(product))
      : [];
  });

  const [dbProducts, setDbProducts] = useState([]);

  const refreshProducts = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Failed to load products");
    }

    const nextProducts = Array.isArray(payload.data) ? payload.data : [];
    setDbProducts(nextProducts.map((product) => normalizeProduct(product, product._id || product.id)));
  }, []);

  useEffect(() => {
    refreshProducts().catch((error) => {
      console.error("Failed to load DB products", error);
    });
  }, [refreshProducts]);

  useEffect(() => {
    localStorage.setItem(
      "ladies-fashion-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "ladies-fashion-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product, showDrawer = true) => {
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    if (showDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productOrId) => {
    if (!productOrId) return;
    const productId = typeof productOrId === "object" ? productOrId.id : productOrId;

    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === productId);

      if (exists) {
        return prev.filter((item) => item.id !== productId);
      }

      let productToAdd = productOrId;
      if (typeof productOrId !== "object" || !productOrId.images) {
        productToAdd = mergedProducts.find((p) => p.id === productId) || productOrId;
      }

      return [...prev, productToAdd];
    });
  };

  const isWishlisted = (idOrProduct) => {
    if (!idOrProduct) return false;
    const targetId = typeof idOrProduct === "object" ? idOrProduct.id : idOrProduct;
    return wishlist.some((item) => item.id === targetId);
  };

  const removeFromWishlist = (idOrProduct) => {
    if (!idOrProduct) return;
    const targetId = typeof idOrProduct === "object" ? idOrProduct.id : idOrProduct;
    setWishlist((prev) =>
      prev.filter((item) => item.id !== targetId)
    );
  };

  const mergedProducts = useMemo(
    () => dbProducts,
    [dbProducts]
  );

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const wishlistCount = wishlist.length;

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const shipping = subtotal >= 2999 || subtotal === 0
    ? 0
    : 99;

  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        mergedProducts,
        refreshProducts,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        removeFromWishlist,
        cartCount,
        wishlistCount,
        subtotal,
        shipping,
        total,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
        setIsCartDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);