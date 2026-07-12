export default function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4"
      style={{ height: "74px" }}
    >
      <div className="container-fluid">

        <span
          className="navbar-brand fw-bold fs-4"
        >
          React ERP
        </span>

        <div className="dropdown ms-auto">

          <button
            className="btn btn-primary dropdown-toggle border-0"
            data-bs-toggle="dropdown"
          >
            <i className="bi bi-person-circle me-2"></i>
            Admin
          </button>

          <ul className="dropdown-menu dropdown-menu-end">

            <li>
              <a className="dropdown-item" href="#">
                Profile
              </a>
            </li>

            <li>
              <a className="dropdown-item" href="#">
                Logout
              </a>
            </li>

          </ul>

        </div>

      </div>
    </nav>
  );
}