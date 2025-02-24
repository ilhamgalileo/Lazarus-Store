import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { toast } from "react-toastify";
import { saveShippingAddress, savePaymentMethod } from "../../redux/features/cart/cartSlice";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState(
    userInfo?.user?.isAdmin ? "" : "qris/bank"
  );
  const [qrisBankDetails, setQrisBankDetails] = useState({
    address: shippingAddress?.address || "",
    city: shippingAddress?.city || "",
    postalCode: shippingAddress?.postalCode || "",
    country: shippingAddress?.country || "",
  });

  useEffect(() => {
    console.log("Redux Shipping Address:", shippingAddress);
    console.log("Local Storage Cart:", localStorage.getItem("cart"));
  }, [shippingAddress]);

  const handleQrisBankChange = (e) => {
    const { name, value } = e.target;
    setQrisBankDetails((prev) => ({ ...prev, [name]: value }));
    console.log(`Updating ${name} to ${value}`);
  };

  const handleContinue = () => {

    if (paymentMethod === "qris/bank") {
      dispatch(saveShippingAddress(qrisBankDetails));
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    } else if (paymentMethod === "cash") {
      navigate("/placeorder/cash");
    } else if (paymentMethod === "store-transfer") {
      navigate("/placeorder/store-transfer")
    } else {
      toast.error("Please select a payment method.");
    }
  }

  return (
    <div className="container mx-auto">
      <ProgressSteps step1 step2 />
      <div className="mt-[2rem] flex justify-around items-center flex-wrap">
        <form className="w-[40rem] text-gray-950">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>

          <div className="mb-4">
            <label className="block text-gray-500">Select Payment Method</label>
            {!userInfo.user.isAdmin && (
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-orange-500"
                    name="paymentMethod"
                    value="qris/bank"
                    checked={paymentMethod === "qris/bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2">Qris or Transfer</span>
                </label>
              </div>
            )}
            {userInfo.user.isAdmin && (
              <>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-orange-500"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2">Cash</span>
                  </label>
                </div>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-orange-500"
                      name="paymentMethod"
                      value="store-transfer"
                      checked={paymentMethod === "store-transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="ml-2">In Store Transfer</span>
                  </label>
                </div>
              </>
            )}
          </div>

          {paymentMethod === "qris/bank" && (
            <>
              <InputField
                label="Address"
                name="address"
                value={qrisBankDetails.address}
                onChange={handleQrisBankChange}
                placeholder="Enter address"
              />
              <InputField
                label="City"
                name="city"
                value={qrisBankDetails.city}
                onChange={handleQrisBankChange}
                placeholder="Enter city"
              />
              <InputField
                label="Postal Code"
                name="postalCode"
                value={qrisBankDetails.postalCode}
                onChange={handleQrisBankChange}
                placeholder="Enter postal code"
              />
              <InputField
                label="Country"
                name="country"
                value={qrisBankDetails.country}
                onChange={handleQrisBankChange}
                placeholder="Enter country"
              />
              <button
                className="bg-orange-500 text-white py-2 px-4 rounded-lg w-full mt-4"
                type="button"
                onClick={handleContinue}
              >
                Continue
              </button>
            </>
          )}

          {paymentMethod === "cash" && (
            <div className="text-center mt-4">
              <p className="text-gray-500">You will be redirected to the cash order page.</p>
              <button
                className="bg-green-700 text-white py-2 px-4 rounded-lg w-full mt-4"
                type="button"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          )}
          {paymentMethod === "store-transfer" && (
            <div className="text-center mt-4">
              <p className="text-gray-500">You will be redirected to the store transfer page.</p>
              <button
                className="bg-green-700 text-white py-2 px-4 rounded-lg w-full mt-4"
                type="button"
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div className="mb-4">
    <label className="block text-white mb-2">{label}</label>
    <input
      type={type}
      name={name}
      className="w-full p-2 border rounded"
      placeholder={placeholder}
      value={value}
      required
      onChange={onChange}
    />
  </div>
);

export default Shipping;
