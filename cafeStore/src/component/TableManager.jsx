import { useEffect, useState } from "react";
import { getTables, addTable, deleteTable } from "../api/adminApi";

export default function TableManager() {
  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState(null);

  const loadTables = async () => {
    const res = await getTables();
    setTables(res.data);
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleAdd = async () => {
    await addTable(tableNo);
    setTableNo(null);
    loadTables();
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        Table Management
      </h2>

      {/* Add Table Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Table Number"
          value={tableNo}
          onChange={e =>
            setTableNo(e.target.value)
          }
        />

       

        <button
          onClick={handleAdd}
          disabled={!tableNo}
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2
                     cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Table
        </button>
      </div>

      {/* Table List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Table No</th>
              <th className="p-3">Qr code</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tables.map(t => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">
                  Table {t.tableNo}
                </td>
                <td className="p-3">
                  <img  className="h-40 w-40"  src={t.qrUrl} alt={t.tableNo} />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteTable(t.id).then(loadTables)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tables.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No tables available
          </p>
        )}
      </div>
    </div>
  );
}
