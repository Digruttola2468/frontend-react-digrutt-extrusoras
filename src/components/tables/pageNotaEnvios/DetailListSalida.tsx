import axios from "axios"
import React, { useEffect, useState } from "react"
import { useAuth } from "../../../context/User.context"
import { FaPen } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { FaPlus } from "react-icons/fa";
import DialogDelete from "../../dialog/DialogDelete"
import DialogUpdateSalida from "../pageSalida/DialogUpdateSalida"
import DialogNewSalida from "../pageSalida/DialogNewSalida"
import toast from "react-hot-toast"
import moment from "moment"
import { CiCalendarDate } from "react-icons/ci"
import useSWR from "swr"

export interface SalidaData {
    id: number
    id_inventario: number
    price: number
    id_nota_envio?: number
    id_remito?: number
    codigo: string
    descripcion: string
    idColor: number
    idTipoProducto: number
    fecha: Date
    num_envio: number
    stock_mts: number
    metros_x_rollo: number
    color: string
}

interface DetailListSalidaProps {
    item: number;
}

const fetcher = async (url: string) => {
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data.payload;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

const DetailListSalida: React.FC<DetailListSalidaProps> = ({ item }) => {
    const { BASE_URL } = useAuth();
    const [listSalida, setListSalida] = useState<SalidaData[]>([]);
    const [listFinance, setListFinance] = useState<{ descripcion: string, empleado: string, fecha: string, forma_pago: string, price: number }[]>([]);

    const [isDialogDelete, setIsDialogDelete] = useState<boolean>(false);
    const [isDialogUpdate, setIsDialogUpdate] = useState<boolean>(false);
    const [isDialogCreate, setIsDialogCreate] = useState<boolean>(false);

    const [indexDelete, setIndexDelete] = useState<number>();
    const [indexUpdate, setIndexUpdate] = useState<SalidaData>();

    const { mutate } = useSWR(`${BASE_URL}/api/notaEnvio/${item}`, fetcher, {
        onSuccess: (result) => {
            setListSalida(result.data.payload.salidas)
            setListFinance(result.data.payload.finance);
        }
    });

    useEffect(() => {
        axios.defaults.withCredentials = true;

        axios.get(`${BASE_URL}/api/notaEnvio/${item}`).then(result => {
            setListSalida(result.data.payload.salidas)
            setListFinance(result.data.payload.finance);
        }).catch(e => { })
    }, [item])

    // DIALOGS
    const handleOpenDialogDelete = (index: number) => { setIndexDelete(index); setIsDialogDelete(true) }
    const handleCloseDialogDelete = () => setIsDialogDelete(false);

    const handleUpdateDialogOpen = (index: SalidaData) => { setIndexUpdate(index); setIsDialogUpdate(true); }
    const handleUpdateDialogClose = () => setIsDialogUpdate(false);

    const handleCreateDialogOpen = () => setIsDialogCreate(true);
    const handleCreateDialogClose = () => setIsDialogCreate(false);


    const handleDeleteSalida = (item: number) => {
        axios.defaults.withCredentials = true;

        axios.delete(`${BASE_URL}/api/salida/${item}`).then(result => {
            toast.success("Se Elimino Correctamente");
            setListSalida(listSalida.filter(e => e.id != item))
        }).catch(e => { });

        mutate();
    }
    const handleUpdateSalida = (item: number, updatedData: SalidaData) => {
        axios.defaults.withCredentials = true;

        axios.put(`${BASE_URL}/api/salida/${item}`, updatedData).then(result => {
            toast.success("Se Actualizo Correctamente");
            const idSalida = item;
            setListSalida(listSalida.map(item => (item.id === idSalida ? result.data.payload : item)));

        }).catch(e => { });

        mutate();
    }
    const handleNewSalida = (createData: SalidaData) => {
        axios.defaults.withCredentials = true;

        axios.post(`${BASE_URL}/api/salida`, { id_inventario: createData.id_inventario, id_nota_envio: item, price: createData.price, stock_mts: createData.stock_mts }).then(result => {
            toast.success("Se Creo Correctamente");
            setListSalida([...listSalida, result.data.payload]);
        }).catch(e => { });

        mutate();
    }

    return <div className='grid place-content-center w-full '>
        <div className='grid items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-3'>
            {listSalida.map(item => {
                return <div className='bg-gray-50 p-2 border rounded-md' key={item.id}>
                    <span className='font-semibold uppercase'>{item.codigo}</span>
                    <p className='text-sm '>{item.descripcion} {item.color} </p>
                    <p className='text-sm font-semibold'>Salida: {item.stock_mts}mts <span>de {item.metros_x_rollo}mts x rollo</span></p>
                    <div className="flex flex-row justify-between items-center">
                        <p className='text-green-500 font-bold'> ${item.price}</p>
                        <p className="flex flex-row items-center gap-3">
                            <span className="text-blue-300 hover:text-blue-500 text-sm cursor-pointer" onClick={() => handleUpdateDialogOpen(item)}> <FaPen />  </span>
                            <span className="text-red-300 hover:text-red-500 text-lg cursor-pointer" onClick={() => handleOpenDialogDelete(item.id)}> <MdDelete /></span>
                        </p>
                    </div>
                </div>
            }
            )}
            <div className="border-blue-400 border-2 border-dashed h-[86px] grid place-content-center cursor-pointer rounded-md px-3" onClick={handleCreateDialogOpen}>
                <p className="flex flex-row items-center gap-2 text-blue-300 font-semibold"><FaPlus /> Nueva Salida</p>
            </div>
            <DialogDelete
                isOpen={isDialogDelete}
                onClose={handleCloseDialogDelete}
                onDelete={() => handleDeleteSalida(indexDelete)}
                title={`Eliminar Salida`}
            />
            <DialogUpdateSalida
                initialData={indexUpdate}
                isOpen={isDialogUpdate}
                onUpdate={handleUpdateSalida}
                onClose={handleUpdateDialogClose}
            />
            <DialogNewSalida
                isOpen={isDialogCreate}
                onClose={handleCreateDialogClose}
                onCreate={handleNewSalida}
            />
        </div>
        <div className="flex flex-col gap-1  ">
            {listFinance.map(e => {
                return <div className="border">
                    {e.price != null ? <p>Retiro: ARG${e.price}</p> : <></>}
                    <p>Por: {e.empleado}</p>
                    <p>Se pago con: {e.forma_pago}</p>
                    <p className="flex flex-row gap-2 items-center"><CiCalendarDate /> {formatDate(e.fecha)}</p>
                </div>
            })}
        </div>
    </div>
}
const formatDate = (date: Date) => {
    const fecha = new Date(date);

    const fechaMoment = moment(fecha);


    fechaMoment.locale();
    return fechaMoment.format('DD/MM/YYYY');
}
export default DetailListSalida