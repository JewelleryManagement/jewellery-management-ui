import axios from "@/axios.config";
import { showNotification } from "@/utils/notification.js";

async function fetchData(endpoint) {
    try {
        const response = await axios.get(endpoint);
        if (response.status === 200) {
            showNotification("Successfully retrieved!", "success");
            return response.data;
        }
    } catch (error) {
        console.error("Fetching data failed:", error);
        throw error;
    }
}

export async function fetchResources() {
    return await fetchData("/resources");
}

export async function fetchUsers() {
    return await fetchData("/users");
}

export async function fetchProducts() {
    return await fetchData("/products");
}

export async function fetchSystemEvents() {
    return await fetchData("/systemEvents");
}
