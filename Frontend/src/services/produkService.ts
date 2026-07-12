import axios from "axios";
import type { Produk } from "../types/produk";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export type ProdukListParams = {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
};

export type ProdukListMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ProdukListResponse = {
    data: Produk[];
    meta: ProdukListMeta;
};

export async function getProduk(params: ProdukListParams = {}): Promise<ProdukListResponse> {
    const res = await api.get<ProdukListResponse>("/produk", { params });
    return res.data;
}

export async function createProduk(data: Omit<Produk, "id">): Promise<Produk> {
    const res = await api.post<Produk>("/produk", data);
    return res.data;
}

export async function updateProduk(id: number, data: Omit<Produk, "id">): Promise<Produk> {
    const res = await api.put<Produk>(`/produk/${id}`, data);
    return res.data;
}

export async function deleteProduk(id: number): Promise<void> {
    await api.delete(`/produk/${id}`);
}

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
        return err.response.data.error as string;
    }
    return "Terjadi kesalahan, silakan coba lagi.";
}
