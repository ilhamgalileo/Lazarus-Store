import { useState } from "react"
import { toast } from "react-toastify"
import {
    useCreateCateMutation,
    useUpdateCateMutation,
    useDeleteCateMutation,
    useFetchCateQuery
} from "../../redux/api/categoryApiSlice"
import CategoryForm from "../../components/CategoryForm"
import Modal from "../../components/Modal"
import AdminMenu from "./AdminMenu"

const CategoryList = () => {
    const { data: categories } = useFetchCateQuery()
    const [name, setName] = useState('')
    const [selectedCate, setSelectedCate] = useState(null)
    const [updatingName, setUpdatingName] = useState('')
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
            const result = await createCate({ name }).unwrap()
            console.log(result)
            if (result.error) {
                toast.error(result.error)
            } else {
                setName("")
                toast.success(`${result.category.name} is created.`)
                setTimeout(() => {
                    window.location.reload()
                }, 5500)
            }
        } catch (error) {
            console.log(error)
            toast.error('Creating category failed, try again')
        }
    }

    const handleUpdateCate = async (e) => {
        e.preventDefault()

        if (!updatingName) {
            toast.error('Category name is required')
            return
        }

        try {
            const result = await updateCate({
                categoryId: selectedCate._id,
                updatedCate: {
                    name: updatingName
                }
            }).unwrap()

            if (result.error) {
                toast.error(result.error)
            } else if (result.category && result.category.name) {
                toast.success(`${result.category.name} is updated`)
                setSelectedCate(null)
                setUpdatingName("")
                setModalVisible(false)
            } else {
                toast.success("Category updated successfully")
                setTimeout(() => {
                    window.location.reload()
                }, 5500)
            }
        } catch (error) {
            console.error('Update category error:', error)
            toast.error('Failed to update category. Please try again.')
        }
    }

    const handleDeleteCate = async () => {
        try {
            const result = await deleteCate(selectedCate._id).unwrap()
            console.log('Delete result:', result)

            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Category deleted successfully')
                setTimeout(() => {
                    window.location.reload()
                }, 5000)
            }

            setSelectedCate(null)
            setModalVisible(false)

        } catch (error) {
            console.error('Category deletion error:', error)
            toast.error('Category deletion failed. Try again.')
        }
    }

    return (
        <div className="ml-[10rem] flex flex-col md:flex-row">
            <AdminMenu />
            <div className="md:w-3/4 py-5">
                <h2 className="text-2xl font-semibold text-orange-500 mb-5 text-center">Manage Categories</h2>
    
                <CategoryForm 
                    value={name} 
                    setvalue={setName} 
                    handleSubmit={handleCreateCate} 
                />
                <br />
                <hr className="border-orange-500 my-4" />
    
                <div className="flex flex-wrap gap-3">
                    {categories?.map((category) => (
                        <div key={category._id}>
                            <button
                                className="bg-black border border-orange-500 text-orange-500 py-2 px-4 rounded-lg 
                                hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 
                                focus:ring-orange-500 focus:ring-opacity-50 transition duration-300"
                                onClick={() => {
                                    setModalVisible(true);
                                    setSelectedCate(category);
                                    setUpdatingName(category.name);
                                }}
                            >
                                {category.name}
                            </button>
                        </div>
                    ))}
                </div>
    
                <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                    <CategoryForm
                        value={updatingName}
                        setvalue={(value) => setUpdatingName(value)}
                        handleSubmit={handleUpdateCate}
                        buttonText="Update"
                        handleDelete={handleDeleteCate}
                    />
                </Modal>
            </div>
        </div>
    )
}

export default CategoryList