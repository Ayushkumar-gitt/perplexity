import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: `${API_URL}/auth`,
    withCredentials: true
})
export async function register({username,email,password}) {
    const response = await api.post("/register",{username,email,password})
    return response.data
}
export async function login({ email, password }) {
    const response = await api.post("/login", { email, password})
    return response.data
}

export async function getme() {
    const response = await api.get("/getme")
    return response.data
}

export async function logout() {
    const response = await api.post("/logout")
    return response.data
}
