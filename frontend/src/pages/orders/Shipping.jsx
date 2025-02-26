import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { toast } from "react-toastify";
import { saveShippingAddress, savePaymentMethod } from "../../redux/features/cart/cartSlice";
import { useGetProvincesQuery, useGetCitiesQuery, useGetDistrictsQuery } from "../../redux/api/shippingApiSlice";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState(
    userInfo?.user?.isAdmin ? "" : "qris/bank"
  );

  const [qrisBankDetails, setQrisBankDetails] = useState({
    address: shippingAddress?.province || "",
    city: shippingAddress?.cityCode || "",
    postalCode: shippingAddress?.postalCode || "",
  });

  const [selectedProvince, setSelectedProvince] = useState(shippingAddress?.provinceCode || "");
  const [selectedCity, setSelectedCity] = useState(shippingAddress?.cityCode || "");
  const [selectedDistrict, setSelectedDistrict] = useState(shippingAddress?.districtCode || "");

  const { data: provinces, isLoading: isLoadingProvinces, error: errorProvinces } = useGetProvincesQuery();
  const { data: cities, isLoading: isLoadingCities, error: errorCities } =
    useGetCitiesQuery(selectedProvince || undefined, { skip: !selectedProvince });
  const { data: districts, isLoading: isLoadingDistricts, error: errorDistricts } =
    useGetDistrictsQuery(selectedCity || undefined, { skip: !selectedCity });

  useEffect(() => {
    if (selectedProvince) {
      setSelectedCity("");
      setSelectedDistrict("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      setSelectedDistrict("");
    }
  }, [selectedCity]);

  const handleQrisBankChange = (e) => {
    const { name, value } = e.target;
    setQrisBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const InputField = ({ label, name, value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-gray-950 mb-2">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-2 h-[3rem] border rounded shadow-xl text-white bg-neutral-700"
        required
      />
    </div>
  );

  const handleContinue = () => {
    if (paymentMethod === "qris/bank") {
      const selectedProvinceName = provinces?.data.find((province) => province.code === selectedProvince)?.name || "";
      const selectedCityName = cities?.data.find((city) => city.code === selectedCity)?.name || "";
      const selectedDistrictName = districts?.data.find((district) => district.code === selectedDistrict)?.name || "";

      const shippingDetails = {
        address: selectedProvinceName,
        city: selectedCityName,
        postalCode: qrisBankDetails.postalCode,
        // district: selectedDistrictName,
      };

      dispatch(saveShippingAddress(shippingDetails));
      dispatch(savePaymentMethod(paymentMethod));
      navigate("/placeorder");
    } else if (paymentMethod === "cash") {
      navigate("/placeorder/cash");
    } else if (paymentMethod === "store-transfer") {
      navigate("/placeorder/store-transfer");
    } else {
      toast.error("Please select a payment method.");
    }
  };

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
              <DropdownField
                label="Province"
                name="province"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                options={provinces?.data || []}
                isLoading={isLoadingProvinces}
                error={errorProvinces}
              />
              <DropdownField
                label="City"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                options={cities?.data || []}
                isLoading={isLoadingCities}
                error={errorCities}
              />
              <DropdownField
                label="District"
                name="district"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                options={districts?.data || []}
                isLoading={isLoadingDistricts}
                error={errorDistricts}
              />
              <InputField
                label="Postal Code"
                name="postalCode"
                value={qrisBankDetails.postalCode}
                onChange={handleQrisBankChange}
                placeholder="Enter postal code"
              />
              <button
                className="bg-orange-600 text-gray-100 py-2 px-4 rounded-lg w-full mt-4"
                type="button"
                onClick={handleContinue}
              >
                Continue
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const DropdownField = ({ label, name, value, onChange, options = [], isLoading, error }) => (
  <div className="mb-4">
    <label className="block text-gray-950 mb-2">{label}</label>
    <select
      name={name}
      className={`w-full p-2 h-[3rem] border rounded shadow-xl text-white bg-neutral-700 
        ${isLoading || error ? "opacity-50 cursor-not-allowed" : ""}`}
      value={value}
      required
      onChange={onChange}
      disabled={isLoading || error}
      aria-busy={isLoading}
    >
      <option value="" selected={!value}>Select {label}</option>
      {isLoading && <option disabled>Loading...</option>}
      {error && <option disabled>Error loading {label}</option>}
      {Array.isArray(options) && options.map((option) => (
        <option key={option.code} value={option.code}>{option.name}</option>
      ))}
    </select>
  </div>
);

export default Shipping;