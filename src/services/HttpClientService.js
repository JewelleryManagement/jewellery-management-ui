import axios from "@/axios.config";
import store from "@/store/store";
import router from "@/router/index";

// GET REQUESTS
async function fetchData(endpoint, options = {}) {
  try {
    const response = await axios.get(endpoint, options);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      store.dispatch("auth/logout");
      router.push("/login");
    }

    throw new Error("Failed to fetch data from the server.");
  }
}
export async function fetchResources() {
  return await fetchData("/resources/quantity");
}

export async function fetchResourcePerUser(userId) {
  return await fetchData(`/resources/availability/${userId}`);
}

export async function fetchAvailabilityResourceById(resourceId) {
  return await fetchData(`/resources/availability/by-resource/${resourceId}`);
}

export async function fetchQuantityByResourceId(resourceId) {
  return await fetchData(`/resources/quantity/${resourceId}`);
}

export async function fetchProducts() {
  return await fetchData("/products");
}

export async function fetchPicture(productId) {
  const options = {
    responseType: "blob",
  };

  return await fetchData(`/products/${productId}/picture`, options);
}

export async function fetchProductsByOwner(ownerId) {
  return await fetchData(`/products/by-owner/${ownerId}`);
}

export async function fetchUsers() {
  return await fetchData("/users");
}

export async function fetchSales() {
  return await fetchData("/sales");
}

// POSTS REQUESTS
async function postData(endpoint, data, customHeaders = {}) {
  const response = await axios.post(endpoint, data, {
    headers: customHeaders,
  });
  if (response.status === 201) return response.data;
}

export async function postResources(data) {
  return await postData("/resources", data);
}

export async function postResourceAvailability(data) {
  return await postData("/resources/availability", data);
}

export async function postResourceAvailabilityTransfer(data) {
  return await postData("/resources/availability/transfer", data);
}

export async function postProduct(data) {
  return await postData("/products", data);
}

export async function postUserLogin(user) {
  return await postData("/login", user);
}
export async function postSale(data) {
  return await postData("/sales", data);
}
export async function postUser(userData) {
  return await postData("/users", userData);
}

export async function postPicture(productId, image) {
  const formData = new FormData();
  formData.append("image", image[0]);

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  return await postData(`/products/${productId}/picture`, formData, headers);
}

// DELETE REQUESTS

async function removeData(endpoint) {
  const response = await axios.delete(endpoint);
  if (response.status === 200) return response.data;
}

export async function removeResource(id) {
  return await removeData(`/resources/${id}`);
}

export async function removeResourceQuantity(userId, resourceId, quantity) {
  return await removeData(
    `/resources/availability/${userId}/${resourceId}/${quantity}`
  );
}

export async function disassmebleProduct(productId) {
  return await removeData(`/products/${productId}`);
}

// PUT REQUEST

async function updateData(endpoint, data) {
  const response = await axios.put(endpoint, data);
  if (response.status === 200) return response.data;
}

export async function updateResource(id, data) {
  return await updateData(`/resources/${id}`, data);
}

export async function updateUser(id, userData) {
  return await updateData(`/users/${id}`, userData);
}

export async function transferProduct(productId, recipientId) {
  return await updateData(`/products/${productId}/transfer/${recipientId}`);
}

export async function saleReturn(productId) {
  return await updateData(`/sales/return-product/${productId}`);
}
