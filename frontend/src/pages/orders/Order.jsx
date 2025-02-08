import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Message from "../../components/Message";
import Loader from "../../components/loader";
import { useGetOrderDetailsQuery, useDeliverOrderMutation } from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const invoiceRef = useRef();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDownloadPDF = async () => {
    const input = invoiceRef.current;
    const canvas = await html2canvas(input, { scale: 1.8, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 171;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(`invoice-${orderId}.pdf`);
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Deliver successful");
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
    <div className="container mx-auto max-w-[90%] mr-[3rem]">
      <div className="flex justify-end mb-4">
        <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
          Download Invoice
        </button>
      </div>

      <div ref={invoiceRef} className="bg-gray-700 p-5 mt-5 shadow-lg">
        <h2 className="text-2xl font-medium mb-[5rem] text-center">INVOICE</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Information</h3>
            <p className="mb-1"><strong>Order ID:</strong> {order._id}</p>
            <p className="mb-1"><strong>Date:</strong> {moment(order.createdAt).format("DD MMMM YYYY")}</p>
            <p className="mb-1"><strong>Payment Status:</strong> {order.isPaid ?
              <span className="text-green-300">Paid on {moment(order.paidAt).format("DD MMMM YYYY")}</span> :
              <span className="text-red-600">Not Paid</span>
            }</p>
            <p className="mb-1"><strong>Method:</strong> {order.paymentMethod}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Details</h3>
            <p className="mb-1"><strong>Name:</strong> {order.user.username}</p>
            <p className="mb-1"><strong>Email:</strong> {order.user.email}</p>
            <p className="mb-1"><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-orange-600">
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Unit Price</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="p-2 border">
                    <img
                      src={item?.images[0]}
                      alt={item.name}
                      className="w-16 h-16 object-cover mx-auto"
                      crossOrigin="anonymous"
                    />
                  </td>
                  <td className="p-2 border">
                    <Link to={`/product/${item.product}`} className="text-yellow-300 hover:text-yellow-500">
                      {item.name}
                    </Link>
                  </td>
                  <td className="p-2 border">{item.qty}</td>
                  <td className="p-2 border">RP. {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                  <td className="p-2 border">RP. {new Intl.NumberFormat('id-ID').format(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-[3rem] flex justify text font-medium">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Items Subtotal:</span>
              <span>RP. {new Intl.NumberFormat('id-ID').format(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>RP. {new Intl.NumberFormat('id-ID').format(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>RP. {new Intl.NumberFormat('id-ID').format(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>RP. {new Intl.NumberFormat('id-ID').format(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        {loadingDeliver && <Loader />}
        {userInfo && userInfo.user?.isAdmin && order.isPaid && !order.isDelivered && (
          <div className="mt-6">
            <button
              type="button"
              className="bg-orange-500 text-white w-full py-2 rounded"
              onClick={deliverHandler}
            >
              Mark As Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Order