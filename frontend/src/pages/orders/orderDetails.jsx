import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import Message from "../../components/Message";
import Loader from "../../components/loader";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../../redux/api/orderApiSlice";

const orderCashDetails = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Deliver successful");
      setTimeout(() => {
        navigate("/user-orders");
        window.location.reload();
      }, 3000);
      refetch();
    } catch (error) {
      toast.error("Failed to mark as delivered");
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[5rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border-gray-300 mt-5 pb-4 mb-5">
          {order.orderItems.length === 0 ? (
            <Message>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[70%]">
                <thead className="border-b-2">
                  <tr>
                    <th className="p-2">Image</th>
                    <th className="p-2">Product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 flex justify-center items-center">
                        <img
                          src={item?.image || item?.images[0]}
                          alt={item.name}
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        RP. {isLoading ? (
                          <Loader />
                        ) : (
                          new Intl.NumberFormat("id-ID").format(item.price)
                        )}
                      </td>
                      <td className="p-2 text-center">
                        RP. {isLoading ? (
                          <Loader />
                        ) : (
                          new Intl.NumberFormat("id-ID").format(
                            item.qty * item.price
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="md:w-1/3 mr-[10rem] text-sm">
        <div className="mt-5 border-gray-300 pb-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Order Details</h2>

          <p className="mb-4 mt-4">
            <strong className="text-orange-500">Order ID:</strong> {order._id}
          </p>

          {/* Cash Order Specific Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Cash Payment Details</h3>
            <p className="mb-2">
              <strong className="text-orange-500">Customer Name:</strong>{" "}
              {order.customerName}
            </p>
            <p className="mb-2">
              <strong className="text-orange-500">Phone:</strong> {order.phone}
            </p>
            <p className="mb-2">
              <strong className="text-orange-500">Address:</strong>{" "}
              {order.cust_address}
            </p>
            <p className="mb-2">
              <strong className="text-orange-500">Received Amount:</strong> RP.{" "}
              {new Intl.NumberFormat("id-ID").format(order.receivedAmount)}
            </p>
            <p className="mb-2">
              <strong className="text-orange-500">Change:</strong> RP.{" "}
              {new Intl.NumberFormat("id-ID").format(order.change)}
            </p>
          </div>

          <p className="mb-4 mt-4">
            <strong className="text-orange-500">Payment Method:</strong>{" "}
            {order.paymentMethod}
          </p>

          <div
            className={`p-4 rounded-md text-sm mb-4 ${
              order.isPaid ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {order.isPaid ? (
              <>Paid on {moment(order.paidAt).format("DD MMMM YYYY")}</>
            ) : (
              "Not paid"
            )}
          </div>

          <div
            className={`p-4 rounded-md text-sm mb-4 ${
              order.isDelivered
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {order.isDelivered ? (
              <>Delivered on {moment(order.deliveredAt).format("DD MMMM YYYY")}</>
            ) : (
              "Not delivered"
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Items</span>
          <span>
            RP.{" "}
            {isLoading ? (
              <Loader />
            ) : (
              new Intl.NumberFormat("id-ID").format(order.itemsPrice)
            )}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>
            RP.{" "}
            {isLoading ? (
              <Loader />
            ) : (
              new Intl.NumberFormat("id-ID").format(order.shippingPrice)
            )}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>
            RP.{" "}
            {isLoading ? (
              <Loader />
            ) : (
              new Intl.NumberFormat("id-ID").format(order.taxPrice)
            )}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Total</span>
          <span>
            RP.{" "}
            {isLoading ? (
              <Loader />
            ) : (
              new Intl.NumberFormat("id-ID").format(order.totalPrice)
            )}
          </span>
        </div>

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.user?.isAdmin && order.isPaid && !order.isDelivered && (
          <div>
            <button
              type="button"
              className="bg-orange-500 text-white w-full py-2"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default orderCashDetails;