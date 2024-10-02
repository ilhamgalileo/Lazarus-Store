import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import {
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useUploadProductImageMutation,
    useUpdateProductMutation
} from "../../redux/api/productApiSlice"
import { useFetchCateQuery } from "../../redux/api/categoryApiSlice"
import { toast } from "react-toastify"



const ProductUpdate = () => {
    const params = useParams()

    const { data: productData } = useGetProductByIdQuery(params._id)

    const [image, setImage] = useState(productData?.image || '')
    const [name, setName] = useState(productData?.name || '')
    const [description, setDescription] = useState(productData?.description || '')
    const [price, setPrice] = useState(productData?.price || '')
    const [category, setCategory] = useState(productData?.category || '')
    const [brand, setBrand] = useState(productData?.brand || '')
    const [quantity, setQuantity] = useState(productData?.quantity || '')
    const [stock, setStock] = useState(productData?.countInstock)

    const navigate = useNavigate()

    const { data: categories = [] } = useFetchCateQuery()
    const [uploadProductImage] = useUploadProductImageMutation()
    const  [updateProduct] = useUpdateProductMutation()
    const [deleteProduct] = useDeleteCateMutation()

    useEffect(() => {
        if (productData && productData._id) {
            setName(productData.name)
            setDescription(productData.description)
            setPrice(productData.price)
            setCategory(productData.category)
            setBrand(productData.brand)
            setQuantity(productData.quantity)
            setStock(productData.countInstock)
        }
    }, [productData]
)
    return (
        <div>ProductUpdate</div>
    )
}

export default ProductUpdate