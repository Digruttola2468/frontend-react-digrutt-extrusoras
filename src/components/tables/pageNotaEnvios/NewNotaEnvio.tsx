import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/User.context";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import toast from "react-hot-toast";
import { useNotaEnvio } from "../../../context/NotaEnvios.context";

interface listSalida {
    id_inventario: number
    price: number
    stock_mts: number
    codigo: string
    descripcion: string
    rollos_x_bolsas: number
    metros_x_rollo: number
    hexacolor: string
    color: string
}

interface DataInventario {
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
    hexacolor: string
    tipo: string
}

interface cliente {
    id: number
    cliente: string
    correo_electronico: string
    domicilio: string
    telefono: string
    idCat_cliente: number
    idCity: number
    idViajante: number
    nombreViajante: string
    apellidoViajante: string
    telefonoViajante: string
    categoria: string
    city: string
}

const NewNotaEnvio = () => {
    const navegate = useNavigate();
    const { BASE_URL } = useAuth();
    const { getLastNotaEnvio } = useNotaEnvio();

    const [num_envio, setNumEnvio] = useState<string>("");
    const [fecha, setFecha] = useState("");
    const [idCliente, setIdCliente] = useState("");
    const [descuentos, setDescuento] = useState("");

    const [listSalida, setListSalida] = useState<listSalida[]>([]);

    const [apiCliente, setApiCliente] = useState<cliente[]>([]);

    const [apiInventario, setApiInventario] = useState<DataInventario[]>([]);
    const [auxApiInventario, setAuxApiInventario] = useState<DataInventario[]>([]);

    const [requesterror, setRequeterror] = useState<{campus: string, index?: number}[]>([]);

    useEffect(() => {
        setNumEnvio(`${getLastNotaEnvio()}`);
    }, [getLastNotaEnvio])

    const getListSalida = () => {
        let list = [];
        for (let i = 0; i < listSalida.length; i++) {
            const product = listSalida[i];

            let idProduct = product.id_inventario;

            let price = document.querySelector(`#input-price-newNotaEnvio-${idProduct}`).value;
            let paquetes = document.querySelector(`#input-stockmts-newNotaEnvio-${idProduct}`).value;

            let a = parseInt(paquetes) * product.rollos_x_bolsas
            let b = product?.metros_x_rollo ? product?.metros_x_rollo : 1
            let stock_mts = a * b;

            list.push({ id_inventario: parseInt(idProduct), price: parseFloat(price), stock_mts });
        }
        return list;
    }

    const handleNewNotaEnvio = () => {
        const modifiedDate = moment(fecha, "YYYY-MM-DD").format("YYYY/MM/DD");

        axios.defaults.withCredentials = true;

        toast.promise(axios.post(`${BASE_URL}/api/notaEnvio`, { notaEnvios: { num_envio: parseInt(num_envio), fecha: modifiedDate, idCliente: parseInt(idCliente), descuento_porcentaje: parseFloat(descuentos) }, listSalida: getListSalida() }), {
            loading: "Creando Nueva Nota Envio",
            success: () => {
                navegate("/notaEnvios")
                return "Se creo correctamente"
            },
            error: (e) => {
                if (e.response.data.errors != null)
                    setRequeterror(e.response.data.errors)
                return "No se Creo"
            }
        })
    }

    // --------------- AUTO COMPLETE ---------------
    // SEARCH PRODUCTS
    const [filterOptions, setFilterOptions] = useState<DataInventario[]>([]);
    const [inputAutoComplete, setInputAutoComplete] = useState<string>("");

    // AL ESCRIBIR
    const handleInputChange = (evt) => {
        const value = evt.target.value;
        setInputAutoComplete(value);
        setFilterOptions(auxApiInventario.filter(option =>
            option.descripcion.toLowerCase().includes(value.toLowerCase())
        ));
    };

    // AL SELECCIONAR UNO
    const handleOptionClick = (option: DataInventario) => {
        
        setListSalida([...listSalida, {
            id_inventario: option.id,
            price: option.price,
            stock_mts: 0,
            hexacolor: option.hexacolor,
            codigo: option.codigo,
            descripcion: option.descripcion,
            metros_x_rollo: option.metros_x_rollo,
            rollos_x_bolsas: option.rollos_x_bolsas,
            color: option.color
        }])

        setAuxApiInventario(auxApiInventario.filter(e => e.id != option.id))
        setInputAutoComplete("");
        setFilterOptions([]);
    };
    const handleOptionDelete = (index: number) => {
        setListSalida(listSalida.filter(e => e.id_inventario !== index))
        const find = apiInventario.find(e => e.id == index);
        setAuxApiInventario([...auxApiInventario, find])
    }

    // SEARCH CLIENTE
    const [filterOptionsCliente, setFilterOptionsCliente] = useState<cliente[]>([]);
    const [inputAutoCompleteCliente, setInputAutoCompleteCliente] = useState<string>("");

    const handleInputChangeCliente = (evt) => {
        
        const value = evt.target.value;
        if (value == "") setIdCliente("")
        
        setInputAutoCompleteCliente(value);
        setFilterOptionsCliente(apiCliente.filter(option =>
            option.cliente.toLowerCase().includes(value.toLowerCase())
        ));
    };

    // AL SELECCIONAR UNO
    const handleOptionClickCliente = (option: cliente) => {
        setRequeterror(requesterror.filter(e => e.campus != "idCliente"))
        setIdCliente(option.id)
        setInputAutoCompleteCliente(`${option.categoria} ${option.cliente}`);
        setFilterOptionsCliente([]);
    };
    // --------------------------------------------------

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setFecha(formattedDate);

        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/clientes`).then(result => {
            setApiCliente(result.data.payload)
        }).catch(e => { });
        axios.get(`${BASE_URL}/api/inventario`).then(result => {
            setApiInventario(result.data.payload)
            setAuxApiInventario(result.data.payload)
        }).catch(e => { })
    }, [])

    useEffect(() => {
        if (inputAutoComplete == "")
            setFilterOptions([])
        if (inputAutoCompleteCliente == "")
            setFilterOptionsCliente([]);
    }, [inputAutoComplete, inputAutoCompleteCliente])

    return <div className="flex flex-col justify-around items-center gap-2 m-2">
        <div className="text-center flex flex-col">
            <label className="block mb-2">
                <span className="text-gray-700">Numero Envio</span>
                <input
                    type="number"
                    value={num_envio}
                    onChange={(e) => {
                        setRequeterror(requesterror.filter(e => e.campus != "num_envio"))
                        setNumEnvio(e.target.value)}}
                    className={`${requesterror.find(e => e.campus == "num_envio") ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />

            </label>
            <label className="block mb-2">
                <span className="text-gray-700">Fecha</span>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => {
                        setRequeterror(requesterror.filter(e => e.campus != "fecha"))
                        setFecha(e.target.value)}}
                    className={`${requesterror.find(e => e.campus == "fecha") ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
            </label>
            <label className="block mb-2 relative">
                <span className="text-gray-700">Descuento</span>
                <input
                    type="number"
                    value={descuentos}
                    placeholder="Descuento"
                    onChange={(e) => setDescuento(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-xs p-0 m-0 text-gray-400 absolute bottom-[-15px] left-0">Opcional</span>
            </label>
            <label className="my-4 w-full ">
                <input
                    type="text"
                    value={inputAutoCompleteCliente}
                    onChange={handleInputChangeCliente}
                    className={`${requesterror.find(e => e.campus == "idCliente") ? "border-red-400" : ""} w-full p-2 border border-gray-300 rounded `}
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
                    onClick={() => { navegate("/notaEnvios") }}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={handleNewNotaEnvio}
                    className="px-4 py-2 bg-indigo-500 text-white rounded active:scale-[.98] active:duration-75 transition-all hover:scale-[1.04] hover:bg-indigo-700 ease-in-out text-lg "
                >
                    Crear
                </button>
            </div>
        </div>
        <label className="my-2 flex flex-col relative">
            <input
                type="text"
                value={inputAutoComplete}
                onChange={handleInputChange}
                className=" p-2 border border-gray-300 rounded "
                placeholder="Agregar producto"
            />
            <span className="text-xs p-0 m-0 text-gray-400 absolute bottom-[-15px]">Opcional</span>
        </label>
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(0px,300px))] gap-2 place-content-center">
            {filterOptions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg ">
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
            {
                listSalida.map((e, i) => {
                    const campo = requesterror.find(e => e?.index == i )

                    return <div key={i} className="border p-2 m-1 rounded-md w-full">
                        <p className="flex flex-row justify-between items-center gap-3">
                            <span className="font-semibold">{e.descripcion} {e.color} </span>
                            <span className={`w-4 h-4 border bg-[${e.hexacolor.replace(/["']/g, '')}]`}></span>
                            <span className="text-red-300 hover:text-red-500 text-lg cursor-pointer" onClick={() => { handleOptionDelete(e.id_inventario) }}> <MdDelete />  </span>
                        </p>
                        <div className="flex flex-row gap-2">
                            <label className="block mb-2">
                                <span className="text-gray-700">Price</span>
                                <input
                                    type="number"
                                    id={`input-price-newNotaEnvio-${e.id_inventario}`}
                                    className={`${campo != null && campo.campus == "price" ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                <span className="text-xs text-gray-400 absolute">${e.price} x mt</span>
                            </label>
                            <label className="block mb-2">
                                <span className="text-gray-700">Paquetes</span>
                                <input
                                    type="number"
                                    id={`input-stockmts-newNotaEnvio-${e.id_inventario}`}
                                    className={`${campo != null && campo.campus == "stock_mts" ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                />
                                <span className="text-xs text-gray-400 absolute">{e.rollos_x_bolsas} caños/rollos x paq</span>
                            </label>
                        </div>
                    </div>
                })
            }
        </div>
    </div>
}

export default NewNotaEnvio;