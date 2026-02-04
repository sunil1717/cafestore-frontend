

import { getmenubyCategory } from "../api/allMenuApi";
import PlaceOrderModal from "../component/PlaceOrderModal";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MenuRating from "../component/MenuRating ";
import { FaStar } from "react-icons/fa";

import { getTodayOrderByContactInfo, rateWaiter, rateMenu } from "../api/orderApi"


export default function CustomerOrder() {

  const { tableId } = useParams();
  const [openModal, setOpenModal] = useState(false);

  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState([]);

  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("VEG");
  const [orderItems, setOrderItems] = useState([]);





  useEffect(() => {
    const fetchMenu = async () => {
      const res = await getmenubyCategory(category);
      setMenu(res);
    };
    fetchMenu();
  }, [category]);

  const addItemToOrder = (item) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.menu.id === item.id);

      if (existing) {
        return prev.map(i =>
          i.menu.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { menu: item, quantity: 1 }];
    });
  };

  const placeOrder = async () => {
    if (orderItems.length === 0) {
      alert("Please select at least one item");
      return;
    }
    setOpenModal(true)
    console.log("Order placed:", orderItems);
  };



  const fetchOrder = async () => {
    if (!phone) {
      alert("Enter phone number ");
      return;
    }
    const res = await getTodayOrderByContactInfo(phone);
    setOrder(res);
  };


   const submitMenuRating = async (orderId,value) => {
         await rateMenu(orderId, value);

  };
   const submitWaiterRating = async (orderId,value) => {
         await rateWaiter(orderId, value);

  };





  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center text-red-600 mb-6">
        Cafe Order Machine
      </h1>




      {/* CATEGORY TABS */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setCategory("VEG")}
          className={`px-6 py-2 rounded-full font-semibold ${category === "VEG"
            ? "bg-green-600 text-white"
            : "bg-white border text-green-600"
            }`}
        >
          🟢 VEG
        </button>

        <button
          onClick={() => setCategory("NONVEG")}
          className={`px-6 py-2 rounded-full font-semibold ${category === "NONVEG"
            ? "bg-red-600 text-white"
            : "bg-white border text-red-600"
            }`}
        >
          🔴 NON-VEG
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MENU */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map(item => (
            <div
              key={item.id}

              className="bg-white p-4 rounded-xl shadow 
                         hover:scale-105 hover:shadow-lg transition"
            >
              <img className="" src={item.imageUrl} alt={item.name} />
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
              <MenuRating rating={item.rating} />



              <button onClick={() => addItemToOrder(item)}
                className="bg-blue-600 text-white p-2 rounded-lg hover:cursor-pointer mt-1">
                Add
              </button>


            </div>
          ))}
        </div>
       
       

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-xl shadow p-4 sticky top-6">
          <h2 className="text-lg font-bold mb-3">🧾 Order Summary</h2>

          {orderItems.length === 0 && (
            <p className="text-gray-500">No items selected</p>
          )}

          {orderItems.map(item => (
            <div
              key={item.menu.id}
              className="flex justify-between mb-2"
            >
              <span>
                {item.menu.name} × {item.quantity}
              </span>
              <span>₹{item.menu.price * item.quantity}</span>
            </div>
          ))}

          <button
            onClick={placeOrder}

            className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg
                       hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>

      <div className="bg-gray-100">
        <input
          className="border-black border p-1 m-1 rounded"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />


        <button className="bg-blue-600 p-1 m-1 text-white rounded-lg" onClick={fetchOrder}>my Order</button>

        {order && (
          order.map((item) => (
            <div key={item.id} className="border-b p-2 my-2">
              <h3 className="font-semibold">{item.id}</h3>
              <p className="text-sm text-gray-600">{item.contactInfo}</p>
              <p className="text-sm text-gray-600">
                Items:{" "}
                {item.items.map((i) => `${i.menu.name} (${i.quantity})`).join(", ")}
              </p>

              <p>Status: {item.status}</p>
              <div className="flex gap-3">
                <p>Rate Menu</p>
                {!item.menuRated && [1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={18}
                    style={{ cursor: "pointer" }}
                    color={ "#d1d5db"}
                    onClick={() =>!item.menuRated && submitMenuRating(item.id,star).then(()=>fetchOrder())}
                  />
                ))}

                {item.menuRated && <p style={{ fontSize: "12px" }}>Thanks for rating menu 😊</p>}
              </div>
              <div className="flex gap-3">
                <p>Rate Waiter</p>
                {!item.waiterRated && [1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={18}
                    style={{ cursor: "pointer" }}
                    color={ "#d1d5db"}
                    onClick={() =>!item.waiterRated && submitWaiterRating(item.id,star).then(()=>fetchOrder())}
                  />
                ))}

                {item.waiterRated && <p style={{ fontSize: "12px" }}>Thanks for rating waiter😊</p>}
              </div>
            </div>
          )
          )
        )}
      </div>
      <PlaceOrderModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        orderItems={orderItems}
        tableId={tableId}
      />
    </div>
  );
}
