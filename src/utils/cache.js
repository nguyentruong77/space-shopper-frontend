export const localStorageCache = {
  set(name, data, expired) {
    const storeData = {
      data,
      expired,
    };
    localStorage.setItem(name, JSON.stringify(storeData));
  },
  get(name) {
    let storeData = JSON.parse(localStorage.getItem(name));
    if (storeData) {
      let now = Date.now();
      if (storeData.expired && storeData.expired - now > 0) {
        return storeData.data;
      }
      return;
    }
  },
  remove(name) {
    localStorage.removeItem(name);
  },
};

export const sessionStorageCache = {
  set(name, data, expired) {
    const storeData = {
      data,
      expired,
    };
    sessionStorageCache.setItem(name, JSON.stringify(storeData));
  },
  get(name) {
    let storeData = JSON.parse(sessionStorageCache.getItem(name));
    if (storeData) {
      let now = Date.now();
      if (storeData.expired && storeData.expired - now > 0) {
        return storeData.data;
      }
      return;
    }
  },
  remove(name) {
    sessionStorageCache.removeItem(name);
  },
};
