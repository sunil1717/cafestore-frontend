import CustomerOrder from "./pages/CustomerOrder";
import LoginWaiter from "./pages/LoginWaiter";
import WaiterDashboard from "./pages/WaiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import KitchenDashboard from "./pages/KitchenDashboard";
import { Routes, Route } from "react-router-dom";

export default function App() {
    return (

        <>

            <Routes>
                <Route path="/:tableId" element={<CustomerOrder />} />
                <Route path="/login" element={<LoginWaiter />} />
                <Route path="/waiter-dashboard" element={<WaiterDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard/>} />
                <Route path="/kitchen" element={<KitchenDashboard/>} />


            </Routes>


        </>



    );
}
