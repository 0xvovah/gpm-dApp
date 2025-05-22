// get data from local storage by key
export const getLocalStorageByKey = (key: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

// get auth data from local storage
export const getAuthData = () => {
  return getLocalStorageByKey("AuthData");
};

// set data to local storage by key and value
export const setLocalStorageByKey = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
  return null;
};

// set auth data to local storage
export const setAuthData = (data: any) => {
  setLocalStorageByKey("AuthData", data);
};

// remove data from local storage by key
export const removeLocalStorageByKey = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
  return null;
};

// set auth data to local storage
export const removeAuthData = () => {
  removeLocalStorageByKey("AuthData");
};
