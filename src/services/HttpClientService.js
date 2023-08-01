import axios from "@/axios.config";

async function fetchData(endpoint) {
    try {
        const response = await axios.get(endpoint);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
}

export async function fetchResources() {
    return await fetchData("/resources");
}

export async function fetchProducts() {
    return await fetchData("/products");
}

export async function fetchSystemEvents() {
    return await fetchData("/systemEvents");
}
