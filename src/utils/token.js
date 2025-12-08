const TOKEN_KEY = "token";
const USER_KEY = "user";
const CART_KEY = "cart";

const createStoreNamespace = (name) => {
  return {
    set: (data) => {
      localStorage.setItem(name, JSON.stringify(data));
    },
    get: () => {
      return JSON.parse(localStorage.getItem(name));
    },
    clear: () => {
      localStorage.removeItem(name);
    },
  };
};

export const setToken = (data) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
};
export const getToken = () => {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
};
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setUser = (data) => {
  localStorage.setItem(USER_KEY, JSON.stringify(data));
};
export const getUser = () => {
  return JSON.parse(localStorage.getItem(USER_KEY));
};
export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const storePreCheckoutResponse = createStoreNamespace(
  "pre-checkout-response"
);
export const storePreCheckoutData = createStoreNamespace("pre-checkout-data");
export const storeAddressSelect = createStoreNamespace("pre-checkout-address");
export const storeCart = createStoreNamespace("cart");
