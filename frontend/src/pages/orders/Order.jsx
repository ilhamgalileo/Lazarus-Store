import { useEffect, useRef, useCallback, useState } from "react";
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItems = order.orderItems.map((item) => ({
        product: item.product,
        qty: item.qty,
        price: item.price,
      }));
      setSelectedItems(allItems);
    }
    setSelectAll(!selectAll);
  };

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) => {
      return prev.some((selected) => selected.product === item.product)
        ? prev.filter((selected) => selected.product !== item.product)
        : [...prev, { product: item.product, qty: item.qty, price: item.price }];
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, { scale: 1.8, useCORS: true, backgroundColor: "#0f0f10" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.setFillColor(15, 15, 15)
    pdf.rect(0, 0, pageWidth, pageHeight, "F")
    pdf.addImage(imgData, "PNG", 20, 20, 171, (canvas.height * 171) / canvas.width);
    pdf.save(`invoice-${orderId}.pdf`);
  }, [orderId]);

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
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to return.");
      return;
    }
    if (window.confirm("Are you sure you want to return the selected items?")) {
      try {
        const returnedItems = selectedItems.map((item) => ({
          ...item,
          qty: editedQuantities[item.product] || item.qty,
        }));
        await returnOrder({ orderId, returnedItems }).unwrap();
        toast.success("Order items returned successfully");
        setSelectedItems([]);
        setEditedQuantities({});
        setSelectAll(false);
        refetch();
      } catch {
        toast.error("Failed to return order items");
      }
    }
  }, [returnOrder, orderId, selectedItems, refetch, editedQuantities]);

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

      <div ref={invoiceRef} className=" p-2 mt-2 shadow-lg relative">
        <img src={logo} alt="Logo" className="absolute top-2 left-2 w-[8rem] h-auto" />
        <h2 className="text-2xl font-medium mb-[5rem] text-center">INVOICE</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 mt-[1rem]">Order Information</h3>
            <p className="mb-1"><strong>Order ID:</strong> {order._id}</p>
            <p className="mb-1"><strong>Date:</strong> {moment(order.createdAt).format("DD MMMM YYYY")}</p>
            <p className="mb-1"><strong>Payment Status:</strong> {order.isPaid ?
              <span className="text-green-400">Paid on {moment(order.paidAt).format("DD MMMM YYYY")}</span> :
              <span className="text-red-400">Cancelled</span>
            }</p>
            <p className="mb-1"><strong>Delivery Status:</strong> {order.isDelivered ?
              <span className="text-green-400">On Process {moment(order.deliveredAt).format("DD MMMM YYYY")}</span> :
              <span className="text-red-400">Pending</span>
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
          {order?.orderItems?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mt-4 text-orange-400">Ordered Items</h3>
              <table className="w-full border-collapse border bg-gray-900">
                <thead>
                  <tr className="bg-orange-600">
                    {userInfo.user?.isAdmin && (
                      <th className="p-2 border">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className="w-6 h-5 mt-3 cursor-pointer"
                        />
                      </th>
                    )}
                    <th className="p-2 border">Image</th>
                    <th className="p-2 border">Product</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Unit Price</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.orderItems.map((item, index) => (
                    <tr key={index} className="text-center">
                      {userInfo.user.isAdmin && (
                        <td className="p-2 border">
                          <input
                            type="checkbox"
                            className="w-6 h-5 mt-3 cursor-pointer"
                            checked={selectedItems.some((selected) => selected.product === item.product)}
                            onChange={() => toggleItemSelection(item)}
                          />
                        </td>
                      )}
                      <td className="p-2 border">
                        <img src={item?.images[0]} alt={item.name} className="w-16 object-cover mx-auto" />
                      </td>
                      <td className="p-2 border">
                        <Link to={`/product/${item.product}`} className="text-yellow-300 hover:text-yellow-500">
                          {item.name}
                        </Link>
                      </td>
                      <td className="p-2 border">
                        {userInfo.user.isAdmin && selectedItems.some((selected) => selected.product === item.product) ? (
                          <input
                            type="number"
                            min="1"
                            max={item.qty}
                            value={editedQuantities[item.product] || item.qty}
                            onChange={(e) => handleQuantityChange(item.product, parseInt(e.target.value))}
                            className="w-16 text-center"
                          />
                        ) : (
                          item.qty
                        )}
                      </td>
                      <td className="p-2 border">RP. {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                      <td className="p-2 border">RP. {new Intl.NumberFormat('id-ID').format(item.qty * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {order?.returnedItems?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-red-400">Returned Items</h3>
            <table className="w-full border-collapse border bg-gray-900">
              <thead>
                <tr className="bg-red-600">
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Quantity</th>
                  <th className="p-2 border">Unit Price</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                {order?.returnedItems.map((item, index) => (
                  <tr key={index} className="text-center">
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
        )}

        <div className="mt-[3rem] flex justify-between gap-4 text font-medium">
          <div className="border p-4 rounded-lg bg-green-700 text-white w-1/3">
            <div className="flex justify-between mb-2">
              <span>Items Subtotal:</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping:</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax (PPN 11%):</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total:</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(order.totalPrice)}</span>
            </div>
          </div>

          {order.returnedItems && order.returnedItems.length > 0 && (
            <div className="border p-4 rounded-lg bg-red-700 text-white w-1/3">
              <h3 className="text-lg font-semibold mb-2">Return Details</h3>
              <p className="mb-1"><strong>Return Status:</strong> {order.isReturned ? "True" : "False"}</p>
              <p className="mb-1"><strong>Return Date:</strong> {order.returnedItems[0]?.returnedAt ? moment(order.returnedItems[0].returnedAt).format("DD MMMM YYYY") : "Not Available"}</p>
              <p className="mb-1"><strong>Return Amount:</strong> Rp{new Intl.NumberFormat('id-ID').format(order.returnAmount || 0)}</p>
            </div>
          )}
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
            {loadingReturn ? "Processing..." : "Return Selected Items"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;