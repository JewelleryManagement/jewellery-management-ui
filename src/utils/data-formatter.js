export function formatProducts(product) {
  return {
    ...product,
    salePrice: `${(product.salePrice).toFixed(2)}`
  };
}