import { useState } from "react";
import MenuManager from "../component/MenuManager";
import TableManager from "../component/TableManager";
import WaiterManager from "../component/WaiterManager";
import OrderManager from "../component/OrderManager";

export default function AdminDashboard() {
  const [active, setActive] = useState("menu");

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
           ADMIN DASHBOARD
        </h1>

        <button
          onClick={() => setActive("menu")}
          className={`w-full text-left px-4 py-2 mb-2 rounded cursor-pointer
            ${active === "menu"
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100"}`}
        >
          Manage Menu
        </button>

        <button
          onClick={() => setActive("table")}
          className={`w-full text-left px-4 py-2 mb-2 rounded cursor-pointer
            ${active === "table"
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100"}`}
        >
          Manage Tables
        </button>

        <button
          onClick={() => setActive("waiter")}
          className={`w-full text-left px-4 py-2 rounded cursor-pointer
            ${active === "waiter"
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100"}`}
        >
           Manage Waiters
        </button>
        <button
          onClick={() => setActive("order")}
          className={`w-full text-left px-4 py-2 rounded cursor-pointer
            ${active === "order"
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100"}`}
        >
           Manage Order
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {active === "menu" && <MenuManager />}
        {active === "table" && <TableManager />}
        {active === "waiter" && <WaiterManager />}
        {active === "order" && <OrderManager />}

      </div>
    </div>
  );
}
