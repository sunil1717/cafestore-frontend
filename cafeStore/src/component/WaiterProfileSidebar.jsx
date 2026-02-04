import { useRef, useState } from "react";
import { FaPencilAlt, FaTimes } from "react-icons/fa";
import {updateWaiterPassword} from "../api/waiterApi";
import { updateWaiterProfilePic } from "../api/adminApi";


export default function WaiterProfileSidebar({ waiter, isOpen, onClose, onLogout }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(waiter.profilePic);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setloading] = useState(false);

  const handleImageClick = () => fileInputRef.current.click();

  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("profilePic", file);

    setloading(true);
    const res= await updateWaiterProfilePic(waiter.id, formData);
     await localStorage.setItem("waiter", JSON.stringify(res.data));
    setloading(false);
   
  };

  return (
    <>
     {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40"
        />
      )}
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-gray-600 hover:text-black"
      >
        <FaTimes size={20} />
      </button>

      {/* PROFILE */}
      <div className="p-5">
        <div className="relative flex justify-center mb-4">
          <img
            src={preview || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border"
          />

          <button
            onClick={handleImageClick}
            className="absolute bottom-1 right-16 bg-black text-white p-2 rounded-full"
          >
            <FaPencilAlt size={14} />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <h2 className="text-center font-bold text-lg">Hi, {waiter.name}</h2>
        <p className="text-center text-sm text-gray-600">Phone No: {waiter.phoneNumber}</p>
        <p className="text-center text-sm text-gray-600">ID: {waiter.id}</p>
         {
          loading && <p className="text-center text-sm text-blue-600">proccessing plz wait...</p>
         }
        {/* PASSWORD */}
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold"> Change Password</h3>

          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded"
          onClick={async()=>{
              setloading(true);
              await updateWaiterPassword(waiter.id,oldPassword,newPassword);
              setloading(false);
              setOldPassword("");
              setNewPassword("");
            }}>
            
            Update Password
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-6 bg-red-500 text-white py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
    </>
  );
}
