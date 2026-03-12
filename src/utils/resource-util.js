import { handleNotFound } from "./action-guard";

export const setInitialType = (clazz, resourcesStore, route) => {
  const type = resourcesStore.getParamsFieldName(clazz);

  if (type in route.query) {
    resourcesStore.setResourceDetailsField({
      key: type,
      value: route.query[type],
    });
  }
};

export const getQuery = (resource, resourcesStore) => {
  return resourcesStore.getResourceQuery({
    clazz: resource.clazz,
    type: resource.type,
    quantityType: resource.quantityType,
  });
};

export const confirmDeleteResource = async (
  resourcesStore,
  router,
  id,
  snackbarProvider,
) => {
  const confirmation = window.confirm(
    "Are you sure that you would like to delete this item?",
  );

  if (!confirmation) return false;

  try {
    await resourcesStore.removeResource(id);

    snackbarProvider.showSuccessSnackbar("Resource deleted successfully!");

    return true;
  } catch (error) {
    if (await handleNotFound(router, error, "Resource")) return;

    snackbarProvider.showErrorSnackbar(
      error?.response?.data?.error || "Failed to delete resource",
    );

    return false;
  }
};
