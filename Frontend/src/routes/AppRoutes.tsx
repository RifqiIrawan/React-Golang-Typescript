import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import User from "../pages/master/User";
import Produk from "../pages/master/Produk";
import Karyawan from "../pages/master/Karyawan";
import Report from "../pages/laporan/Report";

export default function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/user"
        element={
          <MainLayout>
            <User />
          </MainLayout>
        }
      />

      <Route
        path="/produk"
        element={
          <MainLayout>
            <Produk />
          </MainLayout>
        }
      />

      <Route
        path="/karyawan"
        element={
          <MainLayout>
            <Karyawan />
          </MainLayout>
        }
      />

      <Route
        path="/laporan"
        element={
          <MainLayout>
            <Report />
          </MainLayout>
        }
      />

    </Routes>
  );
}