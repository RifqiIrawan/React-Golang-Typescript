import type { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-grow-1 d-flex flex-column min-vh-100">

        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow-1 bg-light p-4">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </div>

    </div>
  );
}