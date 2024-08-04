import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/User.context";
import axios from "axios";
import { SalidaData } from "../pageNotaEnvios/DetailListSalida";

export interface DataInventario {
    id: number
    codigo: string
    stock_mts: number
    descripcion: string
    price: number
    idColor: number
    idTipoProducto: number
    rollos_x_bolsas: number
    metros_x_rollo: number
    color: string
    tipo: string
}

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedData: any) => void;
    initialData: SalidaData
}

const DialogUpdateSalida: React.FC<UpdateDialogProps> = ({ initialData, isOpen, onClose, onUpdate }) => {
    if (initialData == null) return <></>

    const { BASE_URL } = useAuth();

    const [idInventario, setIdInventario] = useState("");
    const [price, setPrice] = useState("");
    const [stock_mts, setStock_mts] = useState("");

    const [apiInventario, setApiInventario] = useState<DataInventario[]>([]);

    // --------------- AUTO COMPLETE ---------------
    const [filterOptions, setFilterOptions] = useState<DataInventario[]>([]);
    const [inputAutoComplete, setInputAutoComplete] = useState<string>("");
    const [selectedAutoComplete, setSelectedAutoComplete] = useState<DataInventario>();

    // AL ESCRIBIR
    const handleInputChange = (evt) => {
        const value = evt.target.value;
        setInputAutoComplete(value);
        setFilterOptions(apiInventario.filter(option =>
            option.descripcion.toLowerCase().includes(value.toLowerCase())
        ));
    };

    // AL SELECCIONAR UNO
    const handleOptionClick = (option: DataInventario) => {
        setIdInventario(option.id)
        setSelectedAutoComplete(option);
        setInputAutoComplete(option.descripcion);
        setFilterOptions([]);
    };
    // --------------------------------------------------

    useEffect(() => {
        const find = apiInventario.find(e => e.id == initialData.id_inventario)

        setIdInventario(initialData.id_inventario)
        setSelectedAutoComplete(find)
        setInputAutoComplete(find?.descripcion || "");
        setFilterOptions([]);

        setPrice(initialData.price);
        setStock_mts(initialData.stock_mts);
    }, [initialData])

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/inventario`).then(result => {
            console.log(result);
            setApiInventario(result.data.payload)
        }).catch(e => { })
    }, [])

    const handleUpdate = () => {
        onUpdate(initialData.id,{ idInventario: parseInt(idInventario), price: parseFloat(price), stock_mts: parseInt(stock_mts) });
        onClose();
    };

    if (!isOpen) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <h2 className="text-xl font-bold mb-4">Actualizar Salida </h2>
            <div className="relative w-full max-w-md">
                <label className="block mb-4">
                    <span className="text-gray-700 font-semibold">Producto</span>
                    <input
                        type="text"
                        value={inputAutoComplete}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Search Inventario"
                    />
                </label>

                {filterOptions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                        {filterOptions.map(option => (
                            <li
                                key={option.id}
                                onClick={() => handleOptionClick(option)}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                            >
                                <div className="font-bold">{option.codigo}</div>
                                <div className="text-sm text-gray-500">{option.descripcion}</div>
                            </li>
                        ))}
                    </ul>
                )}
                {selectedAutoComplete && (
                    <div className="mt-2 p-2 border border-gray-300 rounded">
                        <div className="font-semibold">{selectedAutoComplete.codigo}</div>
                        <div className="text-sm text-gray-500">{selectedAutoComplete.descripcion}</div>
                        <div className="text-sm text-gray-500">{selectedAutoComplete.metros_x_rollo}mts x caño</div>
                    </div>
                )}
            </div>
            <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Precio</span>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700 font-semibold">Stock Mts Salida</span>
                <input
                    type="number"
                    value={stock_mts}
                    onChange={(e) => setStock_mts(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>

            <div className="flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-indigo-500 text-white rounded active:scale-[.98] active:duration-75 transition-all hover:scale-[1.04] hover:bg-indigo-700 ease-in-out text-lg "
                >
                    Update
                </button>
            </div>
        </div>

    </div>
}

export default DialogUpdateSalida