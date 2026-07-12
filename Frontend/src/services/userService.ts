import axios from "axios";
import type { User } from "../types/user";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export type UserListParams = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
};

export type UserListMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type UserListResponse = {
    data: User[];
    meta: UserListMeta;
};

export async function getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    const res = await api.get<UserListResponse>("/users", { params });
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

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
        return err.response.data.error as string;
    }
    return "Terjadi kesalahan, silakan coba lagi.";
}
