import Chart from "react-apexcharts";
import {
  useGetUserCountQuery,
} from "../../redux/api/usersApiSlice";
import {
  useGetTotalSalesQuery,
  useGetTotalOrderQuery,
  useGetTotalSalesByDateQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import OrderList from "./OrderList";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/loader";
import { FaUser, FaMoneyBill, FaShoppingBag } from "react-icons/fa";

const StatBox = ({ title, value, icon, loading }) => (
  <div className="rounded-lg bg-black p-5 w-[20rem] mt-5 flex flex-col items-center text-center">
    <div className="font-bold rounded-full w-[3rem] h-[3rem] bg-orange-500 flex items-center justify-center">
      {icon}
    </div>
    <p className="mt-5 text-lg text-gray-300">{title}</p>
    <h1 className="text-2xl font-bold text-white">
      {loading ? <Loader /> : value}
    </h1>
  </div>
);

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUserCountQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrderQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line" },
      tooltip: { theme: "dark" },
      stroke: { curve: "smooth" },
      title: { text: "Sales Trend", align: "left" },
      grid: { borderColor: "#ccc" },
      xaxis: { categories: [], title: { text: "Date" } },
      yaxis: { title: { text: "Sales" }, min: 0 },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSales = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: { categories: formattedSales.map((item) => item.x) },
        },
        series: [{ name: "Sales", data: formattedSales.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />
      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-full flex justify-around flex-wrap gap-5">
          <StatBox
            title="Sales"
            value={
              sales?.totalSales
                ? `RP. ${new Intl.NumberFormat("id-ID").format(
                    sales.totalSales
                  )}`
                : "RP. 0"
            }
            icon={<FaMoneyBill color="white" size="1.5em" />}
            loading={loadingSales}
          />
          <StatBox
            title="Customers"
            value={customers?.userCount || 0}
            icon={<FaUser color="white" size="1.5em" />}
            loading={loadingCustomers}
          />
          <StatBox
            title="All Orders"
            value={orders?.totalOrders || 0}
            icon={<FaShoppingBag color="white" size="1.5em" />}
            loading={loadingOrders}
          />
        </div>

        <div className="ml-[2rem] mt-[4rem]">
          <h2 className="text-xl font-bold text-gray-300 mb-4">
            Sales Trend (Last Period)
          </h2>
          {state.series[0].data.length > 0 ? (
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="100%"
            />
          ) : (
            <p className="text-gray-400">No sales data available.</p>
          )}
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
