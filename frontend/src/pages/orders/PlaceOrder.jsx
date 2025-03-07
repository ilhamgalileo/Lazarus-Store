import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import { usePayOrderMutation } from "../../redux/api/orderApiSlice";
import { useGetAddressQuery } from "../../redux/api/shippingApiSlice"; // Import query untuk mengambil alamat pengiriman

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  // Ambil shippingAddress dari database
  const { data: userData, isLoading: isLoadingAddress, error: addressError } = useGetAddressQuery(userInfo?.user?._id);

  const shippingAddress = userData?.shippingAddress?.[0]; // Ambil alamat pertama dari array

  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.qty * item.price, 0) || 0;
  const totalWeight = cart.cartItems.reduce((acc, item) => acc + (item.weight || 0) * item.qty, 0);
  const shippingPrice = totalWeight < 1000 ? 0 : Math.ceil(totalWeight / 1000) * 15000;
  const taxPrice = Math.round((itemsPrice + shippingPrice) * 0.11);
  const totalPrice = Math.round(itemsPrice + shippingPrice + taxPrice);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();

  // Validasi apakah shippingAddress sudah ada
  useEffect(() => {
    if (!isLoadingAddress && !shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, isLoadingAddress, navigate]);

  const handlePaymentProcess = async () => {
    if (!shippingAddress) {
      toast.error("Shipping address is required");
      return;
    }

    const res = await createOrder({
      orderItems: cart.cartItems,
      shippingAddress: shippingAddress, // Gunakan shippingAddress dari database
      paymentMethod: cart.paymentMethod,
      itemsPrice: itemsPrice,
      shippingPrice: shippingPrice,
      taxPrice: taxPrice,
      totalPrice: totalPrice,
    }).unwrap();

    const token = res.token;
    dispatch(clearCartItems());

    if (token) {
      window.snap.pay(token, {
        onSuccess: async (details) => {
          try {
            await payOrder({
              orderId: res.order._id,
              details,
              payment_type: details.payment_type,
            }).unwrap();
            toast.success("Payment successful");
            navigate(`/order/${res.order._id}`);
          } catch (error) {
            toast.error(error?.data?.message || error.message);
          }
        },
        onPending: function (details) {
          console.log("Payment pending:", details);
          navigate(`/order/${res.order._id}`);
        },
        onError: function (details) {
          toast.error("Payment failed. Please try again.");
        },
        onClose: function () {
          console.log("Customer closed the popup without finishing the payment");
          toast.warn("Payment cancelled. Please try again.");
        },
      });
    } else {
      throw new Error("Payment token not found");
    }
  };

  const placeOrderHandler = async () => {
    try {
      if (!window.snap) {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.async = true;
        script.onload = async () => {
          await handlePaymentProcess();
        };
        document.body.appendChild(script);
      } else {
        await handlePaymentProcess();
      }
    } catch (error) {
      toast.error(error.message || "Payment failed. Please try again.");
    }
  };

  if (isLoadingAddress) {
    return <Loader />;
  }

  if (addressError) {
    return <Message variant="danger">{addressError.data?.message || "Failed to load shipping address"}</Message>;
  }

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto ml-[3rem] text-gray-950">
            <table className="w-full">
              <thead>
                <tr className="text-center">
                  <th className="py-2 px-3">Image</th>
                  <th className="py-2 px-3">Product</th>
                  <th className="py-2 px-3">Qty</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Total</th>
                  <th className="py-2 px-3">Weight</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {cart.cartItems.map((item) => (
                  <tr key={item.product}>
                    <td className="flex justify-center items-center">
                      <img src={item?.images[0]} alt={item.name} className="w-16 h-16 object-cover" />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>Rp{item.price.toLocaleString()}</td>
                    <td>Rp{(item.qty * item.price).toLocaleString()}</td>
                    <td>{item.weight}gr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 ml-[7rem]">
          <h2 className="text-xl font-semibold mb-2 text-gray-950">Order Summary:</h2>
          <ul className="text-gray-950 text-lg">
            <li>Items: Rp{itemsPrice.toLocaleString()}</li>
            <li>Shipping: Rp{shippingPrice.toLocaleString()}</li>
            <li>Tax: Rp{taxPrice.toLocaleString()}</li>
            <li className="mt-1 pt-2 border-t border-black w-1/5">Total: Rp{totalPrice.toLocaleString()}</li>
          </ul>
        </div>
        <button
          className="bg-orange-500 py-2 px-4 rounded w-[70rem] mt-4 ml-[10rem]"
          onClick={placeOrderHandler}
          disabled={isLoading || isLoadingAddress}
        >
          {isLoading ? <Loader /> : "Place Order"}
        </button>

        {error && <Message variant="danger">{error.data.message}</Message>}
      </div>
    </>
  );
};

export default PlaceOrder;