import { useState } from "react";
import axios from "axios";
import { getAllOrders ,getOrdersByCustomDateRange,getOrdersByCustomDateRangeAndWaiterId } from "../api/orderApi";

export default function OrderManager() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [waiterId, setWaiterId] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

     

      
      if (!fromDate && !toDate && !waiterId) {
        const data = await getAllOrders();
        setOrders(data);
        return;
      }

      
      else if (fromDate && toDate && !waiterId) {
        const data = await getOrdersByCustomDateRange(fromDate , toDate);
        setOrders(data);
        return;
      }

      
      else if (fromDate && toDate && waiterId) {
        const data = await getOrdersByCustomDateRangeAndWaiterId(fromDate , toDate, waiterId);
        setOrders(data);
        return;
      }

      else {
        setError("Please select both From and To dates");
        return;
      }

      
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6"> Order Report</h1>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Waiter ID (optional)"
          value={waiterId}
          onChange={(e) => setWaiterId(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={fetchOrders}
          className="bg-green-600 hover:bg-green-700 text-white rounded px-4"
        >
          Fetch Orders
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mt-4 bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {/* RESULTS */}
      <div className="mt-6 bg-white p-4 rounded shadow">
        {loading && <p>Loading...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-gray-500">No orders found</p>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            className="border-b py-3 flex justify-between"
          >
            <div>
              <p className="font-semibold">Contact Info: {order.contactInfo}</p>  
              <p className="font-semibold">Table: {order.tableId}</p>
              <p className="text-sm text-gray-600">
                Waiter: {order.waiterId || "N/A"}
              </p>
              <p className="text-sm">
                Date: {order.createdAt}
              </p>
            </div>

            <div className="font-bold">
              ₹{order.totalAmount}
            </div>
          </div>
        ))}

        {/* TOTAL */}
        {orders.length > 0 && (
          <div className="mt-4 text-right text-lg font-bold">
            Total Amount: ₹{totalAmount}
          </div>
        )}
      </div>
    </div>
  );
}
