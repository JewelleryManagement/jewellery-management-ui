export const navigateToItemDetails = (router, item, routePrefix) => {
  const clickedRow = item.currentTarget;
  const id = clickedRow.cells[0].innerText;
  router.push(`/${routePrefix}/${id}`);
};
