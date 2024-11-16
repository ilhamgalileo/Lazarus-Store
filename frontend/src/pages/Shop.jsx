import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useGetFilterProductsQuery } from "../redux/api/productApiSlice"
import { setCategories, setProducts, setChecked, setSelectedBrand } from "../redux/features/shop/shopSlice"
import Loader from "../components/loader"
import { useFetchCateQuery } from "../redux/api/categoryApiSlice"
import ProductCard from "./Products/ProductCard"

const Shop = () => {
  const dispatch = useDispatch()
  const { categories, products, checked, radio } = useSelector((state) => state.shop)

  const categoriesQuery = useFetchCateQuery()
  const [priceFilter, setPriceFilter] = useState("")

  const filteredProductsQuery = useGetFilterProductsQuery({ checked, radio })

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data))
    }
  }, [categoriesQuery.data, dispatch])

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            )
          }
        )
        dispatch(setProducts(filteredProducts))
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter])

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand)
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    )
    dispatch(setSelectedBrand(brand))
    dispatch(setProducts(productsByBrand))
  }

  const handleCheck = (value, id) => {
    const updateChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id)
    dispatch(setChecked(updateChecked))
  }

  const handleReset = () => {
    setPriceFilter("")
    dispatch(setChecked([]))
    dispatch(setSelectedBrand(null))
    dispatch(setProducts([]))
  }

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    )
  ]

  const handlePriceChange = e => {
    setPriceFilter(e.target.value)
  }

  return (
    <>
      <div className="container mx-auto px-5" style={{ maxWidth: "90%" }}>
        <div className="flex md:flex-row">
          <div className="bg-[#151515] p-3 mt-2 mb-4 w-64 flex-shrink-0">
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by categories
            </h2>

            <div className="p-5">
              {categories?.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`checkbox-${c._id}`}
                      checked={checked.includes(c._id)}
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h4 text-orange-600 bg-gray-100 border-gray-300 rounded
                      focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                      focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-${c._id}`}
                      className="ml-2 text-sm font-medium
                    text-white dark:text-gray-300">
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Brand
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand} className="flex items-center mr-4 mb-5">
                  <input
                    type="radio"
                    id={brand}
                    name="brand"
                    onChange={() => handleBrandClick(brand)}
                    className="w-4 h4 bg-gray-100 border-gray-300 rounded
                      focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                      focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={brand}
                    className="ml-2 text-sm font-medium
                    text-white dark:text-gray-300">
                    {brand}
                  </label>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
              Filter by Price
            </h2>

            <div className="p-5">
              <input
                type="text"
                placeholder="Enter price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="p-5 pt-0">
              <button
                className="w-full border my-4"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex-1 p-3">
            <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
            {products.length === 0 ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products?.map((p) => (
                  <div key={p._id} className="flex justify-center">
                    <div className="w-full" style={{ maxWidth: "320px" }}>
                      <ProductCard p={p} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Shop