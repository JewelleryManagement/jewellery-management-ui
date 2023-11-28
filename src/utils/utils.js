import { useDisplay } from "vuetify/lib/framework";

export function isSmallScreen() {
  const display = useDisplay();
  return display.smAndDown.value;
}

export function formatProducts(product) {
  return {
    ...product,
    contentOf: product.contentOf ? "Yes" : "No",
    // partOfSale: product.partOfSale ? "Yes" : "No",
  };
}

export const navigateToItemDetails = (
  router,
  collection,
  item,
  routePrefix
) => {
  const clickedRow = item.currentTarget;
  const id = clickedRow.cells[0].innerText;
  router.push(`/${routePrefix}/${id}`);
};
