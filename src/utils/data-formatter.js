export function formatProducts(product) {
  return {
    ...product,
    salePrice: `${(product.salePrice).toFixed(2)}`
  };
}

export function dateFormatter(date) {

  const selectedDate = new Date(date);
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;

}