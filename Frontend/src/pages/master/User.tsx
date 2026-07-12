import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components/table/DataTable";
import UserFormModal from "../../components/user/UserFormModal";
import type { User } from "../../types/user";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/userService";

export default function User(){

    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const users = await getUsers();
            setData(users);
        } catch (err) {
            console.error("Gagal memuat data user:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleAdd = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;
        try {
            await deleteUser(id);
            await loadUsers();
        } catch (err) {
            console.error("Gagal menghapus user:", err);
        }
    };

    const handleSave = async (formData: Omit<User, "id">) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData);
            } else {
                await createUser(formData);
            }
            setShowModal(false);
            await loadUsers();
        } catch (err) {
            console.error("Gagal menyimpan user:", err);
        }
    };

    const columns: ColumnDef<User>[] = [

        {
            header: "No",
            cell: info => info.row.index + 1
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
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(row.original)}>
                        Edit
                    </button>

                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row.original.id)}>
                        Delete
                    </button>
                </>
            )
        }

    ];

    if (loading) {
        return <p>Memuat data...</p>;
    }

    return(
        <>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={handleAdd}>
                    + Tambah Data
                </button>
            </div>

            <DataTable
                data={data}
                columns={columns}
            />

            <UserFormModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onSubmit={handleSave}
                initialData={editingUser}
            />
        </>
    )

}