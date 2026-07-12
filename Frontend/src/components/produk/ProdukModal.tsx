type Props = {
    show: boolean;
    onClose: () => void;
};

export default function UserModal({
    show,
    onClose,
}: Props) {

    if (!show) return null;

    return (

        <div
            className="modal fade show d-block"
            style={{
                background: "rgba(0,0,0,.5)",
            }}
        >

            <div className="modal-dialog">

                <div className="modal-content">

                    <div className="modal-header">

                        <h5>Tambah Produk</h5>

                        <button
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    <div className="modal-body">

                        <div className="mb-3">

                            <label>Nama Produk</label>

                            <input
                                className="form-control"
                            />

                        </div>

                        <div className="mb-3">

                            <label>Deskripsi</label>

                            <input
                                type="text"
                                className="form-control"
                            />

                        </div>

                        <div className="mb-3">

                            <label>Harga</label>

                            <input
                                type="number"
                                className="form-control"
                            />

                        </div>

                        <div className="mb-3">

                            <label>Stock</label>

                            <input
                                type="number"
                                className="form-control"
                            />

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Batal
                        </button>

                        <button className="btn btn-primary">

                            Simpan

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}