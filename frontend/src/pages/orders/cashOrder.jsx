import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetCashOrderDetailsQuery, useReturnCashOrderMutation } from "../../redux/api/orderApiSlice";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import logo from '../../assets/1-removebg-preview.png'

const CashOrder = () => {
  const { id: orderId } = useParams();
  const { data: cashOrder, refetch, isLoading, error } = useGetCashOrderDetailsQuery(orderId);
  const { userInfo } = useSelector((state) => state.auth);
  const [returnOrder, { isLoading: loadingReturn }] = useReturnCashOrderMutation();
  const invoiceRef = useRef();
  const [selectedItems, setSelectedItems] = useState([]);
  const [editedQuantities, setEditedQuantities] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    refetch()
  }, [refetch])

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
    pdf.save(`invoice-cash-${orderId}.pdf`);
}, [orderId]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItems = cashOrder.items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
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
        : [...prev, { product: item.product, quantity: item.quantity, price: item.price }];
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const returnHandler = useCallback(async () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to return.");
      return;
    }
    if (window.confirm("Are you sure you want to return the selected items?")) {
      try {
        const returnedItems = selectedItems.map((item) => ({
          product: item.product._id,
          quantity: editedQuantities[item.product._id] || item.quantity,
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

      <div ref={invoiceRef} className="p-2 mt-2 shadow-lg relative">
        <img src={logo} alt="Logo" className="absolute top-2 left-2 w-[8rem] h-auto" />
        <h2 className="text-2xl font-medium mb-[5rem] text-center">INVOICE</h2>
        <h3 className="text-xl font-semibold mb-3 mt-[1rem]">Order Information</h3>
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
          {cashOrder?.items?.length > 0 && (
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
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>

                  {cashOrder.items.map((item, index) => (
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
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-[8rem] w-[8rem] object-cover mx-auto"
                        />
                      </td>
                      <td className="p-2 border">
                        <Link to={`/product/${item.product._id}`} className="text-yellow-400 hover:text-yellow-700">
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="p-2 border">
                        {userInfo.user.isAdmin && selectedItems.some((selected) => selected.product === item.product) ? (
                          <input
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={editedQuantities[item.product._id] || item.quantity}
                            onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                            className="w-16 text-center"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="p-2 border">Rp{new Intl.NumberFormat('id-ID').format(item.product.price)}</td>
                      <td className="p-2 border">Rp{new Intl.NumberFormat('id-ID').format(item.quantity * item.product.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {cashOrder?.returnedItems?.length > 0 && (
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
                {cashOrder?.returnedItems.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">
                      <Link to={`/product/${item.product}`} className="text-yellow-300 hover:text-yellow-500">
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">Rp{new Intl.NumberFormat('id-ID').format(item.price)}</td>
                    <td className="p-2 border">Rp{new Intl.NumberFormat('id-ID').format(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-[3rem] flex justify-between gap-4 text font-medium">
          <div className="border p-4 rounded-lg bg-green-700 text-white w-1/3">
            <div className="flex justify-between mb-2">
              <span>Total Amount:</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(cashOrder.totalAmount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>TAX (PPN 11%):</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(cashOrder.taxPrice)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Received Amount:</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(cashOrder.receivedAmount)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Change:</span>
              <span>Rp{new Intl.NumberFormat('id-ID').format(cashOrder.change)}</span>
            </div>
          </div>
          {cashOrder.returnedItems && cashOrder.returnedItems.length > 0 && (
            <div className="border p-4 rounded-lg bg-red-700 text-white w-1/3">
              <h3 className="text-lg font-semibold mb-2">Return Details</h3>
              <p className="mb-1"><strong>Return All:</strong> {cashOrder.isReturned ? "True" : "False"}</p>
              <p className="mb-1"><strong>Return Date:</strong> {cashOrder.returnedItems[0]?.returnedAt ? moment(cashOrder.returnedItems[0].returnedAt).format("DD MMMM YYYY") : "Not Available"}</p>
              <p className="mb-1"><strong>Return Amount:</strong> Rp{new Intl.NumberFormat('id-ID').format(cashOrder.returnAmount || 0)}</p>
            </div>
          )}
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
            {loadingReturn ? "Processing..." : "Return Selected Items"}
          </button>
        </div>
      )}
    </div>
  )
}

export default CashOrder