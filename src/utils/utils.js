import { useDisplay } from "vuetify/lib/framework";

export function isSmallScreen() {
  const display = useDisplay();
  return display.smAndDown.value;
}

export function formatProducts(product) {
  return {
    ...product,
    authors: product.authors.map((author) => author.name).join(", "),
    contentOf: product.contentOf ? "Yes" : "No",
    partOfSale: product.partOfSale ? "Yes" : "No",
  };
}

export const navigateToItemDetails = (
  router,
  collection,
  item,
  routePrefix
) => {
  const rowIndex = item.currentTarget.rowIndex - 1;
  const itemData = collection.value[rowIndex];
  router.push(`/${routePrefix}/${itemData.id}`);
};
