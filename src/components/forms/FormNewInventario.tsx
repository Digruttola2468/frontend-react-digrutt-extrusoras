import { useEffect, useState } from "react"
import { useAuth } from "../../context/User.context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useInventario } from "../../context/Inventario.context";

const FormNewInventario = () => {
    const navegate = useNavigate();
    const { BASE_URL, apiColores } = useAuth();
    const { newDataTable } = useInventario();

    const [codigo, setCodigo] = useState("");
    const [stock_mts, setStockMts] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [price, setPrice] = useState("");
    const [idColor, setColor] = useState("");
    const [idTipoProducto, setIdTipoProducto] = useState("");
    const [rollos_x_bolsas, setRolloxBolsa] = useState("");
    const [metros_x_rollo, setMetrosxRollo] = useState("");

    const [apiTipoProducto, setApiTipoProducto] = useState<{ id: number, tipo: string }[]>([]);

    const [requesterror, setRequeterror] = useState<string[]>([]);

    const handleNewCliente = () => {
        axios.defaults.withCredentials = true;

        toast.promise(axios.post(`${BASE_URL}/api/inventario`, { codigo, stock_mts: parseInt(stock_mts), descripcion, price: parseFloat(price), idColor: parseInt(idColor), idTipoProducto: parseInt(idTipoProducto), rollos_x_bolsas: parseInt(rollos_x_bolsas), id: 1, metros_x_rollo: parseInt(metros_x_rollo) }), {
            loading: "Creando Nuevo Producto...",
            success: (result) => {
                newDataTable(result.data.payload);
                emptyCampus();
                return "Producto Creado"
            },
            error: (e) => {
                if (e.response.data.errors != null)
                    setRequeterror(e.response.data.errors)
                return e.response.data.message
            }
        })
    }

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/tipoProducto`).then(result => {
            setApiTipoProducto(result.data.payload)
        }).catch(e => { });
    }, [])

    const emptyCampus = () => {
        setCodigo("");
        setStockMts("");
        setDescripcion("");
        setPrice("");
        setColor("");
        setIdTipoProducto("");
        setRolloxBolsa("");
        setMetrosxRollo("");
    }

    return <div >
        <h1 className="uppercase text-center mt-3 text-2xl font-sans">AGREGAR NUEVO PRODUCTO</h1>
        <div >
            <form className="grid gap-3 place-content-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,300px))] ">
                <label className="block mb-2">
                    <span className="text-gray-700">Codigo</span>
                    <input
                        type="text"
                        value={codigo}
                        onChange={(e) => {
                            setRequeterror(requesterror.filter(e => e != "codigo"))
                            setCodigo(e.target.value)
                        }}
                        className={`${requesterror.includes("codigo") ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
                </label>
                <label className="block mb-4">
                    <span className="text-gray-700">Descripcion</span>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => {
                            setRequeterror(requesterror.filter(e => e != "descripcion"))
                            setDescripcion(e.target.value)
                        }}
                        className={`${requesterror.includes("descripcion") ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
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
                    <label className="block mb-2 w-full">
                        <span className="text-gray-700">Tipo de Producto</span>
                        <select
                            value={idTipoProducto}
                            onChange={(evt) => setIdTipoProducto(evt.target.value)}
                            className="w-full border-2 mt-1  block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value={null}>
                                selecciona tipo de producto
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
                    <label className="block mb-2 w-full">
                        <span className="text-gray-700">Color</span>
                        <select
                            value={idColor}
                            onChange={(evt) => setColor(evt.target.value)}
                            className="w-full border-2 mt-1  block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value={null}>
                                selecciona color
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
            </form>
            <div className="flex flex-row justify-center">
                <button
                    onClick={() => { navegate("/inventario") }}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    className="px-6  active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] hover:bg-green-500 ease-in-out py-3 rounded bg-green-300 text-white"
                    onClick={handleNewCliente}>
                    Nuevo Producto
                </button>
            </div>
        </div>

    </div>
}

export default FormNewInventario