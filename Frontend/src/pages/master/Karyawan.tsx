import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import DataTable from "../../components/table/DataTable";
import type { Karyawan } from "../../types/karyawan";
import { getKaryawan, createKaryawan, updateKaryawan, deleteKaryawan, getErrorMessage } from "../../services/karyawanService";

const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export default function Karyawan(){

    const [data, setData] = useState<Karyawan[]>([]);
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

    const loadKaryawan = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getKaryawan({
                page,
                limit,
                search: searchTerm || undefined,                
            });
            setData(res.data);
            setMeta({ total: res.meta.total, totalPages: res.meta.totalPages });
        } catch (err) {
            console.error("Gagal memuat data karyawan:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKaryawan();
    }, [page, limit, searchTerm]);

    const handleRoleChange = (value: string) => {
        setFilterRole(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setFilterStatus(value);
        setPage(1);
    };

    const openKaryawanForm = async (initialData?: Karyawan) => {
        const result = await Swal.fire({
            title: initialData ? "Edit Karyawan" : "Tambah Karyawan",
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label class="form-label">NIK</label>
                        <input id="swal-nik" class="form-control" value="${escapeHtml(initialData?.nik ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nama</label>
                        <input id="swal-nama" class="form-control" value="${escapeHtml(initialData?.nama ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Alamat</label>
                        <input id="swal-alamat" class="form-control" value="${escapeHtml(initialData?.alamat ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Tanggal Lahir</label>
                        <input id="swal-tanggallahir" class="form-control" type="date" value="${initialData?.tanggalLahir ? initialData.tanggalLahir.slice(0, 10) : ""}">
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
                const nik = (document.getElementById("swal-nik") as HTMLInputElement).value.trim();
                const nama = (document.getElementById("swal-nama") as HTMLInputElement).value.trim();
                const alamat = (document.getElementById("swal-alamat") as HTMLInputElement).value.trim();
                const tanggalLahirInput = (document.getElementById("swal-tanggallahir") as HTMLInputElement).value;

                if (!nama || !alamat || !tanggalLahirInput) {
                    Swal.showValidationMessage("Nama, Alamat, dan Tanggal Lahir wajib diisi");
                    return false;
                }

                const tanggalLahir = new Date(tanggalLahirInput).toISOString();

                if (!nama || !alamat) {
                    Swal.showValidationMessage("Nama dan Alamat wajib diisi");
                    return false;
                }

                try {
                    if (initialData) {
                        await updateKaryawan(initialData.id, { nik, nama, alamat, tanggalLahir });
                    } else {
                        await createKaryawan({ nik, nama, alamat, tanggalLahir });
                    }
                    return true;
                } catch (err) {
                    Swal.showValidationMessage(getErrorMessage(err));
                    return false;
                }
            },
        });

        if (result.isConfirmed) {
            await loadKaryawan();
            Swal.fire({
                icon: "success",
                title: initialData ? "Karyawan berhasil diperbarui" : "Karyawan berhasil ditambahkan",
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
            await deleteKaryawan(id);
            await loadKaryawan();
            Swal.fire({ icon: "success", title: "Karyawan berhasil dihapus" });
        } catch (err) {
            console.error("Gagal menghapus karyawan:", err);
            setError(getErrorMessage(err));
        }
    };

    const columns: ColumnDef<Karyawan>[] = [

        {
            header: "No",
            cell: info => (page - 1) * limit + info.row.index + 1
        },

         {
            accessorKey: "nik",
            header: "NIK"
        },

        {
            accessorKey: "nama",
            header: "Nama"
        },

        {
            accessorKey: "alamat",
            header: "Alamat"
        },

        {
            accessorKey: "tanggalLahir",
            header: "Tanggal Lahir",
            cell: info => {
                const value = info.getValue<string>();
                return value ? new Date(value).toLocaleDateString("id-ID") : "-";
            }
        },

        {
            header: "Action",

            cell: ({ row }) => (
                <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => openKaryawanForm(row.original)}>
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

                <button className="btn btn-primary" onClick={() => openKaryawanForm()}>
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