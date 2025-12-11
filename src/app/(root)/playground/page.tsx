"use client";

// import { decode256, encode256 } from "@/lib/utils";
// import { encodeId } from "@/lib/utils";
import { useCartStore } from "@/store/CartStore";

// import { useCartStore } from "@/stores/CartStore"

const fakeMenus = [
  {
    id: "1",
    title: "Margherita Pizza",
    short_description: "Classic cheese & tomato",
    thumbnail:
      "https://images.unsplash.com/photo-1513104890138-7c749659a57e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    qty: 1,
    actual_price: 12,
  },
  {
    id: "2",
    title: "Chicken Burger",
    short_description: "Grilled chicken with lettuce",
    thumbnail:
      "https://images.unsplash.com/photo-1513104890138-7c749659a57e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    qty: 1,
    actual_price: 8,
  },
  {
    id: "3",
    title: "Pasta Alfredo",
    short_description: "Creamy white sauce pasta",
    thumbnail:
      "https://images.unsplash.com/photo-1513104890138-7c749659a57e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    qty: 1,
    actual_price: 10,
  },
];

export default function CartExample() {
  const { order, setOrder, increaseQty, decreaseQty, clearOrder } =
    useCartStore();
  // const data = {
  //   id: 5,
  //   title: "Pizza",
  //   short_description: "Pizza with cheese and tomato",
  //   thumbnail:
  //     "https://images.unsplash.com/photo-1513104890138-7c749659a57e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  //   qty: 1,
  //   actual_price: 10,
  // };
  // const encodedId = encode256(data);
  // console.log(encodedId);



  // const decodedData = decode256(encodedId);
  // console.log(decodedId, 'decodedData');

  return (
    <div className="p-6 mt-52">
      <h1 className="text-xl font-bold mb-4">Fake Menu</h1>

      {/* Fake menu items */}
      {fakeMenus.map((item) => (
        <div key={item.id} className="mb-2 flex justify-between items-center">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-gray-600">{item.short_description}</p>
          </div>
          <button
            onClick={() => setOrder(item)} // ✅ uses setOrder
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Add to Cart
          </button>
        </div>
      ))}

      <h2 className="text-lg font-semibold mt-6">🛒 Cart</h2>
      {order && order.menus.length > 0 ? (
        <>
          <ul className="mt-2 space-y-2">
            {order.menus.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  {item.title} – ${item.actual_price} × {item.qty}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    -
                  </button>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={clearOrder}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
          >
            Clear Cart
          </button>
        </>
      ) : (
        <p className="text-gray-500 mt-2">Cart is empty</p>
      )}
    </div>
  );
}
//
