import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  useGetUserCountQuery,
} from "../../redux/api/usersApiSlice";
import {
  useGetTotalSalesQuery,
  useGetTotalOrderQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesByWeekQuery,
  useGetTotalSalesByMonthQuery,
  useGetTotalSalesByYearQuery,
} from "../../redux/api/orderApiSlice";
import OrderList from "./OrderList";
import Loader from "../../components/loader";
import { FaUser, FaMoneyBill, FaShoppingBag, FaChartLine, FaCalendar, FaCalendarAlt } from "react-icons/fa";
import AdminMenu from "./AdminMenu";

const StatBox = ({ title, value, icon, loading }) => (
  <div className="rounded-lg bg-gray-700 shadow-lg p-6 w-full">
    <div className="flex items-center justify-between">
      <div className="font-bold rounded-full w-12 h-12 bg-orange-500 flex items-center justify-center text-gray-800">
        {icon}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-white text-sm font-medium ">{title}</p>
      <h1 className="text-2xl font-bold text-white mt-[1rem]">
        {loading ? <Loader /> : value}
      </h1>
    </div>
  </div>
);

const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates
};

const generateAllWeeksInMonth = (month) => {
  const weeks = [];
  const year = new Date().getFullYear();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  let currentDate = new Date(firstDayOfMonth);
  while (currentDate <= lastDayOfMonth) {
    const weekNumber = Math.ceil((currentDate.getDate() + firstDayOfMonth.getDay()) / 7);
    const weekId = `${month.toString().padStart(2, "0")}-${weekNumber}`;
    if (!weeks.includes(weekId)) {
      weeks.push(weekId);
    }
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

const formatWeekLabel = (weekId) => {
  const [month, week] = weekId.split("-");
  const monthName = new Date(2024, month - 1, 1).toLocaleString("default", { month: "long" });
  return `${monthName} - Week ${week}`
}

const generateAllMonths = () => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1); // Tahun 2024 sebagai contoh
    months.push(date.toLocaleString("default", { month: "long" }));
  }
  return months;
};

const generateAllYears = (startYear, endYear) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return years;
};

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("daily")

  const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loadingCustomers } = useGetUserCountQuery();
  const { data: orders, isLoading: loadingOrders } = useGetTotalOrderQuery();
  const { data: salesDetailDaily } = useGetTotalSalesByDateQuery();
  const { data: salesDetailWeekly } = useGetTotalSalesByWeekQuery();
  const { data: salesDetailMonthly } = useGetTotalSalesByMonthQuery();
  const { data: salesDetailYearly } = useGetTotalSalesByYearQuery();

  const salesDetail = timeRange === "daily"
    ? salesDetailDaily
    : timeRange === "weekly"
      ? salesDetailWeekly
      : timeRange === "monthly"
        ? salesDetailMonthly
        : salesDetailYearly;

  const averageSales = sales?.totalSales && orders?.totalOrders ? Math.round(sales.totalSales / orders.totalOrders) : 0;

  const [chartConfig, setChartConfig] = useState({
    options: {
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      colors: ["orange"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`,
        },
      },
      grid: {
        borderColor: "gray",
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "gray",
            fontSize: "12px",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "white",
            fontSize: "12px",
          },
          formatter: (value) => `Rp ${value >= 1000000 ? `${value / 1000000}M` : value}`,
        },
      },
    },
    series: [
      {
        name: "Sales",
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (salesDetail) {
      let categories = [];
      let formattedSales = [];

      if (timeRange === "daily") {
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        categories = generateDateRange(startDate, endDate);

        const salesMap = salesDetail.reduce((acc, item) => {
          acc[item._id] = item.totalSales;
          return acc;
        }, {});

        formattedSales = categories.map((date) => ({
          x: date,
          y: salesMap[date] || 0,
        }));
      } else if (timeRange === "weekly") {
        const currentMonth = new Date().getMonth() + 1;
        categories = generateAllWeeksInMonth(currentMonth);

        const salesMap = salesDetail.reduce((acc, item) => {
          acc[item._id] = item.totalSales;
          return acc;
        }, {});

        formattedSales = categories.map((weekId) => ({
          x: formatWeekLabel(weekId),
          y: salesMap[weekId] || 0,
        }));
      } else if (timeRange === "monthly") {
        categories = generateAllMonths();

        const salesMap = salesDetail.reduce((acc, item) => {
          const monthName = new Date(2024, item._id.split("-")[1] - 1, 1).toLocaleString("default", { month: "long" });
          acc[monthName] = item.totalSales;
          return acc;
        }, {});

        formattedSales = categories.map((month) => ({
          x: month,
          y: salesMap[month] || 0,
        }));
      } else if (timeRange === "yearly") {
        categories = generateAllYears(2025, 2030);

        const salesMap = salesDetail.reduce((acc, item) => {
          acc[item._id] = item.totalSales;
          return acc;
        }, {});

        formattedSales = categories.map((year) => ({
          x: year,
          y: salesMap[year] || 0,
        }));
      }

      setChartConfig((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: categories,
          },
        },
        series: [
          {
            name: "Sales",
            data: formattedSales.map((item) => item.y),
          },
        ],
      }));
    }
  }, [salesDetail, timeRange]);

  return (
    <div className="min-h-screen">
      <AdminMenu />
      <div className="p-6 xl:ml-[4rem] md:ml-[0rem]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <div className="flex mt-[1.5rem] items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-white" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-700 text-white rounded-lg p-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 text-sm text-white">
              <FaCalendar className="text-white" />
              <span>{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatBox
            title="Total Sales"
            value={sales?.totalSales ? `Rp ${new Intl.NumberFormat("id-ID").format(sales.totalSales)}` : "Rp 0"}
            icon={<FaMoneyBill />}
            loading={loadingSales}
          />
          <StatBox
            title="Average Sales"
            value={`Rp ${new Intl.NumberFormat("id-ID").format(averageSales)}`}
            icon={<FaChartLine />}
            loading={loadingSales || loadingOrders}
          />
          <StatBox
            title="Total Customers Account"
            value={customers?.userCount || 0}
            icon={<FaUser />}
            loading={loadingCustomers}
          />
          <StatBox
            title="Total Orders"
            value={orders?.totalOrders || 0}
            icon={<FaShoppingBag />}
            loading={loadingOrders}
          />
        </div>

        <div className="bg-black rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white">Sales Trend ({timeRange})</h2>
          {chartConfig.series[0].data.length > 0 ? (
            <Chart options={chartConfig.options} series={chartConfig.series} type="area" height={350} />
          ) : (
            <div className="flex items-center justify-center h-[350px] text-gray-800">No sales data available</div>
          )}
        </div>

        <div className="bg-black rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">All Order</h2>
          </div>
          <OrderList limit={5} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard