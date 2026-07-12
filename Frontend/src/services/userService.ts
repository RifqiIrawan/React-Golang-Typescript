import axios from "axios";
import type { User } from "../types/user";

const api = axios.create({
    baseURL: "http://localhost:8082/api",
});

export async function getUsers(): Promise<User[]> {
    const res = await api.get<User[]>("/users");
    return res.data;
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
    const res = await api.post<User>("/users", data);
    return res.data;
}

export async function updateUser(id: number, data: Omit<User, "id">): Promise<User> {
    const res = await api.put<User>(`/users/${id}`, data);
    return res.data;
}

export async function deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
}