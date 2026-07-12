import axios from "axios";
import type { Karyawan } from "../types/karyawan";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export type KaryawanListParams = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
};

export type KaryawanListMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type KaryawanListResponse = {
    data: Karyawan[];
    meta: KaryawanListMeta;
};

export async function getKaryawan(params: KaryawanListParams = {}): Promise<KaryawanListResponse> {
    const res = await api.get<KaryawanListResponse>("/karyawan", { params });
    return res.data;
}

export async function createKaryawan(data: Omit<Karyawan, "id">): Promise<Karyawan> {
    const res = await api.post<Karyawan>("/karyawan", data);
    return res.data;
}

export async function updateKaryawan(id: number, data: Omit<Karyawan, "id">): Promise<Karyawan> {
    const res = await api.put<Karyawan>(`/karyawan/${id}`, data);
    return res.data;
}

export async function deleteKaryawan(id: number): Promise<void> {
    await api.delete(`/karyawan/${id}`);
}

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
        return err.response.data.error as string;
    }
    return "Terjadi kesalahan, silakan coba lagi.";
}
