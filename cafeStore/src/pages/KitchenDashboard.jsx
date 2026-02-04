import React, { use } from 'react'
import { useEffect, useState } from "react";
import { connectKitchenSocket } from "../websocket/kitchenSocket"
import {getTodayOrderByReady,readyOrder} from "../api/orderApi"

const KitchenDashboard = () => {

  const [notifications, setNotifications] = useState([]);
  const [order, setorder] = useState([]);

  useEffect(() => {
    connectKitchenSocket((data) => {
      setNotifications(prev => [data, ...prev]);
    });
  }, []);

  const fetchOrders = async () => {
      try {
        const orders = await getTodayOrderByReady(false);
        setorder(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

  useEffect(() => {
     fetchOrders();
  }, [notifications]);


  return (
    <div className='bg-gray-50 min-h-screen m-6'>
      <h1 className='text-xl text-black font-bold text-center'>Kitchen Dashboard</h1>

      <div className="bg-white rounded-xl shadow p-4 mb-6 mt-2">
        <h2 className="font-semibold mb-2">🔔 Live Notifications</h2>

        {notifications.length === 0 && (
          <p className="text-gray-500">No new notifications</p>
        )}

        <ul className="space-y-2 max-h-40 overflow-y-auto">
          {notifications.map((n, i) => (
            <li
              key={i}
              className="text-sm bg-green-50 border-l-4 border-green-500 p-2 rounded"
            >

              New Order Received:
              {n.order.items
                .map(item => `${item.menu.name} (${item.quantity})`)
                .join(", ")}

                | Waiter : {n.waiterName}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-xl shadow p-4 ">
        <h2 className="font-semibold mb-4 text-md"> Orders to Prepare</h2>
        {order.length === 0 ? (
          <p className="text-gray-500">No orders to prepare</p>
        ) : (
          <ul className="space-y-4">
            {order.map((o) => (
              <li key={o.id} className="border-b pb-2">
                <p className="font-medium">Order ID: {o.id}</p>
                <p className="text-sm text-gray-600">
                  Items:{" "}
                  {o.items.map((item) => `${item.menu.name} (${item.quantity})`).join(", ")}
                </p>
                <button
                  onClick={() => readyOrder(o.id).then(() => {fetchOrders()})}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold
             hover:bg-green-700 active:bg-green-800
             transition duration-200 shadow-md"
                >
                  Ready
                </button>

              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}

export default KitchenDashboard