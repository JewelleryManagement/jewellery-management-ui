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

export const deleteResource = async (store, id) => {
  const confirmation = window.confirm(
    "Are you sure that you would like to delete this item?",
  );

  if (confirmation) {
    await store.dispatch("resources/removeResource", id);
    return true;
  }
  return false;
};
