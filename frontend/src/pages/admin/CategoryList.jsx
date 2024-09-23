import { useState } from "react"
import { toast } from "react-toastify"
import {
    useCreateCateMutation,
    useUpdateCateMutation,
    useDeleteCateMutation,
    useFetchCateQuery
} from "../../redux/api/categoryApiSlice"
import CategoryForm from "../../components/CategoryForm"

const CategoryList = () => {
    const { data: categories } = useFetchCateQuery()
    const [name, setName] = useState('')
    const [selectedCate, useSelectedCate] = useState(null)
    const [updateName, useUpdateName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const [createCate] = useCreateCateMutation()
    const [updateCate] = useUpdateCateMutation()
    const [deleteCate] = useDeleteCateMutation()

    const handleCreateCate = async (e) => {
        e.preventDefault()

        if (!name) {
            toast.error('Category is required')
            return
        }

        try {
            const result = await createCate({name}).unwrap()
            console.log(result)
            if (result.error) {
                toast.error(result.error)
            } else {
                setName("")
                toast.success(`${result.category.name} is created.`)
            }
        } catch (error) {
            console.log(error)
            toast.error('Creating category failed, try again')
        }
    }

    return (    
        <div className="ml-[10rem] flex-col md:flex-row">
            <div className="md:w-3/4 py-3">
                <div className="h-12">Manage Categories</div>
                <CategoryForm value={name} setvalue={setName} handleSubmit={handleCreateCate} />
                <br />
                <hr />

                <div className="flex flex-wrap">
                    {categories?.map((category) => (
                        <div key={category._id}>
                            <button 
                        className="bg-black border border-orange-500 text-white py-2 px-4 rounded-lg m-3
                    hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-500
                    focus:ring-opacity-50" onClick={() => {
                                    {
                                        setModalVisible(true)   
                                        setSelectedCategory(category)
                                        setUpdateName(category.name)
                                    }
                                }}>{category.name}


                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default CategoryList