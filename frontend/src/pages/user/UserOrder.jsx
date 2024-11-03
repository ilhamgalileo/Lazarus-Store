import Message from "../../components/Message";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 text-center w-[6rem]">IMAGE</th>
              <th className="py-2 text-center w-[6rem]">ID</th>
              <th className="py-2 text-center w-[6rem]">DATE</th>
              <th className="py-2 text-center w-[6rem]">TOTAL</th>
              <th className="py-2 text-center w-[6rem]">PAID</th>
              <th className="py-2 text-center w-[6rem]">DELIVERED</th>
              <th className="py-2 text-center w-[6rem]"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 text-center w-[6rem]">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-[15rem] mb-5"
                  />
                </td>

                <td className="py-2 text-center w-[6rem]">{order._id}</td>
                <td className="py-2 text-center w-[6rem]">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2 text-center w-[6rem]">$ {order.totalPrice.toFixed(2)}</td>

                <td className="py-2 text-center w-[6rem]">
                  {order.isPaid ? (
                    <p className="p-1 text-center bg-green-600 w-full rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-500 w-full rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2 text-center w-[6rem]">
                  {order.isDelivered ? (
                    <p className="p-1 text-center bg-green-600 w-full rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-500 w-full rounded-full">
                      Pending
                    </p>
                  )}
                </td>

                <td className="py-2 text-center w-[6rem]">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-orange-400 text-black py-2 px-3 rounded">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;