import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react"
import { useAuth } from "../../../context/User.context";
import toast from "react-hot-toast";
import { useNotaEnvio } from "../../../context/NotaEnvios.context";

const listPagado = [
    { value: 1, label: "Pagado" },
    { value: 0, label: "No Pagado" }
]

const listFormaPago = [
    { value: 1, label: "Efectivo" },
    { value: 2, label: "Transferencia" },
    { value: 3, label: "Cheque" }
]

interface UpdateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    idNotaEnvio: number
}

const DialogUpdatePagado: React.FC<UpdateDialogProps> = ({ idNotaEnvio, isOpen, onClose }) => {

    const { BASE_URL } = useAuth();
    const { updateDataTable } = useNotaEnvio();

    const [pagado, setPagado] = useState("1");
    const [recibio, setRecibio] = useState("1");
    const [metodoPago, setMetodoPago] = useState("1");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [price, setPrice] = useState("");

    // API DE EMPLEADOS
    const [apiEmpleados, setApiEmpleados] = useState<{ id: number; empleado: string, telefono: string }[]>([]);

    useEffect(() => {

        setFecha(formatDate(new Date()))

        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/employed`).then(result => {
            setApiEmpleados(result.data.payload)
        }).catch(e => { });
    }, [])

    const handleNewPagado = () => {
        const modifiedDate = moment(fecha, "YYYY-MM-DD").format("YYYY/MM/DD");

        axios.defaults.withCredentials = true;

        axios.put(`${BASE_URL}/api/notaEnvio/${idNotaEnvio}/pagado/${parseInt(pagado)}`, { descripcion, fecha: modifiedDate, idEmpleado: parseInt(recibio), idFormaPago: parseInt(metodoPago), price: parseFloat(price) }).then(result => {
            updateDataTable(idNotaEnvio, result.data.payload);
            toast.success("Se Actualizo Correctamente");
            onClose();
        }).catch(e => { })
    }

    if (!isOpen) return null;

    return <>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <div className="w-full flex flex-row items-center gap-1">
                    <label className="block mb-2">
                        <span className="text-gray-700">Pagado</span>
                        <select
                            id="comboBox"
                            name="comboBox"
                            value={pagado}
                            onChange={(evt) => setPagado(evt.target.value)}
                            className="border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {listPagado.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="w-full flex flex-row items-center gap-1">
                    <label className="block mb-2">
                        <span className="text-gray-700">Fecha</span>
                        <input
                            type="date"
                            value={fecha}
                            disabled={pagado.includes("0")}
                            onChange={(e) => setFecha(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </label>
                </div>
                <div className="w-full flex flex-row items-center gap-1">
                    <label className="block mb-2">
                        <span className="text-gray-700">Forma Pago</span>
                        <select
                            id="comboBox"
                            name="comboBox"
                            value={metodoPago}
                            disabled={pagado.includes("0")}
                            onChange={(evt) => setMetodoPago(evt.target.value)}
                            className="border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {listFormaPago.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="w-full flex flex-row items-center gap-1">
                    <label className="block mb-2">
                        <span className="text-gray-700">Quien lo Recibio la plata?</span>
                        <select
                            id="comboBox"
                            name="comboBox"
                            value={recibio}
                            disabled={pagado.includes("0")}
                            onChange={(evt) => setRecibio(evt.target.value)}
                            className="border-2 mt-1 w-full block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {apiEmpleados?.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.empleado}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="w-full flex flex-row items-center gap-1">
                    <label className="block mb-2">
                        <span className="text-gray-700">Cantidad $ARG</span>
                        <input
                            type="number"
                            value={price}
                            disabled={pagado.includes("0")}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </label>
                </div>
                <div className="w-full flex flex-row items-center gap-1">
                    <label className="block mb-2">
                        <span className="text-gray-700">Descripcion</span>
                        <input
                            type="text"
                            value={descripcion}
                            disabled={pagado.includes("0")}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
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
                        onClick={handleNewPagado}
                        className="px-4 py-2 bg-indigo-500 text-white rounded active:scale-[.98] active:duration-75 transition-all hover:scale-[1.04] hover:bg-indigo-700 ease-in-out text-lg "
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    </>
}

const formatDate = (date: Date) => {
    const fecha = new Date(date);

    const fechaMoment = moment(fecha);


    fechaMoment.locale();
    return fechaMoment.format('yyyy/MM/DD');
}

export default DialogUpdatePagado