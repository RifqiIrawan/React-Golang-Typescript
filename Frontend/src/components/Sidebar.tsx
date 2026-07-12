import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {

    const [masterOpen, setMasterOpen] = useState(false);
    const [trxOpen, setTrxOpen] = useState(false);
    const [lapOpen, setLapOpen] = useState(false);

    return (

        <div className="sidebar">

            <div className="sidebar-title">

                React ERP

            </div>

            <ul className="nav flex-column mt-3">

                <li>

                    <NavLink
                        to="/"
                        end
                        className={({isActive})=>isActive?"nav-link active":"nav-link"}>

                        <i className="bi bi-speedometer2 me-2"></i>

                        Dashboard

                    </NavLink>

                </li>

                <li>

                    <button
                        className="btn sidebar-btn"
                        onClick={()=>setMasterOpen(!masterOpen)}>

                        <i className="bi bi-folder me-2"></i>

                        Master

                        <i className={`bi ${masterOpen ? "bi-chevron-down":"bi-chevron-right"} ms-auto`}></i>

                    </button>

                </li>

                {
                    masterOpen &&

                    <>

                        <NavLink to="/user" className="submenu">

                            User

                        </NavLink>

                        <NavLink to="/produk" className="submenu">

                            Produk

                        </NavLink>

                        <NavLink to="/karyawan" className="submenu">

                            Karyawan

                        </NavLink>

                    </>

                }

                <li>

                    <button
                        className="btn sidebar-btn"
                        onClick={()=>setTrxOpen(!trxOpen)}>

                        <i className="bi bi-cart me-2"></i>

                        Transaksi

                        <i className={`bi ${trxOpen ? "bi-chevron-down":"bi-chevron-right"} ms-auto`}></i>

                    </button>

                </li>

                {
                    trxOpen &&

                    <>

                        <NavLink to="/penjualan" className="submenu">

                            Penjualan

                        </NavLink>

                        <NavLink to="/pembelian" className="submenu">

                            Pembelian

                        </NavLink>

                    </>

                }

            </ul>

        </div>

    )

}