export const createBrowserStorage = <T>() => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    } as Storage;
  }
  return window.localStorage;
};
