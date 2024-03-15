export function dateFormatter(date) {
  if (!date) return;
  const selectedDate = new Date(date);
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}

export function userPropsFormatter(user) {
  const name = (user.firstName || "") + " " + (user.lastName || "");
  return {
    title: name,
    subtitle: user.email,
  };
}

export function mapUserDataToNewData(userData) {
  const newUserData = {};
  Object.keys(userData.value).forEach((key) => {
    if (key === "birthDate") {
      newUserData[key] = dateFormatter(userData.value[key]);
    } else {
      newUserData[key] = userData.value[key];
    }
  });
  return newUserData;
}

export function formatDateForInput(dateString) {
  if (!dateString) return;
  const parts = dateString.split("/");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

export function prepareResourcesContent(resourcesContent = []) {
  return resourcesContent.map((resource) => ({
    id: resource.resource ? resource.resource.id : resource.id,
    quantity: resource.quantity,
  }));
}

export function prepareProductsContent(productsContent) {
  if (!productsContent) return [];
  return productsContent.map((product) => product.id);
}
