import { useEffect, useState } from "react";
import { placeOrder } from "../api/orderApi";

export default function PlaceOrderModal({
    open,
    onClose,
    orderItems,
    tableId,
}) {
    const [persons, setPersons] = useState(1);
    const [contactInfo, setcontactInfo] = useState("")
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.menu.price * item.quantity,
        0
    );


    useEffect(() => {
        if (!open) return;

        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            (err) => setError(err.message)
        );
    }, [open]);

    const confirmOrder =async() => {
        if (!location) {
            alert("Location is required to place order");
            return;
        }

        const order = {
            personCount: persons,
            contactInfo: contactInfo,
            items:orderItems,
            tableId:tableId,
            };


       const res= await placeOrder(order,location.latitude,location.longitude);

      
        alert(res)
        
      
        onClose();

        console.log("FINAL ORDER PAYLOAD 👉", location.latitude,location.longitude);
        
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">🧾 Confirm Order</h2>

                <p className="mb-2 text-sm text-gray-600">
                    Table ID: <b>{tableId}</b>
                </p>

                {/* Persons */}
                <label className="block mb-2 font-semibold">
                    Number of Persons
                </label>
                <input
                    type="number"
                    min="1"
                    value={persons}
                    onChange={(e) => setPersons(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                />
                {/* contactInfo */}
                <label className="block mb-2 font-semibold">
                    Phone Number
                </label>
                <input
                    value={contactInfo}
                    onChange={(e) => setcontactInfo(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                />

                {/* Items */}
                <div className="mb-4">
                    {orderItems.map(item => (
                        <div key={item.menu.id} className="flex justify-between text-sm">
                            <span>{item.menu.name} × {item.quantity}</span>
                            <span>₹{item.menu.price * item.quantity}</span>
                        </div>
                    ))}
                </div>

                <div className="font-bold mb-4">
                    Total: ₹{totalAmount}
                </div>

                {/* Location */}
                {location && (
                    <p className="text-sm text-green-600 mb-2">
                         Location captured
                    </p>
                )}

                {error && !location && (
                    <p className="text-sm text-red-600 mb-2">{error}</p>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="w-1/2 border py-2 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={confirmOrder}
                        className="w-1/2 bg-green-600 text-white py-2 rounded"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
