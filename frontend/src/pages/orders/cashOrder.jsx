import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import Message from "../../components/Message";
import Loader from "../../components/loader";
import { useGetCashOrderDetailsQuery, useDeliverOrderMutation, } from "../../redux/api/orderApiSlice";

const CashOrder = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const { data: cashOrder, refetch, isLoading, error } = useGetCashOrderDetailsQuery(orderId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container flex flex-col ml-[5rem] md:flex-row">
      <div className="md:w-2/3 pr-4">
        <div className="border-gray-300 mt-5 pb-4 mb-5">
          {cashOrder.orderItems === 0 ? (
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
                  {cashOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 flex justify-center items-center">
                        <img
                          src={item?.product?.images[0]}
                          alt={item.name}
                          className="w-20 h-20 object-cover"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                      </td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-center">
                        RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(item.product.price || 0)}
                      </td>
                      <td className="p-2 text-center">
                        RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format((item.quantity * item.product.price) || 0)}
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
          <h2 className="text-lg font-bold mb-2">Shipping</h2>

          <p className="mb-4 mt-4">
            <strong className="text-orange-500">Order ID:</strong> {cashOrder._id}
          </p>

          <p className="mb-4 mt-4">
            <strong className="text-orange-500">Name:</strong> {cashOrder.customerName}
          </p>

          <p className="mb-4">
            <strong className="text-orange-500">Address:</strong> {cashOrder.address}
          </p>

          <p className="mb-4 mt-4">
            <strong className="text-orange-500">Method:</strong> {cashOrder.paymentMethod}
          </p>
          <div
            className={`p-4 rounded-md text-sm mb-4 ${cashOrder.isPaid ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
          >
            {cashOrder.isPaid ? (
              <>Paid on {moment(cashOrder.paidAt).format("DD MMMM YYYY")}</>
            ) : (
              "Not paid"
            )}
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2 mt-[3rem]">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Total Amount</span>
          <span>RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(cashOrder.totalAmount)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Received Amount</span>
          <span>RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(cashOrder.receivedAmount)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Change</span>
          <span>RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(cashOrder.change)}</span>
        </div>
      </div>
    </div>
  );
};

export default CashOrder;
