import { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import {
  useGetUserCountQuery,
} from "../../redux/api/usersApiSlice";
import {
  useGetTotalSalesQuery,
  useGetTotalOrderQuery,
  useGetTotalSalesByDateQuery,
} from "../../redux/api/orderApiSlice";
import OrderList from "./OrderList";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/loader";
import { FaUser, FaMoneyBill, FaShoppingBag, FaChartLine, FaCalendar } from "react-icons/fa";
import { Link } from 'react-router-dom';

const StatBox = ({ title, value, icon, loading }) => (
  <div className="rounded-lg bg-gray-700 shadow-lg p-6 w-full">
    <div className="flex items-center justify-between">
      <div className="font-bold rounded-full w-12 h-12 bg-orange-500 flex items-center justify-center text-gray-800">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-white text-sm font-medium">{title}</p>
      <h1 className="text-2xl font-bold text-white mt-1">
        {loading ? <Loader /> : value}
      </h1>
    </div>
  </div>
)

const AdminDashboard = () => {
  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUserCountQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrderQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const averageSales = sales?.totalSales && orders?.totalOrders ? Math.round(sales.totalSales / orders.totalOrders) : 0;

  const [chartConfig, setChartConfig] = useState({
    options: {
      chart: {
        type: "area",
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      colors: ["orange"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`
        }
      },
      grid: {
        borderColor: "gray",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "gray",
            fontSize: "12px"
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "white",
            fontSize: "12px"
          },
          formatter: (value) => `Rp ${value >= 1000000 ? `${value / 1000000}M` : value}`
        }
      }
    },
    series: [{
      name: "Sales",
      data: []
    }]
  })

  useEffect(() => {
    if (salesDetail) {
      const formattedSales = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setChartConfig(prev => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: formattedSales.map((item) => item.x)
          }
        },
        series: [{
          name: "Sales",
          data: formattedSales.map((item) => item.y)
        }]
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen">
      <AdminMenu />
      <div className="p-6 xl:ml-[4rem] md:ml-[0rem]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <div className="flex items-center mr-[4rem] mt-4 space-x-2 text-sm text-white">
            <FaCalendar className="text-white" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatBox title="Total Sales" value={sales?.totalSales ? `Rp ${new Intl.NumberFormat("id-ID").format(sales.totalSales)}` : "Rp 0"} icon={<FaMoneyBill />} loading={loadingSales} />
          <StatBox title="Average Sales" value={`Rp ${new Intl.NumberFormat("id-ID").format(averageSales)}`} icon={<FaChartLine />} loading={loadingSales || loadingOrders} />
          <StatBox title="Total Customers Account" value={customers?.userCount || 0} icon={<FaUser />} loading={loadingCustomers} />
          <StatBox title="Total Orders" value={orders?.totalOrders || 0} icon={<FaShoppingBag />} loading={loadingOrders} />
        </div>

        <div className="bg-black rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white">Sales Trend</h2>
          {chartConfig.series[0].data.length > 0 ? (
            <Chart options={chartConfig.options} series={chartConfig.series} type="area" height={350} />
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-800">No sales data available</div>
          )}
        </div>

        <div className="bg-black rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          </div>
          <OrderList limit={5} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
