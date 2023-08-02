import axios from "@/axios.config";
import { showNotification } from "@/utils/notification.js";
import { ref } from 'vue';

const snackbar = ref({
  isActive: false,
  message: '',
  color: 'success',
  timeout: 3000,
  width: 250
});

const showSnackbar = (message, color, timeout, location = 'bottom cemter') => {
  snackbar.value.isActive = true;
  snackbar.value.color = color;
  snackbar.value.message = message;
  snackbar.value.timeout = timeout;
  snackbar.value.location = location;
};


async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    showNotification("Failed to fetch data from the server: ", "error");
    showSnackbar(
      error,
      "error",
      4000,
      "top right"
    );
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
  return await fetchData("/userss");
}
