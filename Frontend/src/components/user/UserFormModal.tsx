import { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import type { User } from "../../types/user";

type Props = {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: Omit<User, "id">) => void;
    initialData?: User | null;
};

export default function UserFormModal({ show, onHide, onSubmit, initialData }: Props) {
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("User");
    const [status, setStatus] = useState("Aktif");

    useEffect(() => {
        if (initialData) {
            setNama(initialData.nama);
            setEmail(initialData.email);
            setRole(initialData.role);
            setStatus(initialData.status);
        } else {
            setNama("");
            setEmail("");
            setRole("User");
            setStatus("Aktif");
        }
    }, [initialData, show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ nama, email, role, status });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{initialData ? "Edit User" : "Tambah User"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            type="text"
                            value={nama}
                            onChange={e => setNama(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="Administrator">Administrator</option>
                            <option value="User">User</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select value={status} onChange={e => setStatus(e.target.value)}>
                            <option value="Aktif">Aktif</option>
                            <option value="Nonaktif">Nonaktif</option>
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Batal</Button>
                    <Button variant="primary" type="submit">Simpan</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}