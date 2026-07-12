import { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import type { Karyawan } from "../../types/karyawan";

type Props = {
    show: boolean;
    onHide: () => void;
    onSubmit: (data: Omit<Karyawan, "id">) => void;
    initialData?: Karyawan | null;
    error?: string | null;
    submitting?: boolean;
};

export default function KaryawanFormModal({ show, onHide, onSubmit, initialData, error, submitting = false }: Props) {
    const [nik, setNik] = useState("");
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [tanggalLahir, setTanggalLahir] = useState("");

    useEffect(() => {
        if (initialData) {
            setNik(initialData.nik);
            setNama(initialData.nama);
            setAlamat(initialData.alamat);
            setTanggalLahir(initialData.tanggalLahir);
        } else {
            setNik("");
            setNama("");
            setAlamat("");
            setTanggalLahir("");
        }
    }, [initialData, show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ nik: nik.trim(), nama: nama.trim(), alamat: alamat.trim(), tanggalLahir: tanggalLahir });
    };

    return (
        <Modal show={show} onHide={submitting ? undefined : onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!submitting}>
                    <Modal.Title>{initialData ? "Edit Karyawan" : "Tambah Karyawan"}</Modal.Title>
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
                        <Form.Label>Alamat</Form.Label>
                        <Form.Control
                            type="text"
                            value={alamat}
                            onChange={e => setAlamat(e.target.value)}
                            required
                            disabled={submitting}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tanggal Lahir</Form.Label>
                        <Form.Control
                            type="date"
                            value={tanggalLahir}
                            onChange={e => setTanggalLahir(e.target.value)}
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