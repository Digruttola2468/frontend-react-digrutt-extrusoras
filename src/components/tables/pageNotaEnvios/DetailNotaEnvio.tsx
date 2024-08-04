import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import DialogDelete from '../../dialog/DialogDelete';
import axios from 'axios';
import { useAuth } from '../../../context/User.context';
import toast from 'react-hot-toast';
import { useNotaEnvio } from '../../../context/NotaEnvios.context';
import moment from 'moment';
import { FaMoneyBill } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { GiStreetLight } from "react-icons/gi";
import DetailListSalida from './DetailListSalida';
import { FaFileExcel } from "react-icons/fa6";
import fileDownload from "js-file-download";
import DialogUpdateNotaEnvio from './DialogUpdateNotaEnvios';
import DialogUpdatePagado from './DialogUpdatePagado';

export interface NotaEnvioData {
    id: number
    num_envio: number
    fecha: Date
    valorDeclarado: number
    idCliente: number
    idViajante: number
    cliente: string
    domicilio: string
    telefono: string
    lat: number
    lon: number
    nombreViajante: string
    apellidoViajante: string
    telefonoViajante: string
    pagado: number
    categoria: string
    descuento_porcentaje: number
}


interface SidebarProps {
    item: NotaEnvioData;
    onClose: () => void;
}

const DetailNotaEnvio: React.FC<SidebarProps> = ({ item, onClose }) => {
    if (!item) return null;

    const { BASE_URL } = useAuth();
    const { deleteDataTable, updateDataTable } = useNotaEnvio();

    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
    const [isDialogDelete, setIsDialogDelete] = useState<boolean>(false);
    const [isDialogUpdatePagado, setIsDialogUpdatePagado] = useState<boolean>(false);
    

    // ------------- OPEN AND CLOSE DIALOG -------------
    // ---- DELETE ---
    const handleOpenDeleteCliente = () => setIsDialogDelete(true);
    const handleCloseDialogDelete = () => setIsDialogDelete(false);
    // ---- UPDATE ---
    const handleUpdateCliente = () => setIsDialogUpdateOpen(true);
    const handleCloseDialog = () => setIsDialogUpdateOpen(false);
    // ---- UPDATE PAGADO ----
    const handleUpdatePagado = () => setIsDialogUpdatePagado(true);
    const handleClosePagado = () => {onClose(), setIsDialogUpdatePagado(false);}
    //---------------------------------------------------


    const handleUpdateUser = (updatedData: NotaEnvioData) => {
        const modifiedDate = moment(updatedData.fecha, "YYYY-MM-DD").format("YYYY/MM/DD");

        axios.defaults.withCredentials = true;

        axios.put(`${BASE_URL}/api/notaEnvio/${item.id}`, {
            num_envio: parseInt(updatedData.num_envio),
            fecha: modifiedDate,
            idCliente: parseInt(updatedData.idCliente),
            pagado: parseInt(updatedData.pagado),
        }).then(result => {
            updateDataTable(item.id, result.data.payload);
            toast.success("Se Actualizo Correctamente");
            onClose();
        }).catch(e => { });
    };

    const handleDeleteCliente = () => {
        axios.defaults.withCredentials = true;

        axios.delete(`${BASE_URL}/api/notaEnvio/${item.id}`,).then(result => {
            deleteDataTable(item.id);
            onClose();
            toast.success("Se Elimino Correctamente");
        }).catch(e => { });
    }

    const handleNewExcel = () => {
        axios({
            url: `${BASE_URL}/api/excel/notaEnvio/${item.id}`,
            method: "GET",
            responseType: "blob",
        }).then((res) => {
            fileDownload(res.data, `NotaEnvio_${item.num_envio}.xlsx`);
        });
    }

    return (
        <div className="flex flex-col sm:flex-row gap-2 bg-white shadow-lg border-l border-gray-200 p-4 my-2">
            <div className='min-w-[250px] max-w-[500px]'>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl"><IoMdClose /></button>
                <h2 className="flex flex-row justify-between items-center text-xl font-bold mb-4">Nota Envio {item.num_envio} <FaFileExcel className='text-green-400 hover:text-green-500 cursor-pointer' onClick={handleNewExcel} /> </h2>
                <div className='flex flex-row gap-3'>
                    <p className='flex flex-row items-center gap-2'><CiCalendarDate />{formatDate(item.fecha)}</p>
                    <p onClick={handleUpdatePagado} className={`flex flex-row items-center gap-2 font-semibold text-sm ${item.pagado >= 1 ? "text-green-300" : "text-red-300"}` }> <FaMoneyBill /> {item.pagado >= 1 ? "Pagado" : "No Pago"}</p>
                </div>
                <div className='flex flex-row gap-2 items-center py-1 flex-wrap'>
                    <p className='flex flex-row items-center text-sm'><GiStreetLight />{item.domicilio}</p>
                    <p className='text-sm'>{item.categoria} {item.cliente}</p>
                </div>
                <div>
                </div>
                {
                    item.nombreViajante != null || item.apellidoViajante != null ? <p className='text-sm pb-1'>Consumision: {item.nombreViajante != null ? item.nombreViajante : ""} {item.apellidoViajante != null ? item.apellidoViajante : ""}</p> : <></>
                }
                <p className='font-bold font-mono text-green-500'>ARG${item.valorDeclarado}  {item.descuento_porcentaje != null ? `- ${item.descuento_porcentaje}%` : ""}</p>
                {item.descuento_porcentaje != null ? <p>Tiene que pagar: ARG${item.valorDeclarado - (item.valorDeclarado * item.descuento_porcentaje / 100)}</p> : ""}
                <div className='w-full flex flex-row justify-between items-center my-4'>
                    <span className='text-xl text-blue-200 hover:text-blue-400 cursor-pointer active:scale-[.98] hover:text-2xl active:duration-75 transition-all hover:scale-[1.01] ease-in-out'
                        onClick={handleUpdateCliente}><FaPen /> </span>
                    <span className='text-2xl text-red-200 hover:text-red-400 cursor-pointer active:scale-[.98] hover:text-3xl active:duration-75 transition-all hover:scale-[1.01] ease-in-out'
                        onClick={handleOpenDeleteCliente}><MdDelete /></span>
                </div>
                <DialogUpdatePagado
                    isOpen={isDialogUpdatePagado}
                    onClose={handleClosePagado}
                    idNotaEnvio={item.id}
                />
                <DialogUpdateNotaEnvio
                    isOpen={isDialogUpdateOpen}
                    onClose={handleCloseDialog}
                    onUpdate={handleUpdateUser}
                    initialData={item}
                />
                <DialogDelete
                    isOpen={isDialogDelete}
                    onClose={handleCloseDialogDelete}
                    onDelete={handleDeleteCliente}
                    title={`Eliminar Nota Envio: ${item.num_envio}`}
                />
            </div>
            <DetailListSalida item={item.id} />
        </div>
    );
};

const formatDate = (date: Date) => {
    const fecha = new Date(date);

    const fechaMoment = moment(fecha);


    fechaMoment.locale();
    return fechaMoment.format('DD/MM/YYYY');
}

export default DetailNotaEnvio;