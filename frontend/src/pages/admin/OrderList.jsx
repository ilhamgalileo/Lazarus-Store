import React, { useState } from 'react';
import Message from "../../components/Message";
import Loader from "../../components/loader";
import { Link } from "react-router-dom";
import { useGetAllOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data, isLoading, error } = useGetAllOrdersQuery();
  const { orders, cashOrders } = data || { orders: [], cashOrders: [] };

  const [searchTerm, setSearchTerm] = useState('');

  // State untuk filter
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all', 'paid', 'unpaid'
  const [deliveryFilter, setDeliveryFilter] = useState('all'); // 'all', 'complete', 'pending'
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all'); // 'all', 'cash', 'non-cash'

  // Komponen StatusBadge
  const StatusBadge = ({ isComplete, label }) => (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${isComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {label}
    </span>
  );

  // Fungsi untuk memfilter dan mencari data
  const filteredOrders = orders.filter((order) => {
    const matchesSearchTerm =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPaymentFilter =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && order.isPaid) ||
      (paymentFilter === 'unpaid' && !order.isPaid);

    const matchesDeliveryFilter =
      deliveryFilter === 'all' ||
      (deliveryFilter === 'complete' && order.isDelivered) ||
      (deliveryFilter === 'pending' && !order.isDelivered);

    return matchesSearchTerm && matchesPaymentFilter && matchesDeliveryFilter;
  });

  const filteredCashOrders = cashOrders.filter((order) => {
    const matchesSearchTerm =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPaymentFilter =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && order.isPaid) ||
      (paymentFilter === 'unpaid' && !order.isPaid);

    const matchesPaymentMethodFilter =
      paymentMethodFilter === 'all' ||
      (paymentMethodFilter === 'cash' && order.paymentMethod === 'cash') ||
      (paymentMethodFilter === 'non-cash' && order.paymentMethod !== 'cash');

    return matchesSearchTerm && matchesPaymentFilter && matchesPaymentMethodFilter;
  });

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminMenu />

      {/* Input Pencarian dan Filter */}
      <div className="mt-8 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        {/* Input Pencarian */}
        <input
          type="text"
          placeholder="Search by ID or Customer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-3 py-2 text-white bg-gray-600 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Filter Pembayaran */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-gray-600 w-full md:w-1/4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>

        {/* Filter Pengiriman */}
        <select
          value={deliveryFilter}
          onChange={(e) => setDeliveryFilter(e.target.value)}
          className="bg-gray-600 w-full md:w-1/4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Deliveries</option>
          <option value="complete">Complete</option>
          <option value="pending">Pending</option>
        </select>

        {/* Filter Metode Pembayaran */}
        <select
          value={paymentMethodFilter}
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
          className="bg-gray-600 w-full md:w-1/4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Payment Methods</option>
          <option value="cash">Cash</option>
          <option value="non-cash">Non-Cash</option>
        </select>
      </div>

      {/* Tabel Order */}
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-orange-600">
                  <tr className='text-white'>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold">Total Items</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">ID</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">User</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Total</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Date</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Payment</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Delivery</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-gray-700">
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order?.orderItems?.length || 0} Items
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order._id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order.user ? order.user.username : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        Rp {new Intl.NumberFormat('id-ID').format(order.totalPrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <StatusBadge
                          isComplete={order.isPaid}
                          label={order.isPaid ? "Paid" : "Unpaid"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <StatusBadge
                          isComplete={order.isDelivered}
                          label={order.isDelivered ? "Complete" : "Pending"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <Link to={`/order/${order._id}`} className="text-white hover:text-gray-400 font-medium">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {filteredCashOrders.map((order) => (
                    <tr key={order._id} className="bg-gray-800">
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order?.items?.length || 0} Items
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order._id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order.customerName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <StatusBadge
                          isComplete={order.isPaid}
                          label={order.isPaid ? "Paid" : "Unpaid"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <StatusBadge
                          isComplete={order.paymentMethod === "cash"}
                          label={order.paymentMethod === "cash" ? "Cash" : "Non-Cash"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <Link to={`/order/${order._id}/cash`} className="text-white hover:text-gray-400 font-medium">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;