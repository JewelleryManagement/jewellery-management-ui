import axios from "@/axios.config";

export async function fetchUsers() {
    const response = await axios.get("/users");
    try {
        if (response.status === 200) {
            console.log("Users successfully retrieved");
            return response.data
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
}