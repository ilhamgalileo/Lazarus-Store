import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { saveShippingAddress, savePaymentMethod } from "../../redux/features/cart/cartSlice";

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-white mb-2">{label}</label>
    <input
      type="text"
      className="w-full p-2 border rounded"
      placeholder={placeholder}
      value={value}
      required
      onChange={onChange}
    />
  </div>
)

const Shipping = () => {
  const cart = useSelector((state) => state.cart)
  const { userInfo } = useSelector((state) => state.auth)
  const { shippingAddress } = cart

  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "")
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "")
  const [country, setCountry] = useState(shippingAddress.country || "")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isContinueDisabled = !paymentMethod || !address || !city || !postalCode || !country;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <div className="container mx-auto">
      <ProgressSteps step1 step2 />
      <div className="mt-[2rem] flex justify-around items-center flex-wrap">
        <form onSubmit={submitHandler} className="w-[40rem]">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <InputField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
          <InputField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
          <InputField
            label="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Enter postal code"
          />
          <InputField
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country"
          />

          <div className="mb-4">
            <label className="block text-gray-400">Select Method</label>
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
            {userInfo?.user?.isAdmin && (
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
            )}
          </div>

          <button
            className={`py-2 px-4 rounded-full text-lg w-full ${
              isContinueDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 text-white"
            }`}
            type="submit"
            disabled={isContinueDisabled}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default Shipping