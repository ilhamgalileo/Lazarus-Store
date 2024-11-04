import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import Message from "../../components/Message"
import ProgressSteps from "../../components/ProgressSteps"
import Loader from "../../components/loader"
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice"
import { clearCartItems } from "../../redux/features/cart/cartSlice"
import { usePayOrderMutation } from "../../redux/api/orderApiSlice"

const PlaceOrder = () => {
    const navigate = useNavigate()
    const cart = useSelector(state => state.cart)
    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) || 0;
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = itemsPrice >= 10000 && itemsPrice < 1000000 ? 1000 :
        itemsPrice >= 1000000 ? 100000 :
            itemsPrice <= 100 ? 1 :
                itemsPrice <= 500 ? 5 :
                    itemsPrice < 1000 ? 8 : 10;
    const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) || 0);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation()
    const [payOrder] = usePayOrderMutation()

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate("/shipping")
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate])

    const dispatch = useDispatch()

    const placeOrderHandler = async () => {
        try {
            if (!window.snap) {
                const script = document.createElement('script')
                script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
                script.async = true
                script.onload = async () => {
                    await handlePaymentProcess()
                }
                document.body.appendChild(script)
            } else {
                await handlePaymentProcess()
            }
        } catch (error) {
            toast.error(error.message || 'Payment failed. Please try again.');
        }
    }

    const handlePaymentProcess = async () => {
        const res = await createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }).unwrap()
        console.log(res)

        const token = res.token
        dispatch(clearCartItems())
        if (token) {
            window.snap.pay(token, {
                onSuccess: async (details) => {
                    try {
                        await payOrder({
                            orderId: res.order._id,
                            details,
                            payment_type: details.payment_type
                        }).unwrap()
                        toast.success('payment successfully')
                        navigate(`/order/${res.order._id}`);
                    } catch (error) {
                        toast.error(error?.data?.message || error.message);
                    }
                    navigate(`/order/${res.order._id}`)
                },
                onPending: function (details) {
                    console.log('Payment pending:', details)
                    navigate(`/order/${res.order._id}`)
                },
                onError: function (details) {
                    console.error('Payment error:', details)
                    toast.error('Payment failed. Please try again.')
                },
                onClose: function () {
                    console.log('Customer closed the popup without finishing the payment')
                    toast.warn('Payment cancelled. Please try again.')
                }
            })
        } else {
            throw new Error('Payment token not found');
        }
    }

    return (
        <>
            <ProgressSteps step1 step2 step3 />
            <div className="container mx-auto mt-8">
                {cart.cartItems.length === 0 ? (
                    <Message>Your cart id empty</Message>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <td className="px-1 py-2 text-left align-top">Image</td>
                                    <td className="px-1 py-2 text-left">Product</td>
                                    <td className="px-1 py-2 text-left">Quantity</td>
                                    <td className="px-1 py-2 text-left">Price</td>
                                    <td className="px-1 py-2 text-left">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-2">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        </td>
                                        <td className="p-2">{item.qty}</td>
                                        <td className="p-2">RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(item.price)}</td>
                                        <td className="p-2">
                                            RP. {isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(item.qty * item.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
                    <div className="flex justify-between flex-wrap p-8 bg-[#181818]">
                        <ul className="text-lg">
                            <li>
                                <span className="font-semibold mb-4">items: {" "}</span>
                                RP.{isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(itemsPrice)}
                            </li>
                            <li>
                                <span className="font-semibold mb-4">Shipping: {" "}</span>
                                RP.{isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(shippingPrice)}
                            </li>
                            <li>
                                <span className="font-semibold mb-4">Tax: {" "}</span>
                                RP.{isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(taxPrice)}
                            </li>
                            <li>
                                <span className="font-semibold mb-4">Total: {" "}</span>
                                RP.{isLoading ? <Loader /> : new Intl.NumberFormat('id-ID').format(totalPrice)}
                            </li>
                        </ul>

                        {error && <Message variant='danger'>{error.data.message}</Message>}

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
                            <p>
                                <strong>Address:</strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.city}{" "}
                                {cart.shippingAddress.postalCode}, {" "}
                                {cart.shippingAddress.country}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                            <strong>Method:</strong> {cart.paymentMethod}
                        </div>
                    </div>

                    <button
                        type="button"
                        className="bg-orange-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
                        disabled={cart.cartItems === 0}
                        onClick={placeOrderHandler}
                    >
                        Place Order
                    </button>
                    {isLoading && <Loader />}
                </div>
            </div>
        </>
    )
}

export default PlaceOrder