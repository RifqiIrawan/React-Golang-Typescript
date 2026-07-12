import { useEffect, useRef } from "react";
import $ from "jquery";

import "datatables.net-bs5";
import "datatables.net-responsive-bs5";

export default function UserTable() {
const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;

    const table = $(tableRef.current).DataTable({
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      responsive: true,
      pageLength: 10,
      destroy: true,
    });

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <table ref={tableRef} className="table table-bordered table-hover">
      <thead>
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Deskripsi</th>
          <th>Harga</th>
          <th>Stock</th>
          <th>Action</th>
        </tr>
      </thead>

        <tbody>
            <tr>
                <td>1</td>
                <td>Admin</td>
                <td>admin@mail.com</td>
                <td>Administrator</td>
                <td>Aktif</td>
                <td>
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>

            <tr>
                <td>2</td>
                <td>Rifqi</td>
                <td>rifqi@mail.com</td>
                <td>User</td>
                <td>Aktif</td>
                <td>
                    <button className="btn btn-warning btn-sm me-2">Edit</button>
                    <button className="btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>
        </tbody>
    </table>
  );
}