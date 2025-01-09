import Chart from 'react-apexcharts'
import { useGetUserCountQuery, useGetUsersQuery } from '../../redux/api/usersApiSlice'
import { useGetTotalSalesQuery, useGetTotalOrderQuery, useGetTotalSalesByDateQuery } from '../../redux/api/orderApiSlice'
import { useState, useEffect } from 'react'
import OrderList from './OrderList'
import AdminMenu from './AdminMenu'
import Loader from '../../components/loader'
import { FaUser, FaMoneyBill, FaShoppingBag } from 'react-icons/fa'

const AdminDashboard = () => {
    const { data: sales, isLoading: loadingSales } = useGetTotalSalesQuery();
    const { data: customers, isLoading: loadingCustomers } = useGetUserCountQuery()
    const { data: orders, isLoading: loadingOrders } = useGetTotalOrderQuery()
    const { data: salesDetail } = useGetTotalSalesByDateQuery()

    const [state, setState] = useState({
        options: {
            chart: { type: 'line' },
            tooltip: { theme: 'dark' },
            color: ['#00E396'],
            datalabels: { enabled: true },
            stroke: { curve: 'smooth' },
            title: { text: 'Sales Trend', align: 'left' },
            grid: { borderColor: '#ccc' },
            markers: { size: 1 },
            xaxis: {
                categories: [],
                title: { text: 'Date' },
            },
            yaxis: {
                categories: [],
                title: { text: 'Sales' },
                min: 0,
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5,
            },
        },
        series: [{ name: 'sales', data: [] }],
    });

    useEffect(() => {
        if (salesDetail) {
            const formattedSalesDate = salesDetail.map((item) => ({
                x: item._id,
                y: item.totalSales,
            }));

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formattedSalesDate.map((item) => item.x),
                    },
                },
                series: [
                    {
                        name: 'Sales',
                        data: formattedSalesDate.map((item) => item.y),
                    },
                ],
            }));
        }
    }, [salesDetail]);

    return (
        <>
            <AdminMenu />
            <section className="xl:ml-[4rem] md:ml-[0rem]">
                <div className="w-[80%] flex justify-around flex-wrap">
                    {/* Total Sales */}
                    <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
                        <div className="font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3">
                            <FaMoneyBill color="white" size="1.5em" />
                        </div>
                        <p className="mt-5">Sales</p>
                        <h1 className="text-xl font-bold">
                            RP.{' '}
                            {loadingSales ? (
                                <Loader />
                            ) : (
                                new Intl.NumberFormat('id-ID').format(
                                    sales?.totalSales || 0
                                )
                            )}
                        </h1>
                    </div>

                    {/* Customers */}
                    <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
                        <div className="font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3">
                            <FaUser color="white" size="1.5em" />
                        </div>
                        <p className="mt-5">Customers</p>
                        <h1 className="text-xl font-bold">
                            {loadingCustomers ? <Loader /> : customers?.userCount}
                        </h1>
                    </div>

                    {/* Orders */}
                    <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
                        <div className="font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3">
                            <FaShoppingBag color="white" size="1.5em" />
                        </div>
                        <p className="mt-5">All Orders</p>
                        <h1 className="text-xl font-bold">
                            {loadingOrders ? <Loader /> : orders?.totalOrders || 0}
                        </h1>
                    </div>
                </div>

                {/* Chart */}
                <div className="ml-[10rem] mt-[4rem]">
                    <Chart
                        options={state.options}
                        series={state.series}
                        type="bar"
                        width="70%"
                    />
                </div>

                {/* Order List */}
                <div className="mt-[4rem]">
                    <OrderList />
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;
