import axios from "@/axios.config";

export async function getUsers() {
    const response = await axios.get('/users', {
        
    })
    try {
        if (response.status === 200) {
            console.log('Users successfully retrieved')
        }
    } catch (error) {
        console.error('Login failed:', error)
    }
}