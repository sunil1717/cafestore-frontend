import { useEffect, useState, useRef } from "react";
import {
  getMenus,
  addMenu,
  deleteMenu,
  updateMenuAvailability,
  updateMenuImage
} from "../api/adminApi";
import { FaPencilAlt } from "react-icons/fa";

export default function MenuManager() {
  const [menus, setMenus] = useState([]);
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);



  const handleImageChange = (id, file) => {

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    updateMenuImage(id, formData).then(() => {
      loadMenus();
    });


  };


  const [menu, setMenu] = useState({ name: "", price: "", category: "", description: "" });

  const loadMenus = async () => {
    const res = await getMenus();
    setMenus(res.data);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);


  const handleAdd = async () => {
    const formData = new FormData();

    formData.append(
      "menu",
      new Blob(
        [JSON.stringify(menu)],
        { type: "application/json" }
      )
    );

    formData.append("image", image);

    await addMenu(formData);

    setMenu({ name: "", price: "", category: "", description: "" });
    setImage(null);
    setPreview(null);
    loadMenus();


  };

  return (
    <div className="bg-white rounded-xl shadow p-6">

      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        Menu Management
      </h2>

      {/* Add Menu Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <input
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Menu Name"
          value={menu.name}
          onChange={e => setMenu({ ...menu, name: e.target.value })}
        />

        <input
          type="number"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Price"
          value={menu.price}
          onChange={e => setMenu({ ...menu, price: e.target.value })}
        />

        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={menu.category}
          onChange={e => setMenu({ ...menu, category: e.target.value })}
        >
          <option value="">Select Category</option>
          <option value="VEG">VEG</option>
          <option value="NONVEG">NONVEG</option>
        </select>

        <input

          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Description"
          value={menu.description}
          onChange={e => setMenu({ ...menu, description: e.target.value })}
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
          disabled={!menu.name || !menu.price || !menu.category || !image}
          className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2
                     cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Menu
        </button>
      </div>

      {/* Menu List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>


            </tr>
          </thead>

          <tbody>
            {menus.map(m => (
              <tr key={m.id} className="border-t  hover:bg-gray-50">
                <td className="p-3 font-medium">{m.name}</td>
                <td className="p-3">₹{m.price}</td>
                <td className="p-3">{m.category}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold
                      ${m.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"}`}
                  >
                    {m.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="p-3 relative">
                  <div className="relative w-16 h-16 group">
                    <img
                      src={m.imageUrl}
                      alt={m.name}
                      className="w-16 h-16 rounded object-cover border"
                    />

                    {/* Pencil Icon */}
                    <label
                      htmlFor={`menu-image-${m.id}`}
                      className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaPencilAlt size={12} />
                    </label>

                    {/* Hidden File Input */}
                    <input
                      id={`menu-image-${m.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        handleImageChange(m.id, file);
                      }}
                    />
                  </div>
                </td>



                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      updateMenuAvailability(m.id).then(loadMenus)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => deleteMenu(m.id).then(loadMenus)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {menus.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No menu items found
          </p>
        )}
      </div>
    </div>
  );
}
