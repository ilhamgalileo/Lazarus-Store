import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useUploadProductImageMutation,
    useUpdateProductMutation
} from "../../redux/api/productApiSlice"
import { useFetchCateQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu"

const ProductUpdate = () => {
    const params = useParams()

    const { data: productData } = useGetProductByIdQuery(params.id)

    const [image, setImage] = useState(productData?.image || '')
    const [name, setName] = useState(productData?.name || '')
    const [description, setDescription] = useState(productData?.description || '')
    const [price, setPrice] = useState(productData?.price || '')
    const [category, setCategory] = useState(productData?.category || '')
    const [brand, setBrand] = useState(productData?.brand || '')
    const [quantity, setQuantity] = useState(productData?.quantity || '')
    const [stock, setStock] = useState(productData?.countInStock)

    const navigate = useNavigate()

    const { data: categories = [] } = useFetchCateQuery()
    const [uploadProductImage] = useUploadProductImageMutation()
    const [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteProductMutation()

    useEffect(() => {
        if (productData && productData._id) {
            setName(productData.name)
            setDescription(productData.description)
            setPrice(productData.price)
            setCategory(productData.category)
            setBrand(productData.brand)
            setQuantity(productData.quantity)
            setStock(productData.countInStock)
        }
    }, [productData])

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0])
        try {
          const res = await uploadProductImage(formData).unwrap()
          toast.success("Item added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          })
          setImage(res.image)
        } catch (err) {
          toast.success("Item added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          })
        }
      }

      const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("image", image)
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("quantity", quantity)
            formData.append("brand", brand)
            formData.append("countInStock", stock)

            const data = await updateProduct({ productId: params._id, formData });

            if (data) {
                toast.success('susscessfully updated')
                navigate("/admin/allproductslist")
            } else if(!data) {
                toast.error(data.error)
                return
            }
        } catch (error) {
            console.error(error);
            toast.error("Product update failed. Try Again.")
        }
    }

    const deleteHandler = async () => {
        try {
            let answer = window.confirm('Are you sure?')
            if (!answer) return

            const { data } = await deleteProduct(params.id)
            toast.success('successfully deleted')
            setTimeout(() => {
                navigate('/admin/allproductslist')
                window.location.reload()
            }, 1000)

        } catch (error) {
            console.log(error)
            toast.error("Delete failed")
        }
    }

    return (
        <div className=" container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12"> Create Product</div>

                    {image && (
                        <div className="text-center">
                            <img
                                src={image}
                                alt="product"
                                className="block mx-auto max-h-[200px]"
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
                            {image ? image.name : "Upload Image"}

                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className={!image ? "hidden" : "text-white"}
                            />
                        </label>
                    </div>

                    <div className="p-3">
                        <div className="flex flex-wrap">
                            <div className="one">
                                <label htmlFor="name"> Name</label>< br />
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="two ml-10">
                                <label htmlFor="name block">Price</label>< br />
                                <input
                                    type="number"
                                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    value={price || ''}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap">
                            <div className="one">
                                <label htmlFor="name block"> Quantity</label>< br />
                                <input
                                    type="number"
                                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="two ml-10">
                                <label htmlFor="name block">Brand</label>< br />
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    value={brand}
                                    onChange={e => setBrand(e.target.value)}
                                />
                            </div>
                        </div>
                        <label htmlFor="" className="my-5"> Description</label>
                        <textarea
                            type="text"
                            className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>

                        <div className="flex justify-between">
                            <div>
                                <label htmlFor="name block">Count In Stock</label> <br />
                                <input
                                    type="text"
                                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Category</label> <br />
                                <select
                                    placeholder="Choose Category"
                                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                                    onChange={e => setCategory(e.target.value)}
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Choose Category
                                    </option>
                                    {categories && categories.length > 0 ? (
                                        categories.map((e) => (
                                            <option key={e._id} value={e._id}>
                                                {e.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option>No categories available</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={submitHandler}
                                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
                            > Update
                            </button>
                            <button
                                onClick={deleteHandler}
                                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-orange-600"
                            > Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProductUpdate