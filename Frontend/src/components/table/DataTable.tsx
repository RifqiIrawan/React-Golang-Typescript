import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";

import "./DataTable.css";

type Props<T> = {
    data: T[];
    columns: ColumnDef<T>[];
};

export default function DataTable<T>({
    data,
    columns,
}: Props<T>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    });

    return (
        <div className="card dt-card">

            <div className="dt-toolbar d-flex justify-content-end">
                <select
                    className="form-select form-select-sm dt-select w-auto"
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>{size} baris</option>
                    ))}
                </select>
            </div>

            <div className="table-responsive">
                <table className="table dt-table align-middle">

                    <thead>

                        {table.getHeaderGroups().map(headerGroup => (

                            <tr key={headerGroup.id}>

                                {headerGroup.headers.map(header => (

                                    <th key={header.id}>

                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}

                                    </th>

                                ))}

                            </tr>

                        ))}

                    </thead>

                    <tbody>

                        {table.getRowModel().rows.map(row => (

                            <tr key={row.id}>

                                {row.getVisibleCells().map(cell => (

                                    <td key={cell.id}>

                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}

                                    </td>

                                ))}

                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>

            <div className="dt-footer d-flex justify-content-between align-items-center">
                <small className="text-muted">
                    Menampilkan {table.getRowModel().rows.length} dari {data.length} data
                </small>

                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        className="dt-nav-btn"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>

                    <span className="dt-page-pill">
                        {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
                    </span>

                    <button
                        type="button"
                        className="dt-nav-btn"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

        </div>
    );
}
