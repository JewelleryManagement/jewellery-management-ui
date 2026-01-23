export const navigateToItemDetails = (router, routeName, paramKey, id) => {
  router.push({
    name: routeName,
    params: {
      [paramKey]: id,
    },
  });
};
