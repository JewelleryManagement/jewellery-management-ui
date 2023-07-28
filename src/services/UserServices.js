import axios from "@/axios.config";
import { showNotification } from "@/notification.js";

export async function fetchUsers() {
    const response = await axios.get("/users");
    try {
        if (response.status === 200) {
            showNotification("Users successfully retrieved!", "success");
            return response.data
        }
    } catch (error) {
        showNotification("Login failed: " + error, "error");
    }
}