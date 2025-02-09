import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetCashOrderDetailsQuery, useReturnCashOrderMutation } from "../../redux/api/orderApiSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const CashOrder = () => {
  const { id: orderId } = useParams();
  const { data: cashOrder, refetch, isLoading, error } = useGetCashOrderDetailsQuery(orderId);
  const { userInfo } = useSelector((state) => state.auth);
  const [returnOrder, { isLoading: loadingReturn }] = useReturnCashOrderMutation();
  const invoiceRef = useRef();

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleDownloadPDF = useCallback(async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 1.8, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 20, 20, 171, (canvas.height * 171) / canvas.width);
    pdf.save(`invoice-${orderId}.pdf`);
  }, [orderId]);

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
    <p>Loading...</p>
  ) : error ? (
    <p>Error: {error.data.message}</p>
  ) : (
    <div className="container mx-auto max-w-[90%] mr-[3rem]">
      <div className="flex justify-end">
        <button onClick={handleDownloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
          Download Invoice
        </button>
      </div>

      <div ref={invoiceRef} className="bg-gray-700 p-5 shadow-lg mt-5">
        <h2 className="text-2xl font-medium mb-[5rem] text-center">INVOICE</h2>
        <p className="mb-1"><strong>Order ID:</strong> {cashOrder._id}</p>
        <p className="mb-1"><strong>Payment On:</strong>  {moment(cashOrder.createdAt).format("DD MMMM YYYY")}</p>
        <p className="mb-1"><strong>Payment Status:</strong> {cashOrder.isPaid ?
          <span className="text-green-300">Paid on {moment(cashOrder.paidAt).format("DD MMMM YYYY")}</span> :
          <span className="text-red-300">Cancelled</span>
        }</p>
        <p className="mb-1"><strong>Name:</strong> {cashOrder.customerName}</p>
        <p className="mb-1"><strong>Address:</strong> {cashOrder.address}</p>
        <p className="mb-1"><strong>Method:</strong> {cashOrder.paymentMethod}</p>

        <div className="overflow-x-auto mt-3">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-orange-600">
                <th className="p-1.5 border">Image</th>
                <th className="p-1.5 border">Product</th>
                <th className="p-1.5 border">Quantity</th>
                <th className="p-1.5 border">Price</th>
                <th className="p-1.5 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {cashOrder.items.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="p-1.5 border">
                    <img
                      src={item?.product?.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover"
                      crossOrigin="anonymous"
                    />
                  </td>
                  <td className="p-1.5 border">
                    <Link to={`/product/${item.product._id}`} className="text-yellow-400 hover:text-yellow-700">
                      {item.product.name}
                    </Link>
                  </td>
                  <td className="p-1.5 border">{item.quantity}</td>
                  <td className="p-1.5 border">RP. {new Intl.NumberFormat('id-ID').format(item.product.price)}</td>
                  <td className="p-1.5 border">RP. {new Intl.NumberFormat('id-ID').format(item.quantity * item.product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <p><strong>Total Amount:</strong> RP. {new Intl.NumberFormat('id-ID').format(cashOrder.totalAmount)}</p>
          <p><strong>Received Amount:</strong> RP. {new Intl.NumberFormat('id-ID').format(cashOrder.receivedAmount)}</p>
          <p><strong>Change:</strong> RP. {new Intl.NumberFormat('id-ID').format(cashOrder.change)}</p>
        </div>
      </div>
      {userInfo.user.isAdmin && cashOrder.isPaid && (
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

export default CashOrder