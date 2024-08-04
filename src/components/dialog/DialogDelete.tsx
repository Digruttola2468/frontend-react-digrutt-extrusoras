import React from "react";

interface DialogDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
    title: string
    detail?: string
}

const DialogDelete: React.FC<DialogDeleteProps> = ({ isOpen, onClose, onDelete, title, detail = "Estas seguro en eliminar?" }) => {
    const handleDelete = () => {
        onDelete();
        onClose();
    };

    if (!isOpen) return null;

    return <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <label className="block mb-2">
                <span className="text-gray-700">{detail}</span>
            </label>
            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out text-white text-lg font-bold bg-red-400 hover:bg-red-600 rounded"
                >
                    Delete
                </button>
            </div>
        </div>

    </div>
}

export default DialogDelete