import { useState } from "react";
import { toast } from "react-toastify";
import {
    useCreateCateMutation,
    useUpdateCateMutation,
    useDeleteCateMutation,
    useFetchCateQuery
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/loader";

const CategoryList = () => {
    const { data: categories, isLoading, isError, refetch } = useFetchCateQuery();
    const [name, setName] = useState('');
    const [selectedCate, setSelectedCate] = useState(null);
    const [updatingName, setUpdatingName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const [createCate] = useCreateCateMutation();
    const [updateCate] = useUpdateCateMutation();
    const [deleteCate] = useDeleteCateMutation();

    const handleCreateCate = async (e) => {
        e.preventDefault();

        if (!name) {
            toast.error('Category name is required');
            return;
        }

        try {
            const result = await createCate({ name }).unwrap();
            if (result.error) {
                toast.error(result.error);
            } else {
                setName("");
                toast.success(`${result.category.name} created successfully.`);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            toast.error('Creating category failed, try again');
        }
    };

    const handleUpdateCate = async (e) => {
        e.preventDefault();

        if (!updatingName) {
            toast.error('Category name is required');
            return;
        }

        try {
            const result = await updateCate({
                categoryId: selectedCate._id,
                updatedCate: { name: updatingName }
            }).unwrap();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(`${result.name} updated successfully`)
                setSelectedCate(null);
                setUpdatingName("");
                setModalVisible(false);
                refetch();
            }
        } catch (error) {
            toast.error('Failed to update category. Please try again.');
        }
    };

    const handleDeleteCate = async () => {
        try {
            const result = await deleteCate(selectedCate._id).unwrap();
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Category deleted successfully');
                setSelectedCate(null);
                setModalVisible(false);
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Category deletion error:', error);
            toast.error('Category deletion failed. Try again.');
        }
    };

    if (isLoading) return <Loader />;
    if (isError) return <div>Error fetching categories</div>;

    return (
        <div className="ml-[10rem] flex flex-col md:flex-row">
            <AdminMenu />
            <div className="md:w-3/4 p-5">
                <h2 className="text-2xl font-semibold text-orange-500 mb-5 text-center">Manage Categories</h2>

                <CategoryForm
                    value={name}
                    setValue={setName}
                    handleSubmit={handleCreateCate}
                    buttonText="Create Category"
                />
                <hr className="border-orange-500 my-6" />

                <div className="flex flex-wrap gap-3">
                    {categories?.map((category) => (
                        <div key={category._id}>
                            <button
                                className="bg-white border border-orange-500 text-orange-500 py-2 px-4 rounded-lg 
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
                        setValue={setUpdatingName}
                        handleSubmit={handleUpdateCate}
                        buttonText="Update Category"
                        handleDelete={handleDeleteCate}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default CategoryList;