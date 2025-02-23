const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-[fadeIn_0.3s_ease-in-out]"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 sm:mx-0 p-6 transform transition-all animate-[scaleIn_0.3s_ease-in-out]">
                <button
                    className="absolute top-1 right-1 p-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full transition"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="mt-2">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
