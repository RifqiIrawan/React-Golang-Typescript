import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import Swal from "sweetalert2";
import DataTable from "../../components/table/DataTable";
import type { User } from "../../types/user";
import { getUsers, createUser, updateUser, deleteUser, getErrorMessage } from "../../services/userService";

const escapeHtml = (str: string) =>
    str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export default function User(){

    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(searchInput);
            setPage(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getUsers({
                page,
                limit,
                search: searchTerm || undefined,
                role: filterRole || undefined,
                status: filterStatus || undefined,
            });
            setData(res.data);
            setMeta({ total: res.meta.total, totalPages: res.meta.totalPages });
        } catch (err) {
            console.error("Gagal memuat data user:", err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [page, limit, searchTerm, filterRole, filterStatus]);

    const handleRoleChange = (value: string) => {
        setFilterRole(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setFilterStatus(value);
        setPage(1);
    };

    const openUserForm = async (initialData?: User) => {
        const result = await Swal.fire({
            title: initialData ? "Edit User" : "Tambah User",
            html: `
                <div class="text-start">
                    <div class="mb-3">
                        <label class="form-label">Nama</label>
                        <input id="swal-nama" class="form-control" value="${escapeHtml(initialData?.nama ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input id="swal-email" type="email" class="form-control" value="${escapeHtml(initialData?.email ?? "")}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Role</label>
                        <select id="swal-role" class="form-select">
                            <option value="Administrator" ${initialData?.role === "Administrator" ? "selected" : ""}>Administrator</option>
                            <option value="User" ${!initialData || initialData?.role === "User" ? "selected" : ""}>User</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Status</label>
                        <select id="swal-status" class="form-select">
                            <option value="Aktif" ${!initialData || initialData?.status === "Aktif" ? "selected" : ""}>Aktif</option>
                            <option value="Nonaktif" ${initialData?.status === "Nonaktif" ? "selected" : ""}>Nonaktif</option>
                        </select>
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
                const email = (document.getElementById("swal-email") as HTMLInputElement).value.trim();
                const role = (document.getElementById("swal-role") as HTMLSelectElement).value;
                const status = (document.getElementById("swal-status") as HTMLSelectElement).value;

                if (!nama || !email) {
                    Swal.showValidationMessage("Nama dan Email wajib diisi");
                    return false;
                }

                try {
                    if (initialData) {
                        await updateUser(initialData.id, { nama, email, role, status });
                    } else {
                        await createUser({ nama, email, role, status });
                    }
                    return true;
                } catch (err) {
                    Swal.showValidationMessage(getErrorMessage(err));
                    return false;
                }
            },
        });

        if (result.isConfirmed) {
            await loadUsers();
            Swal.fire({
                icon: "success",
                title: initialData ? "User berhasil diperbarui" : "User berhasil ditambahkan",
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
            await deleteUser(id);
            await loadUsers();
            Swal.fire({ icon: "success", title: "User berhasil dihapus" });
        } catch (err) {
            console.error("Gagal menghapus user:", err);
            setError(getErrorMessage(err));
        }
    };

    const columns: ColumnDef<User>[] = [

        {
            header: "No",
            cell: info => (page - 1) * limit + info.row.index + 1
        },

        {
            accessorKey: "nama",
            header: "Nama"
        },

        {
            accessorKey: "email",
            header: "Email"
        },

        {
            accessorKey: "role",
            header: "Role"
        },

        {
            accessorKey: "status",
            header: "Status"
        },

        {
            header: "Action",

            cell: ({ row }) => (
                <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => openUserForm(row.original)}>
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

                    <select
                        className="form-select form-select-sm w-auto"
                        value={filterRole}
                        onChange={e => handleRoleChange(e.target.value)}
                    >
                        <option value="">Semua Role</option>
                        <option value="Administrator">Administrator</option>
                        <option value="User">User</option>
                    </select>

                    <select
                        className="form-select form-select-sm w-auto"
                        value={filterStatus}
                        onChange={e => handleStatusChange(e.target.value)}
                    >
                        <option value="">Semua Status</option>
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                    </select>
                </div>

                <button className="btn btn-primary" onClick={() => openUserForm()}>
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