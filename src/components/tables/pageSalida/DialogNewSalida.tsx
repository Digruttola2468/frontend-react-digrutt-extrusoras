import { useEffect, useState } from "react";
import { useAuth } from "../../../context/User.context";
import { DataInventario } from "./DialogUpdateSalida";
import axios from "axios";

interface NewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (updatedData: any) => void;
}

const DialogNewSalida: React.FC<NewDialogProps> = ({isOpen, onClose, onCreate}) => {
    const { BASE_URL } = useAuth();

    const [idInventario, setIdInventario] = useState("");
    const [price, setPrice] = useState("");
    const [paquetes, setPaquetes] = useState("");

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
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/inventario`).then(result => {
            console.log(result);
            setApiInventario(result.data.payload)
        }).catch(e => { })
    }, [])

    useEffect(() => {
        if (inputAutoComplete == "") {
            setFilterOptions([])
            setSelectedAutoComplete(null);
        }
    }, [inputAutoComplete])


    const handleNewSalida = () => {
        let salida = parseInt(paquetes) * selectedAutoComplete?.rollos_x_bolsas * selectedAutoComplete?.metros_x_rollo;
        onCreate({ id_inventario: idInventario, price: parseFloat(price), stock_mts: salida });
        onClose();
    };

    if (!isOpen) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <h2 className="text-xl font-bold mb-4">Nueva Salida </h2>
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
                                <div className="text-sm text-gray-500">{option.descripcion} {option.color}</div>
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
                <span className="text-gray-700 font-semibold">Paquetes</span>
                <input
                    type="number"
                    value={paquetes}
                    onChange={(e) => setPaquetes(e.target.value)}
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
                    onClick={handleNewSalida}
                    className="px-4 py-2 bg-green-200 text-white rounded active:scale-[.98] active:duration-75 transition-all hover:scale-[1.04] hover:bg-green-400 ease-in-out text-lg "
                >
                    Create
                </button>
            </div>
        </div>

    </div>
}

export default DialogNewSalida;