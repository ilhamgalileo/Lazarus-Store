const CategoryForm = ({
    value,
    setvalue,
    handleSubmit,
    buttonText = "Submit",
    handleDelete,
}) => {
    return <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-3">
            <input
                type="text"
                className="py-3 px-4 border rounded-lg w-full"
                placeholder="Write category name"
                value={value}
                onChange={(e) => setvalue(e.target.value)} 
            />

            <div className="flex justify-between">
                <button 
                    type="submit"
                    className="bg-orange-500 text-white py-2 px-4 rounded-lg 
                    hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500
                    focus:ring-opacity-50"
                >
                    {buttonText}
                </button>

                {handleDelete && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg
                        hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500
                        focus:ring-opacity-50"
                    > 
                        Delete 
                    </button>
                )}
            </div>
        </form>
    </div>
}

export default CategoryForm