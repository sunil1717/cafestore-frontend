import { useState } from "react";
import { loginWaiter } from "../api/waiterApi"
import { useNavigate } from "react-router-dom";


const LoginWaiter = () => {

  const navigate = useNavigate();

  const [phoneNo, setphoneNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNo || !password) {
      alert("User ID and Password are required");
      return;
    }

    const res = await loginWaiter(phoneNo, password)
    await localStorage.setItem("waiter", JSON.stringify(res.data));
    
    if (res.status === 200) {
      navigate("/waiter-dashboard");
      
    }
    

   

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-80 bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Waiter Login
        </h2>

        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNo}
          onChange={(e) => setphoneNo(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginWaiter