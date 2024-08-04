import React, { useEffect, useState } from "react";
import { clienteData } from "./SiderBarClientes";
import { useAuth } from "../../../context/User.context";
import axios from "axios";

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedData: clienteData) => void;
    initialData: clienteData
}

const DialogUpdateCliente: React.FC<UpdateDialogProps> = ({ isOpen, initialData, onClose, onUpdate }) => {
    const { BASE_URL, apiCiudad, apiViajantes } = useAuth();

    const [cliente, setCliente] = useState<string>("");
    const [domicilio, setDomicilio] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [catCliente, setCatCliente] = useState<number>();
    const [idCity, setIdCity] = useState<number>();
    const [idViajante, setIdViajante] = useState<number>();

    
    const [apiCatCliente, setApiCatCliente] = useState<{ id: number, categoria: string }[]>([]);
    //const [apiCiudad, setApiCiudad] = useState<{ id: number, city: string }[]>(ciudad);
    //const [apiViajantes, setApiViajante] = useState<{id: number, nombre: string, apellido: string}[]>(viajantes);

    useEffect(() => {
        setCliente(initialData.cliente);
        setDomicilio(initialData.domicilio);
        setTelefono(initialData.telefono || "");
        setCatCliente(initialData.idCat_cliente);
        setIdCity(initialData.idCity);
        setIdViajante(initialData.idViajante);
    }, [initialData]);

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/categorias_clientes`).then(result => {
            //console.log(result);
            setApiCatCliente(result.data.payload)
        }).catch(e => { });
    }, [])

    const handleUpdate = () => {
        onUpdate({ cliente, domicilio, telefono, correo, idCat_cliente: catCliente, idCity: idCity, idViajante: idViajante, id:1 });
        onClose();
    };

    const handleChangeComboBox = (evt) => {
        setCatCliente(evt.target.value)
    };

    const handleChangeComboBoxCity = (evt) => {
        setIdCity(evt.target.value)
    };

    const handleChangeComboBoxViajantes = (evt) => {
        setIdViajante(evt.target.value)
    };

    if (!isOpen) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Actualizar Cliente</h2>
            <label className="block mb-2">
                <span className="text-gray-700">Cliente</span>
                <input
                    type="text"
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Domicilio</span>
                <input
                    type="text"
                    value={domicilio}
                    onChange={(e) => setDomicilio(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Telefono</span>
                <input
                    type="number"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <label className="block mb-4">
                <span className="text-gray-700">Correo Electronico</span>
                <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
            </label>
            <div className="w-full flex flex-row items-center gap-2 my-2">
                <label className="block mb-2">
                    <span className="text-gray-700">Categoria Cliente</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={catCliente}
                        onChange={handleChangeComboBox}
                        className="w-full border-2 mt-1  block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {apiCatCliente.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.categoria}
                            </option>
                        ))}
                    </select>
                </label>

            </div>
            <div className="w-full flex flex-row items-center gap-1">
                <label className="block mb-2">
                    <span className="text-gray-700">Ciudad</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idCity}
                        onChange={handleChangeComboBoxCity}
                        className="border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {apiCiudad.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.city}
                            </option>
                        ))}
                    </select>
                </label>

            </div>
            <div className="w-full flex flex-row items-center gap-1">
                <label className="block mb-2">
                    <span className="text-gray-700">Viajante</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idViajante}
                        onChange={handleChangeComboBoxViajantes}
                        className="border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {apiViajantes.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.apellido} {" "} {option.nombre}
                            </option>
                        ))}
                    </select>
                </label>

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

export default DialogUpdateCliente