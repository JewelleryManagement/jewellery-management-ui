import axios from "@/axios.config";
import { showNotification } from "@/utils/notification.js";

async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    showNotification("Failed to fetch data from the server: ", "error");
    return []
  }
}

export async function fetchResources() {
  return await fetchData("/resources");
}

export async function fetchProducts() {
  return await fetchData("/products");
}

export async function fetchUsers() {
  return await fetchData("/users");
}
