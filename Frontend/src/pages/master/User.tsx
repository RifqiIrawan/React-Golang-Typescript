
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "../../components/table/DataTable";
import UserFormModal from "../../components/user/UserFormModal";
import type { User } from "../../types/user";

export default function User(){

    const [data, setData] = useState<User[]>([
        { id: 1, nama: "Admin", email: "admin@mail.com", role: "Administrator", status: "Aktif" },
        { id: 2, nama: "Rifqi", email: "rifqi@mail.com", role: "User", status: "Aktif" },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleAdd = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm("Yakin ingin menghapus data ini?")) {
            setData(data.filter(u => u.id !== id));
        }
    };

    const handleSave = (formData: Omit<User, "id">) => {
        if (editingUser) {
            setData(data.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
        } else {
            const newId = data.length ? Math.max(...data.map(u => u.id)) + 1 : 1;
            setData([...data, { id: newId, ...formData }]);
        }
        setShowModal(false);
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