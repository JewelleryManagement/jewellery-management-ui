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
