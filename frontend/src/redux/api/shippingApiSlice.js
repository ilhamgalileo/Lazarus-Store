import { apiSlice } from "./apiSlice";
import { SHIPPING_URL } from "../constants";

export const shippingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getProvinces: builder.query({
        query: () => `${SHIPPING_URL}/provinces`,
      }),
      getCities: builder.query({
        query: (provinceId) => `${SHIPPING_URL}/cities/${provinceId}`, 
        skip: (provinceId) => !provinceId, 
      }),
      getDistricts: builder.query({
        query: (cityId) => `${SHIPPING_URL}/districts/${cityId}`,
        skip: (cityId) => !cityId,
      }),
      getVillages: builder.query({
        query: (districtId) => `${SHIPPING_URL}/villages/${districtId}`,
        skip: (districtId) => !districtId,
      }),
    }),
  });
  
  export const { useGetProvincesQuery, useGetCitiesQuery, useGetDistrictsQuery, useGetVillagesQuery } = shippingApiSlice;