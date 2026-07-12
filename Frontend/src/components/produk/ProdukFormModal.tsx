import { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import type { Produk } from "../../types/produk";

type Props = {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: Omit<Produk, "id">) => void;
    initialData?: Produk | null;
    error?: string | null;
    submitting?: boolean;
};

export default function ProdukFormModal({ show, onHide, onSubmit, initialData, error, submitting = false }: Props) {
    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [harga, setHarga] = useState("0");
    const [stock, setStock] = useState("0");

    useEffect(() => {
        if (initialData) {
            setNama(initialData.nama);
            setDeskripsi(initialData.deskripsi);
            setHarga(initialData.harga.toString());
            setStock(initialData.stock.toString());
        } else {
            setNama("");
            setDeskripsi("");
            setHarga("");
            setStock("");
        }
    }, [initialData, show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ nama: nama.trim(), deskripsi: deskripsi.trim(), harga: parseFloat(harga), stock: parseInt(stock) });
    };

    return (
        <Modal show={show} onHide={submitting ? undefined : onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!submitting}>
                    <Modal.Title>{initialData ? "Edit Produk" : "Tambah Produk"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {error && (
                        <Alert variant="danger" className="py-2">
                            {error}
                        </Alert>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Nama</Form.Label>
                        <Form.Control
                            type="text"
                            value={nama}
                            onChange={e => setNama(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Deskripsi</Form.Label>
                        <Form.Control
                            type="text"
                            value={deskripsi}
                            onChange={e => setDeskripsi(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Harga</Form.Label>
                        <Form.Control
                            type="number"
                            value={harga}
                            onChange={e => setHarga(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            type="number"
                            value={stock}
                            onChange={e => setStock(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </Form.Group>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={submitting}>
                        Batal
                    </Button>
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? "Menyimpan..." : "Simpan"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}