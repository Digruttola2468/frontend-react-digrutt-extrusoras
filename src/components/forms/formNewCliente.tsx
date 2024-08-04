import { useEffect, useState } from "react"
import { useAuth } from "../../context/User.context";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useClient } from "../../context/Clientes.context";

const FormNewCliente = () => {
    const navegate = useNavigate();
    const { BASE_URL, apiCiudad, apiViajantes } = useAuth();
    const { newDataTable } = useClient();

    const [nombre, setNombre] = useState<string>("");
    const [cuil, setCuil] = useState<string>("");
    const [correo, setCorreo] = useState<string>("");
    const [domicilio, setDomicilio] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [idCatCliente, setIdCatCliente] = useState<string>("");
    const [idCity, setIdCity] = useState<string>("");
    const [idViajante, setIdViajante] = useState<string>("");

    const [requesterror, setRequeterror] = useState<string[]>([]);

    //const [apiCiudad, setApiCiudad] = useState<{ id: number, city: string }[]>(ciudad);
    //const [apiViajantes, setApiViajante] = useState<{id: number, nombre: string, apellido: string}[]>(viajantes);
    const [apiCatCliente, setApiCatCliente] = useState<{ id: number, categoria: string }[]>([]);

    const handleNewCliente = () => {

        axios.defaults.withCredentials = true;

        toast.promise(axios.post(`${BASE_URL}/api/clientes`, { nombre, cuil, correo, domicilio, telefono, idCatCliente, idCity, idViajante }).then(result => {
            newDataTable(result.data.payload);
            emptyCampus();
        }), {
            loading: "Enviando...",
            success: (result) => {
                return "Se creo Correctamente Nuevo Cliente"
            },
            error: (e) => {
                if (e.response.data.errors != null)
                    setRequeterror(e.response.data.errors)
                return "No se creo"
            }
        })
    }

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/categorias_clientes`).then(result => {
            //console.log(result);
            setApiCatCliente(result.data.payload)
        }).catch(e => { });
    }, [])

    const emptyCampus = () => {
        setRequeterror([])
        setNombre("");
        setCuil("");
        setCorreo("");
        setDomicilio("");
        setTelefono("");
        setIdCatCliente("");
        setIdCity("");
        setIdViajante("");
    }

    return <div >
        <h1 className="uppercase text-center mt-3 text-2xl font-sans">AGREGAR NUEVO CLIENTE</h1>
        <div >
            <form className="grid gap-3 place-content-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,300px))] ">
                <label className="block mb-2">
                    <span className="text-gray-700">Cliente</span>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                            setRequeterror(requesterror.filter(e => e != "nombre"))
                            setNombre(e.target.value)
                        }
                        }
                        className={`${requesterror.includes("nombre") ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Domicilio</span>
                    <input
                        type="text"
                        value={domicilio}
                        onChange={(e) => {
                            setRequeterror(requesterror.filter(e => e != "domicilio"))
                            setDomicilio(e.target.value)
                        }}
                        className={`${requesterror.includes("domicilio") ? "border-red-400" : ""} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">CUIL</span>
                    <input
                        type="number"
                        value={cuil}
                        onChange={(e) => setCuil(e.target.value)}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Telefono</span>
                    <input
                        type="text"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Correo Electronico</span>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                </label>

                <label className="block mb-2">
                    <span className="text-gray-700">Categoria Cliente</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idCatCliente}
                        onChange={(evt) => { 
                            setRequeterror(requesterror.filter(e => e != "idCatCliente"))
                            setIdCatCliente(parseInt(evt.target.value)) 
                        }}
                        className={`${requesterror.includes("idCatCliente") ? "border-red-400" : ""} w-full border-2 mt-1  block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                    >
                        <option value={null}>
                            Selecciona Tipo Cliente
                        </option>
                        {apiCatCliente.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.categoria}
                            </option>
                        ))}
                    </select>
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
                </label>

                <label className="block mb-2">
                    <span className="text-gray-700">Ciudad</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idCity}
                        onChange={(evt) => { 
                            setRequeterror(requesterror.filter(e => e != "idCity"))
                            setIdCity(parseInt(evt.target.value))
                         }}
                        className={`${requesterror.includes("idCity") ? "border-red-400" : ""} border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                    >
                        <option value={null}>
                            selecciona Ciudad
                        </option>
                        {apiCiudad.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.city}
                            </option>
                        ))}
                    </select>
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
                </label>

                <label className="block mb-2">
                    <span className="text-gray-700">Viajante</span>
                    <select
                        id="comboBox"
                        name="comboBox"
                        value={idViajante}
                        onChange={(evt) => { 
                            setRequeterror(requesterror.filter(e => e != "idViajante"))
                            setIdViajante(parseInt(evt.target.value)) 
                        }}
                        className={`${requesterror.includes("idViajante") ? "border-red-400" : ""} border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                    >
                        <option value={null}>
                            Selecciona Viajante
                        </option>
                        {apiViajantes.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.apellido} {" "} {option.nombre}
                            </option>
                        ))}
                    </select>
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Completar *</span>
                </label>
            </form>
            <div className="flex flex-row justify-center my-5">
                <button
                    onClick={() => { navegate("/clientes") }}
                    className="px-4 py-2 bg-gray-300 rounded mr-2"
                >
                    Cancel
                </button>
                <button
                    className="px-6  active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] hover:bg-green-500 ease-in-out py-3 rounded bg-green-300 text-white"
                    onClick={handleNewCliente}>
                    Nuevo Cliente
                </button>
            </div>
        </div>

    </div>
}

export default FormNewCliente