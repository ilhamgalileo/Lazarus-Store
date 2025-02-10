import { useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Message from "../../components/Message";
import Loader from "../../components/loader";
import logo from '../../assets/1-removebg-preview.png'
import { useGetOrderDetailsQuery, useDeliverOrderMutation, useReturnOrderMutation } from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();
  const invoiceRef = useRef();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const [returnOrder, { isLoading: loadingReturn }] = useReturnOrderMutation();
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

  const returnHandler = useCallback(async () => {
    if (window.confirm("Are you sure you want to return this order?")) {
      try {
        await returnOrder(orderId).unwrap();
        toast.success("Order returned successfully");
        refetch();
      } catch {
        toast.error("Failed to return order");
      }
    }
  }, [returnOrder, orderId, refetch]);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error.data.message}</Message>
  ) : (
    <div className="container mx-auto max-w-[87%] mr-[2rem] ml-[9rem] mt-[1rem]">
      <div className="flex justify-end mb-4">
        <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
          Download Invoice
        </button>
      </div>

      <div ref={invoiceRef} className="bg-gray-700 p-2 mt-2 shadow-lg relative">
        <img src={logo} alt="Logo" className="absolute top-2 left-2 w-[8rem] h-auto" />
        <h2 className="text-2xl font-medium mb-[5rem] text-center">INVOICE</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 mt-[1rem]">Order Information</h3>
            <p className="mb-1"><strong>Order ID:</strong> {order._id}</p>
            <p className="mb-1"><strong>Date:</strong> {moment(order.createdAt).format("DD MMMM YYYY")}</p>
            <p className="mb-1"><strong>Payment Status:</strong> {order.isPaid ?
              <span className="text-green-300">Paid on {moment(order.paidAt).format("DD MMMM YYYY")}</span> :
              <span className="text-red-300">Cancelled</span>
            }</p>
            <p className="mb-1"><strong>Delivery Status:</strong> {order.isDelivered ?
              <span className="text-green-300">On Process {moment(order.deliveredAt).format("DD MMMM YYYY")}</span> :
              <span className="text-red-300">Pending</span>
            }</p>
            <p className="mb-1"><strong>Method:</strong> {order.paymentMethod}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 mt-[1rem]">Customer Details</h3>
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
      {userInfo.user.isAdmin && order.isPaid && (
        <div className="mt-6">
          <button
            type="button"
            className="bg-red-500 text-white w-full py-2 rounded"
            onClick={returnHandler}
            disabled={loadingReturn}
          >
            {loadingReturn ? "Processing..." : "Return Order"}
          </button>
        </div>
      )}
    </div>
  )
}

export default Order