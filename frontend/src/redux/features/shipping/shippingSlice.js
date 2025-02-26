import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProvince: null,
  selectedCity: null,
  selectedDistrict: null,
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setProvince: (state, action) => {
      state.selectedProvince = action.payload;
      state.selectedCity = null; 
      state.selectedDistrict = null; 
    },
    setCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedDistrict = null;
    },
    setDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
    },
  },
});

export const { setProvince, setCity, setDistrict } = shippingSlice.actions;
export default shippingSlice.reducer;
