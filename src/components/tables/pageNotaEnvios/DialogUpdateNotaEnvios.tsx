import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/User.context";
import axios from "axios";
import { NotaEnvioData } from "./DetailNotaEnvio";
import moment from "moment";

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedData: NotaEnvioData) => void;
    initialData: NotaEnvioData
}

const DialogUpdateNotaEnvio: React.FC<UpdateDialogProps> = ({ initialData, isOpen, onClose, onUpdate }) => {

    const { apiViajantes, BASE_URL } = useAuth();

    const [num_envio, setNumEnvio] = useState<number>();
    const [fecha, setFecha] = useState<string>();
    const [idCliente, setIdCliente] = useState<number>();
    const [pagado, setPagado] = useState<number>(1);

    const [apiCliente, setApiCliente] = useState<{ id: number; cliente: string, categoria: string }[]>([]);

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/clientes`).then(result => {
            setApiCliente(result.data.payload)
        }).catch(e => { });
    }, [])

    useEffect(() => {
        setNumEnvio(initialData.num_envio);
        setFecha(moment(initialData.fecha).format("YYYY-MM-DD"));
        setIdCliente(initialData.idCliente);
        setPagado(initialData.pagado);
    }, [initialData])

    const handleUpdate = () => {
        onUpdate({ num_envio, fecha, idCliente, pagado });
        onClose();
    };

    // SEARCH CLIENTE
    const [filterOptionsCliente, setFilterOptionsCliente] = useState<{ id: number; cliente: string, categoria: string }[]>([]);
    const [inputAutoCompleteCliente, setInputAutoCompleteCliente] = useState<string>("");

    const handleInputChangeCliente = (evt) => {

        const value = evt.target.value;
        if (value == "") setIdCliente(undefined)

        setInputAutoCompleteCliente(value);
        setFilterOptionsCliente(apiCliente.filter(option =>
            option.cliente.toLowerCase().includes(value.toLowerCase())
        ));
    };

    // AL SELECCIONAR UNO
    const handleOptionClickCliente = (option: cliente) => {
        setIdCliente(option.id)
        setInputAutoCompleteCliente(`${option.categoria} ${option.cliente}`);
        setFilterOptionsCliente([]);
    };

    useEffect(() => {
        if (inputAutoCompleteCliente == "")
            setFilterOptionsCliente([]);
    }, [ inputAutoCompleteCliente])

    if (!isOpen) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Actualizar Nota Envio {initialData.num_envio}</h2>
            <label className="block mb-2">
                <span className="text-gray-700">Numero Envio</span>
                <input
                    type="number"
                    value={num_envio}
                    onChange={(e) => setNumEnvio(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Fecha</span>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Cliente</span>
                <input
                    type="text"
                    value={inputAutoCompleteCliente}
                    onChange={handleInputChangeCliente}
                    className={`w-full p-2 border border-gray-300 rounded `}
                    placeholder="Buscar Cliente"
                />
            </label>
            <div className="relative">
                {filterOptionsCliente.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg ">
                        {filterOptionsCliente.map(option => (
                            <li
                                key={option.id}
                                onClick={() => handleOptionClickCliente(option)}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                            >
                                <div className="font-bold">{option.categoria} {" "} {option.cliente}</div>
                                <div className="text-sm text-gray-500">{option.domicilio}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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

export default DialogUpdateNotaEnvio;