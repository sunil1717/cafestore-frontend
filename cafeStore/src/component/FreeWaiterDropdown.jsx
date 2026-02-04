import { useState } from "react";
// import { FaChair } from "react-icons/fa";

export default function FreeWaiterDropdown({ freeWaiter }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* ICON */}
      <div onClick={() => setOpen(!open)}
        className="cursor-pointer text-green-600 hover:text-green-700 h-2 w-2"
         >
         check Free Waiters
        </div>

      {/* DROPDOWN OVERLAY */}
      {open && (
        <div className="absolute mt-2  w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-2 border-b text-sm font-semibold text-gray-700  flex justify-between items-center">
            Free Waiters
            <button className="cursor-pointer" onClick={()=>setOpen(!open)}>x</button> 
          </div>
          

          <ul className="max-h-48 overflow-y-auto">
            {freeWaiter.map(waiter=> (
              <li
                key={waiter.id}
                className="px-4 py-2 text-sm text-black hover:bg-gray-100 cursor-default flex items-center gap-2"
              >
                🟢{waiter.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
