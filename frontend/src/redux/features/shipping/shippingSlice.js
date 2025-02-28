import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProvince: null,
  selectedCity: null,
  selectedDistrict: null,
  selectedVillage: null,
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setProvince: (state, action) => {
      if (state.selectedProvince?.value !== action.payload?.value) {
        state.selectedProvince = action.payload;
        state.selectedCity = null;
        state.selectedDistrict = null;
        state.selectedVillage = null;
      }
    },
    setCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedDistrict = null;
      state.selectedVillage = null;
    },
    setDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
      state.selectedVillage = null;
    },
    setVillage: (state, action) => {
      state.selectedVillage = action.payload;
    },
    resetAll: (state) => {
      state.selectedProvince = null;
      state.selectedCity = null;
      state.selectedDistrict = null;
      state.selectedVillage = null;
    },
  },
});

export const { setProvince, setCity, setDistrict, setVillage, resetAll } = shippingSlice.actions;
export default shippingSlice.reducer;