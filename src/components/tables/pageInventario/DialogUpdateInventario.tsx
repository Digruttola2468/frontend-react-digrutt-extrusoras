import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/User.context";
import axios from "axios";
import { inventarioData } from "./SiderBarInventario";

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedData: inventarioData) => void;
    initialData: inventarioData
}

const DialogUpdateInventario: React.FC<UpdateDialogProps> = ({ isOpen, initialData, onClose, onUpdate }) => {
    const { BASE_URL, apiColores } = useAuth();

    const [codigo, setCodigo] = useState("");
    const [stock_mts, setStockMts] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [price, setPrice] = useState("");
    const [idColor, setColor] = useState("");
    const [idTipoProducto, setIdTipoProducto] = useState("");
    const [rollos_x_bolsas, setRolloxBolsa] = useState("");
    const [metros_x_rollo, setMetrosxRollo] = useState("");

    const [apiTipoProducto, setApiTipoProducto] = useState<{ id: number, tipo: string }[]>([]);

    useEffect(() => {
        setCodigo(initialData.codigo);
        setStockMts(initialData.stock_mts);
        setDescripcion(initialData.descripcion || "");
        setPrice(initialData.price);
        setColor(initialData.color);
        setIdTipoProducto(initialData.idTipoProducto);
        setRolloxBolsa(initialData.rollos_x_bolsas);
        setMetrosxRollo(initialData.metros_x_rollo);
    }, [initialData]);

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/tipoProducto`).then(result => {
            setApiTipoProducto(result.data.payload)
        }).catch(e => { });
    }, [])

    const handleUpdate = () => {
        onUpdate({ codigo, stock_mts: parseInt(stock_mts), descripcion, price: parseFloat(price), idColor: parseInt(idColor), idTipoProducto: parseInt(idTipoProducto), rollos_x_bolsas: parseInt(rollos_x_bolsas), id:1, metros_x_rollo: parseInt(metros_x_rollo) });
        onClose();
    };

    if (!isOpen) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Actualizar Producto</h2>
            <label className="block mb-2">
                <span className="text-gray-700">Codigo</span>
                <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Descripcion</span>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Stock mts</span>
                <input
                    type="number"
                    value={stock_mts}
                    onChange={(e) => setStockMts(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Price</span>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <div className="w-full flex flex-row items-center gap-2 my-2">
                <label className="block mb-2">
                    <span className="text-gray-700">Tipo de Producto</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idTipoProducto}
                        onChange={(evt) => setIdTipoProducto(evt.target.value)}
                        className="w-full border-2 mt-1  block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value={""}>
                            Selecciona Tipo Del Producto
                        </option>
                        {apiTipoProducto.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.tipo}
                            </option>
                        ))}
                    </select>
                </label>

            </div>
            <div className="w-full flex flex-row items-center gap-2 my-2">
                <label className="block mb-2">
                    <span className="text-gray-700">Color</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idColor}
                        onChange={(evt) => setColor(evt.target.value)}
                        className="w-full border-2 mt-1  block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value={""}>
                            Selecciona Color
                        </option>
                        {apiColores.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.color}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <label className="block mb-4">
                <span className="text-gray-700">Caño x Bolsa</span>
                <input
                    type="number"
                    value={rollos_x_bolsas}
                    onChange={(e) => setRolloxBolsa(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Caño x Mts</span>
                <input
                    type="number"
                    value={metros_x_rollo}
                    onChange={(e) => setMetrosxRollo(e.target.value)}
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

export default DialogUpdateInventario