import asyncHandler from "express-async-handler";

const WILAYAH_API_BASE = "https://wilayah.id/api";

export const getProvinces = asyncHandler(async (req, res) => {
  const response = await fetch(`${WILAYAH_API_BASE}/provinces.json`);
  const data = await response.json();
  res.json(data);
  res
    .status(500)
    .json({ message: "Failed get Provinces", error: error.message });
});

export const getCities = asyncHandler(async (req, res) => {
  const { provinceId } = req.params;

  const response = await fetch(
    `${WILAYAH_API_BASE}/regencies/${provinceId}.json`
  );
  const data = await response.json();
  res.json(data);
  res.status(500).json({ message: "Failed get city", error: error.message });
});

export const getDistricts = asyncHandler(async (req, res) => {
  const { cityId } = req.params;
  try {
    const response = await fetch(
      `${WILAYAH_API_BASE}/districts/${cityId}.json`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed get districts",
      error: error.message,
    });
  }
});
