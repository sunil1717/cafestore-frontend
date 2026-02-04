import { useEffect, useState } from "react";
import { connectWaiterSocket } from "../websocket/waiterSocket";


import { logoutWaiter } from "../api/waiterApi";
import { useNavigate } from "react-router-dom";
import {
  getOrderByWaiterId,
  getTodayOrderByWaiterIdAndStatusServed,
  servedOrder, getTodayOrderByWaiterIdAndReady,
  getTodayOrderByWaiterIdAndReadyAndStatusCreated
} from "../api/orderApi";
import WaiterProfileSidebar from "../component/WaiterProfileSidebar";

import { FaBars } from "react-icons/fa";


export default function WaiterDashboard() {

  const navigate = useNavigate();

  const waiterData = JSON.parse(localStorage.getItem("waiter"));
  const waiterId = waiterData.id;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("CREATED");
  const [orders, setOrders] = useState([]);


  // 🚪 Logout on unload

  const handleLogout = async () => {
    try {
      await logoutWaiter(waiterId); // backend call
    } catch (e) {
      console.log("Logout API failed, clearing local session");
    }

    localStorage.removeItem("waiter"); // clear session
    navigate("/login"); // redirect
  };

  // 🔔 WebSocket Notifications
  useEffect(() => {
    connectWaiterSocket(waiterId, (data) => {
      setNotifications(prev => [data, ...prev]);
    });
  }, [waiterId]);

  const fetchOrders = async (tab) => {
    let fetchedOrders = [];
    if (tab === "CREATED") {
      fetchedOrders = await getTodayOrderByWaiterIdAndReady(waiterId, false);
    } else if (tab === "READY") {
      fetchedOrders = await getTodayOrderByWaiterIdAndReadyAndStatusCreated(waiterId,true);

    } else if (tab === "SERVED") {
      fetchedOrders = await getTodayOrderByWaiterIdAndStatusServed(waiterId);
    }
    setOrders(fetchedOrders);
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);




  return (

    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* 👤 SIDEBAR */}
      {/* ☰ HAMBURGER */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="absolute top-4 left-4 bg-white p-2 rounded shadow"
      >
        <FaBars size={20} />
      </button>

      {/* SIDEBAR */}
      <WaiterProfileSidebar
        waiter={waiterData}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* 📦 MAIN CONTENT */}
      <div className="text-md  mb-6">
        <div className="bg-gray-100 p-6">

          {/* 🔔 Notifications */}
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <h2 className="font-semibold mb-2">🔔 Live Notifications</h2>

            {notifications.length === 0 && (
              <p className="text-gray-500">No new notifications</p>
            )}

            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {notifications.map((n, i) => (
                <li
                  key={i}
                  className={`text-sm bg-green-50 border-l-4  p-2 rounded ${n.order.ready ? 'border-green-500' : 'border-blue-500'}`}
                >
                  <b>{n.msg}</b> | Table {n.tableNo} <br />
                  {n.order.items
                    .map(item => `${item.menu.name} (${item.quantity})`)
                    .join(", ")}
                </li>
              ))}
            </ul>
          </div>

          {/* 🔘 Tabs */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab("CREATED")}
              className={`px-6 py-2 rounded-full font-semibold ${activeTab === "CREATED"
                ? "bg-blue-600 text-white"
                : "bg-white border"
                }`}
            >
              New Orders
            </button>

            <button
              onClick={() => setActiveTab("READY")}
              className={`px-6 py-2 rounded-full font-semibold ${activeTab === "READY"
                ? "bg-green-600 text-white"
                : "bg-white border"
                }`}
            >
              Ready Orders
            </button>
            <button
              onClick={() => setActiveTab("SERVED")}
              className={`px-6 py-2 rounded-full font-semibold ${activeTab === "SERVED"
                ? "bg-red-400 text-white"
                : "bg-white border"
                }`}
            >
              Served  Orders
            </button>
          </div>

          {/* 📦 Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.length === 0 && (
              <p className="text-center col-span-full text-gray-500">
                No orders found
              </p>
            )}

            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow p-4"
              >
                <p><b>Table:</b> {order.tableNo}</p>
                <p><b>Persons:</b> {order.personCount}</p>

                <p className="mt-2">
                  <b>Items:</b>
                  <br />
                  {order.items
                    .map(item => `${item.menu.name} × ${item.quantity}`)
                    .join(", ")}
                </p>
                <p>Total Amount:{order.totalAmount}</p>

                {/* Action */}
                {activeTab === "READY" && (
                  <button
                    onClick={() => servedOrder(order.id).then(() => fetchOrders(activeTab))}
                    className="w-30 mt-4 bg-blue-600 text-white py-2 rounded-lg
                           hover:bg-blue-700 transition"
                  >
                    Serve Order
                  </button>
                )}


              </div>
            ))}
          </div>
        </div>
      </div>
    </div>








  );
}
