import Chart from 'react-apexcharts'
import { useGetUsersQuery } from '../../redux/api/usersApiSlice'
import { useGetTotalSalesQuery, useGetTotalOrderQuery, useGetTotalSalesByDateQuery } from '../../redux/api/orderApiSlice'
import { useState, useEffect } from 'react'
import OrderList from './OrderList'
import AdminMenu from './AdminMenu'
import Loader from '../../components/loader'
import { FaUser, FaMoneyBill, FaShoppingBag } from 'react-icons/fa'

const AdminDashboard = () => {
    const { data: sales, isLoading } = useGetTotalSalesQuery()
    const { data: customers, isLoading: loading } = useGetUsersQuery()
    const { data: orders, isLoading: loadingTwo } = useGetTotalOrderQuery()
    const { data: salesDetail } = useGetTotalSalesByDateQuery()

    const [state, setState] = useState({
        options: {
            chart: {
                type: 'line',
            },
            tooltip: {
                theme: 'dark',
            },
            color: ['#00E396'],
            datalabels: {
                enabled: true,
            },
            stroke: {
                curve: "smooth"
            },
            title: {
                text: 'sales Trend',
                align: 'left'
            },
            grid: {
                borderColor: "#ccc"
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: [],
                title: {
                    text: 'Date'
                }
            },
            yaxis: {
                categories: [],
                title: {
                    text: 'Sales'
                },
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
        series: [{ name: "sales", data: [] }],
    })

    useEffect(() => {
        if (salesDetail) {
            console.log("Sales Detail Data:", salesDetail)
            const formattedSalesDate = salesDetail
                .map((item) => ({
                    x: item._id,
                    y: item.totalSales,
                }))

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formattedSalesDate.map((item) => item.x)
                    }
                },

                series: [{
                    name: "Sales",
                    data: formattedSalesDate.map((item) => item.y)
                }]
            }))
        }
    }, [salesDetail])

    return <>
        <AdminMenu />
        <section className='xl:ml-[4rem] md:ml-[0rem]'>
            <div className='w-[80%] flex justify-around flex-wrap'>
                <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
                    <div className='font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3'>
                    <FaMoneyBill color="white" size="1.5em" />
                    </div>
                    <p className="mt-5"> Sales</p>
                    <h1 className='text-xl font-bold'>
                        RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(sales.totalSales)}
                    </h1>
                </div>

                <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
                    <div className='font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3'>
                    <FaUser color="white" size="1.5em" />
                    </div>
                    <p className="mt-5"> Customers</p>
                    <h1 className='text-xl font-bold'>
                        {isLoading ? <Loader /> : customers.length}
                    </h1>
                </div>

                <div className="rounded-lg bg-black p-5 w-[20rem] mt-5">
                    <div className='font-bold rounded-full w-[3rem] bg-orange-500 text-center p-3'>
                    <FaShoppingBag color="white" size="1.5em" />
                    </div>
                    <p className="mt-5"> All Orders</p>
                    <h1 className='text-xl font-bold'>
                        {isLoading ? <Loader /> : orders.totalOrders}
                    </h1>
                </div>
            </div>

            <div className='ml-[10rem] mt-[4rem]'>
                <Chart
                    options={state.options}
                    series={state.series}
                    type='line'
                    width='70%'
                />
            </div>
            <div className='mt-[4rem]'>
                <OrderList />
            </div>
        </section>
    </>
}

export default AdminDashboard