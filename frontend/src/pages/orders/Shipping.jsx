import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../../components/ProgressSteps";
import { toast } from "react-toastify";
import { saveShippingAddress, savePaymentMethod } from "../../redux/features/cart/cartSlice";
import { useGetProvincesQuery, useGetCitiesQuery, useGetDistrictsQuery, useGetVillagesQuery } from "../../redux/api/shippingApiSlice";
import Select from "react-select";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { shippingAddress } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState(
    userInfo?.user?.isAdmin ? "" : "qris/bank"
  );

  const [qrisBankDetails, setQrisBankDetails] = useState({
    recipient: shippingAddress?.recipient || "",
    province: shippingAddress?.province || "",
    city: shippingAddress?.cityCode || "",
    postalCode: shippingAddress?.postalCode || "",
    district: shippingAddress?.district || "",
    village: shippingAddress?.village || "",
    detailAddress: shippingAddress?.detail_address || "",
  });

  const [selectedProvince, setSelectedProvince] = useState(shippingAddress?.provinceCode || "");
  const [selectedCity, setSelectedCity] = useState(shippingAddress?.cityCode || "");
  const [selectedDistrict, setSelectedDistrict] = useState(shippingAddress?.districtCode || "");
  const [selectedVillage, setSelectedVillage] = useState(shippingAddress?.villageCode || "");

  const { data: provinces, isLoading: isLoadingProvinces, error: errorProvinces } = useGetProvincesQuery();
  const { data: cities, isLoading: isLoadingCities, error: errorCities } =
    useGetCitiesQuery(selectedProvince || undefined, { skip: !selectedProvince });
  const { data: districts, isLoading: isLoadingDistricts, error: errorDistricts } =
    useGetDistrictsQuery(selectedCity || undefined, { skip: !selectedCity });
  const { data: villages, isLoading: isLoadingVillages, error: errorVillages } =
    useGetVillagesQuery(selectedDistrict || undefined, { skip: !selectedDistrict });

  useEffect(() => {
    if (selectedProvince) {
      setSelectedCity("");
      setSelectedDistrict("");
      setSelectedVillage("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity) {
      setSelectedDistrict("");
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      setSelectedVillage("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedVillage && villages?.data) {
      const villageData = villages.data.find((v) => v.code === selectedVillage);
      setQrisBankDetails((prev) => ({
        ...prev,
        postalCode: villageData?.postal_code || ""
      }));
    }
  }, [selectedVillage, villages?.data]);

  const handleQrisBankChange = (e) => {
    const { name, value } = e.target;
    setQrisBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const InputField = ({ label, name, value, onChange, placeholder, readOnly = false }) => (
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
        readOnly={readOnly}
      />
    </div>
  );

  const handleContinue = () => {
    if (paymentMethod === "qris/bank") {
      const selectedProvinceName = provinces?.data.find((province) => province.code === selectedProvince)?.name || "";
      const selectedCityName = cities?.data.find((city) => city.code === selectedCity)?.name || "";
      const selectedDistrictName = districts?.data.find((district) => district.code === selectedDistrict)?.name || "";
      const selectedVillageName = villages?.data.find((village) => village.code === selectedVillage)?.name || "";

      const shippingDetails = {
        recipient: qrisBankDetails.recipient,
        province: selectedProvinceName,
        city: selectedCityName,
        postalCode: qrisBankDetails.postalCode,
        district: selectedDistrictName,
        village: selectedVillageName,
        detail_address: qrisBankDetails.detailAddress,
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

  const formatOptions = (data) => {
    return data?.map((item) => ({
      value: item.code,
      label: item.name,
    })) || [];
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
              <div className="mb-4">
                <label className="block text-gray-950">Recipient Package</label>
                <input
                  name="recipient"
                  value={qrisBankDetails.recipient}
                  onChange={handleQrisBankChange}
                  placeholder="Enter package recipient"
                  className="w-full p-2 border rounded shadow-xl text-white bg-neutral-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-950 mb-2">Province</label>
                  <Select
                    options={formatOptions(provinces?.data)}
                    isLoading={isLoadingProvinces}
                    isSearchable 
                    placeholder="Select Province"
                    value={formatOptions(provinces?.data).find((opt) => opt.value === selectedProvince)}
                    onChange={(selectedOption) => setSelectedProvince(selectedOption?.value || "")}
                    className="text-gray-950"
                    menuPlacement="bottom" 
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-950 mb-2">City</label>
                  <Select
                    options={formatOptions(cities?.data)}
                    isLoading={isLoadingCities}
                    isSearchable
                    placeholder="Select City"
                    value={formatOptions(cities?.data).find((opt) => opt.value === selectedCity)}
                    onChange={(selectedOption) => setSelectedCity(selectedOption?.value || "")}
                    className="text-gray-950"
                    menuPlacement="bottom"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-950 mb-2">District</label>
                  <Select
                    options={formatOptions(districts?.data)}
                    isLoading={isLoadingDistricts}
                    isSearchable
                    placeholder="Select District"
                    value={formatOptions(districts?.data).find((opt) => opt.value === selectedDistrict)}
                    onChange={(selectedOption) => setSelectedDistrict(selectedOption?.value || "")}
                    className="text-gray-950"
                    menuPlacement="bottom"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-950 mb-2">Village</label>
                  <Select
                    options={formatOptions(villages?.data)}
                    isLoading={isLoadingVillages}
                    isSearchable
                    placeholder="Select Village"
                    value={formatOptions(villages?.data).find((opt) => opt.value === selectedVillage)}
                    onChange={(selectedOption) => setSelectedVillage(selectedOption?.value || "")}
                    className="text-gray-950"
                    menuPlacement="bottom"
                  />
                </div>
                <InputField
                  label="Postal Code"
                  name="postalCode"
                  value={qrisBankDetails.postalCode}
                  placeholder="Postal code will be set automatically"
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-950">Detail Address</label>
                <textarea
                  name="detailAddress"
                  value={qrisBankDetails.detailAddress}
                  onChange={handleQrisBankChange}
                  placeholder="Enter your detailed address"
                  className="w-full p-2 h-[5rem] border rounded shadow-xl text-white bg-neutral-700"
                  required
                />
              </div>

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

export default Shipping;