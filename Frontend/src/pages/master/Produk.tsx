import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import DataTable from "../../components/table/DataTable";
import type { Produk } from "../../types/produk";
import { getProduk, createProduk, updateProduk, deleteProduk, getErrorMessage } from "../../services/produkService";

const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export default function Produk(){

    const [data, setData] = useState<Produk[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const loadProduk = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getProduk({
                page,
                limit,
                search: searchTerm || undefined,                
            });
            setData(res.data);
            setMeta({ total: res.meta.total, totalPages: res.meta.totalPages });
        } catch (err) {
            console.error("Gagal memuat data produk:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProduk();
    }, [page, limit, searchTerm]);

    const handleRoleChange = (value: string) => {
        setFilterRole(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setFilterStatus(value);
        setPage(1);
    };

    const openProdukForm = async (initialData?: Produk) => {
        const result = await Swal.fire({
            title: initialData ? "Edit Produk" : "Tambah Produk",
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label class="form-label">Nama</label>
                        <input id="swal-nama" class="form-control" value="${escapeHtml(initialData?.nama ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Deskripsi</label>
                        <input id="swal-deskripsi" class="form-control" value="${escapeHtml(initialData?.deskripsi ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Harga</label>
                        <input id="swal-harga" class="form-control" type="number" value="${escapeHtml(initialData?.harga?.toString() ?? "0")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Stock</label>
                        <input id="swal-stock" class="form-control" type="number" value="${escapeHtml(initialData?.stock?.toString() ?? "0")}">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Simpan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#0d6efd",
            allowOutsideClick: () => !Swal.isLoading(),
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const nama = (document.getElementById("swal-nama") as HTMLInputElement).value.trim();
                const deskripsi = (document.getElementById("swal-deskripsi") as HTMLInputElement).value.trim();
                const harga = (document.getElementById("swal-harga") as HTMLInputElement).value;
                const stock = (document.getElementById("swal-stock") as HTMLInputElement).value;

                if (!nama || !deskripsi) {
                    Swal.showValidationMessage("Nama dan Deskripsi wajib diisi");
                    return false;
                }

                try {
                    if (initialData) {
                        await updateProduk(initialData.id, { nama, deskripsi, harga: parseFloat((document.getElementById("swal-harga") as HTMLInputElement).value), stock: parseInt((document.getElementById("swal-stock") as HTMLInputElement).value) });
                    } else {
                        await createProduk({ nama, deskripsi, harga: parseFloat((document.getElementById("swal-harga") as HTMLInputElement).value), stock: parseInt((document.getElementById("swal-stock") as HTMLInputElement).value) });
                    }
                    return true;
                } catch (err) {
                    Swal.showValidationMessage(getErrorMessage(err));
                    return false;
                }
            },
        });

        if (result.isConfirmed) {
            await loadProduk();
            Swal.fire({
                icon: "success",
                title: initialData ? "Produk berhasil diperbarui" : "Produk berhasil ditambahkan",
            });
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Yakin ingin menghapus data ini?",
            text: "Data yang sudah dihapus tidak bisa dikembalikan.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
        });

        if (!result.isConfirmed) return;

        try {
            setError(null);
            await deleteProduk(id);
            await loadProduk();
            Swal.fire({ icon: "success", title: "Produk berhasil dihapus" });
        } catch (err) {
            console.error("Gagal menghapus produk:", err);
            setError(getErrorMessage(err));
        }
    };

    const columns: ColumnDef<Produk>[] = [

        {
            header: "No",
            cell: info => (page - 1) * limit + info.row.index + 1
        },

        {
            accessorKey: "nama",
            header: "Nama"
        },

        {
            accessorKey: "deskripsi",
            header: "Deskripsi"
        },

        {
            accessorKey: "harga",
            header: "Harga"
        },

        {
            accessorKey: "stock",
            header: "Stock"
        },

        {
            header: "Action",

            cell: ({ row }) => (
                <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => openProdukForm(row.original)}>
                        Edit
                    </button>

                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.original.id)}>
                        Delete
                    </button>
                </>
            )
        }

    ];

    if (loading && data.length === 0) {
        return <p>Memuat data...</p>;
    }

    return(
        <>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div className="d-flex flex-wrap gap-2">
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        style={{ width: "220px" }}
                        placeholder="Cari nama atau email..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />

                </div>

                <button className="btn btn-primary" onClick={() => openProdukForm()}>
                    + Tambah Data
                </button>
            </div>

            <DataTable
                data={data}
                columns={columns}
                pageIndex={page - 1}
                pageCount={meta.totalPages}
                pageSize={limit}
                totalRows={meta.total}
                onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
                onPageSizeChange={(size) => { setLimit(size); setPage(1); }}
            />
        </>
    )

}