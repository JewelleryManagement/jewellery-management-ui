import axios from "@/axios.config";


async function fetchData(endpoint) {
  try {
    const response = await axios.get(endpoint);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {    
    throw new Error("Failed to fetch data from the server.");    
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
