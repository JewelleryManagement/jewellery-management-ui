export function formatProducts(product) {
  return {
    ...product,
    salePrice: `${(product.salePrice).toFixed(2)}`
  };
}


export function userPropsFormatter(user) {
  const name = (user.firstName || "") + " " + (user.lastName || "");
  return {
    title: name,
    subtitle: user.email,
  };
}