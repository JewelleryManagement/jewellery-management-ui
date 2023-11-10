import axios from "@/axios.config";
import store from "@/store/store";
import router from "@/router/index";

// GET REQUESTS
async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
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

export async function fetchProductsByOwner(ownerId) {
  return await fetchData(`/products/by-owner/${ownerId}`);
}

export async function fetchUsers() {
  return await fetchData("/users");
}

// POSTS REQUESTS
async function postData(endpoint, data) {
  try {
    const response = await axios.post(endpoint, data);
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to post data to the server.");
  }
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

// DELETE REQUESTS

async function removeData(endpoint) {
  try {
    await axios.delete(endpoint);
  } catch (error) {
    throw new Error("Failed to delete this resource.");
  }
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
  try {
    const response = await axios.put(endpoint, data);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Failed to update data on the server.");
  }
}

export async function updateResource(id, data) {
  return await updateData(`/resources/${id}`, data);
}

export async function transferProduct(productId, recipientId) {
  return await updateData(`/products/${productId}/transfer/${recipientId}`);
}
