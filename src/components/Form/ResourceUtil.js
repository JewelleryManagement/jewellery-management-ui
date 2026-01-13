export const setInitialType = (clazz, store, route) => {
  const type = store.getters["resources/getParamsFieldName"](clazz);

  if (type in route.query) {
    store.dispatch("resources/setResourceDetailsField", {
      key: type,
      value: route.query[type],
    });
  }
};

export const getQuery = (resource, store) => {
  return store.getters["resources/getResourceQuery"]({
    clazz: resource.clazz,
    type: resource.type,
    quantityType: resource.quantityType,
  });
};
