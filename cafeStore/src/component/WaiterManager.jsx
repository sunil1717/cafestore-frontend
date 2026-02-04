import { useEffect, useState } from "react";
import {
  getWaiters,
  addWaiter,
  deleteWaiter
} from "../api/adminApi";

export default function WaiterManager() {
  const [waiters, setWaiters] = useState([]);
  const [waiter, setWaiter] = useState({
    name: "",
    phoneNumber: "",
    password: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const loadWaiters = async () => {
    const res = await getWaiters();
    setWaiters(res.data);
  };

  useEffect(() => {
    loadWaiters();
  }, []);


  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  const handleAdd = async () => {

    const formData = new FormData();
    formData.append(
      "waiter",
      new Blob(
        [JSON.stringify(waiter)],
        { type: "application/json" }
      )
    );

    formData.append("profilePic", image);

    await addWaiter(formData);

    setWaiter({ name: "", phoneNumber: "", password: "" });
     setImage(null);
    setPreview(null);
    loadWaiters();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        Waiter Management
      </h2>

      {/* Add Waiter Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Full Name"
          value={waiter.name}
          onChange={e => setWaiter({ ...waiter, name: e.target.value })}
        />

        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Phone No"
          value={waiter.phoneNumber}
          onChange={e => setWaiter({ ...waiter, phoneNumber: e.target.value })}
        />

        <input
          type="password"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          value={waiter.password}
          onChange={e => setWaiter({ ...waiter, password: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          className="border rounded px-3 py-2"
          onChange={(e) => {
            const file = e.target.files[0];
            setImage(file);

            if (file) {
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
        {preview && (
          <div className="mb-6 flex items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <span className="text-sm text-gray-600">
              Image Preview
            </span>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={!waiter.name || !waiter.phoneNumber || !waiter.password || !image}
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2
                     cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Waiter
        </button>
      </div>

      {/* Waiter List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">phoneNumber</th>
              <th className="p-3">profilePic</th>
              <th className="p-3">todayServedOrders</th>
              <th className="p-3">rating</th>
              <th className="p-3">Status</th>



              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {waiters.map(w => (
              <tr key={w.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{w.name}</td>
                <td className="p-3">{w.phoneNumber}</td>
                <td className="p-3">
                  <img  className="w-20 h-20" src={w.profilePic} alt={w.name} />
                </td>
                <td className="p-3">{w.todayServedOrders}</td>
                <td className="p-3">{w.rating}</td>

                

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold
                      ${w.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"}`}
                  >
                    {w.available ? "Free" : "Busy"}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => deleteWaiter(w.id).then(loadWaiters)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {waiters.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No waiters found
          </p>
        )}
      </div>
    </div>
  );
}
