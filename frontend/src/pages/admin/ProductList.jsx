import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import {
    useCreateProductMutation,
    useGetProductByIdQuery,
    useAllProductsQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useGetTopProductsQuery,
    useGetNewProductsQuery,
    useGetProductDetailsQuery,
    useCreateReviewMutation,
    useUploadProductImageMutation,
} from "../../redux/api/productApiSlice"
import { useFetchCateQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"
import AdminMenu from "./AdminMenu"
import Loader from "../../components/loader"

const ProductList = () => {
    const [images, setImages] = useState([])
    const [imageFiles, setImageFiles] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState('')
    const [brand, setBrand] = useState('')
    const [stock, setStock] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [uploadProductImage] = useUploadProductImageMutation()
    const [createProduct] = useCreateProductMutation()
    const { data: categories } = useFetchCateQuery()

    const submitHandler = async (e) => {
        e.preventDefault()  

        try {
            const formData = new FormData()
            imageFiles.forEach((file) => {
                formData.append("images", file)
            })

            const uploadResult = await uploadProductImage(formData).unwrap()

            if (!uploadResult.images) {
                toast.error("Image upload failed")
                setLoading(false)
                return
            }

            const productData = new FormData()
            productData.append("name", name)
            productData.append("description", description)
            productData.append("price", price)
            productData.append("category", category)
            productData.append("quantity", quantity)
            productData.append("brand", brand)
            productData.append("countInStock", stock)

            uploadResult.images.forEach((imgUrl) => {
                productData.append("images", imgUrl)
            })

            const { data } = await createProduct(productData)

            if (data) {
                toast.success(`${data.product.name} is created`)
                navigate("/")
            } else if (!data) {
                toast.error("Creating product failed")
                return
            }
        } catch (error) {
            console.error(error)
            toast.error("Product create failed. Try Again.")
        }
    }

    const uploadFileHandler = (e) => {
        const files = Array.from(e.target.files)
        const newImagePreviews = files.map((file) => URL.createObjectURL(file));

        setImages((prevImages) => [...prevImages, ...newImagePreviews]);
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
    }

    useEffect(() => {
        return () => {
            images.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        const newImageFiles = imageFiles.filter((_, i) => i !== index)
        setImages(newImages)
        setImageFiles(newImageFiles)
    };

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <div className="h-12">Create Product</div>
                    <div className="mb-3">
                        <label
                            className={`border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 ${loading ? 'opacity-50' : ''}`}
                        >
                            {loading ? <Loader /> :
                                images.length > 0 ? `${images.length} selected` : "Upload Images"}
                            <input
                                type="file"
                                name="images"
                                accept="image/*"
                                multiple
                                onChange={uploadFileHandler}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                    </div>

                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative w-[10rem] h-[10rem]">
                                    <img
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    {!loading && (
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                            type="button"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

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
                                    value={price}
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
                        <button
                            onClick={submitHandler}
                            className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-orange-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductList