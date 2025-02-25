import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCreateProductMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCateQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/loader";

const ProductList = () => {
    const [images, setImages] = useState([])
    const [imageFiles, setImageFiles] = useState([])
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState(0);
    const [weight, setWeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [createProduct] = useCreateProductMutation();
    const { data: categories } = useFetchCateQuery();

    const uploadFileHandler = (e) => {
        const files = Array.from(e.target.files);
        const previewUrls = files.map((file) => URL.createObjectURL(file));

        setImages((prev) => [...prev, ...previewUrls]);
        setImageFiles((prev) => [...prev, ...files]);
        toast.success("Images added successfully");
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newImageFiles = imageFiles.filter((_, i) => i !== index);
        setImages(newImages);
        setImageFiles(newImageFiles);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (imageFiles.length === 0) {
            toast.error("Please upload at least one image");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData()

            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("quantity", quantity)
            formData.append("brand", brand)
            formData.append("weight", weight)
            formData.append("countInStock", stock)
            imageFiles.forEach((file) => {
                formData.append("images", file)
            })

            const data = await createProduct(formData).unwrap()

            if (data) {
                toast.success(`${data.product.name} created successfully`)
                navigate("/admin/allproductslist")
            } else {
                toast.error("Failed to create product")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error(error?.data?.message || "Product creation failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        return () => {
            images.forEach((url) => URL.revokeObjectURL(url));
        }
    }, [images])

    return (
        <div className="container xl:mx-[9rem] sm:mx-[0]">
            <div className="flex flex-col md:flex-row text-gray-950">
                <AdminMenu />
                <div className="md:w-3/4 p-3">
                    <h2 className="h-12">Create Product</h2>
                    <form onSubmit={submitHandler}>
                        <div className="mb-3">
                            <label
                                className={`border text-black border-gray-800 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 ${loading ? "opacity-50" : ""
                                    }`}
                            >
                                {loading ? (
                                    <Loader />
                                ) : images.length > 0 ? (
                                    `${images.length} selected`
                                ) : (
                                    "Upload Images"
                                )}
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

                        {/* Image Previews */}
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

                        {/* Product Details Form */}
                        <div className="p-3">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="brand">Brand</label>
                                    <input
                                        type="text"
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <label htmlFor="countInStock">Count In Stock</label>
                                    <input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                        required
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="category">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                        required
                                    >
                                        <option value="" disabled>
                                            Choose Category
                                        </option>
                                        {categories?.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex-1">
                                    <label htmlFor="weight">Weight</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            className="p-4 mb-3 w-[10rem] border rounded-lg bg-[#101011] text-white"
                                            required
                                        />
                                        <span className="ml-2 text-gray-950">gr</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                                    rows="4"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="py-4 px-10 text-white mt-5 rounded-lg text-lg font-bold bg-orange-600 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Product"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductList