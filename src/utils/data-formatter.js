export function formatProducts(product) {
  return {
    ...product,
    contentOf: product.contentOf ? "Yes" : "No",
    salePrice: `${(product.salePrice).toFixed(2)}`
  };
}