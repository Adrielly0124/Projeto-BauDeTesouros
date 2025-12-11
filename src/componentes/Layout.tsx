import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../styles/layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bt-layout-column">
      {/* Topbar em cima de tudo */}
      <Topbar />

      <div className="bt-layout-row">
        <Sidebar />

        <div className="bt-page-content">
          {children}
        </div>
      </div>
    </div>
  );
}
