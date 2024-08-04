import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import DialogUpdateCliente from './DialogUpdateCliente';
import DialogDelete from '../../dialog/DialogDelete';
import { useClient } from '../../../context/Clientes.context';
import axios from 'axios';
import { useAuth } from '../../../context/User.context';
import toast from 'react-hot-toast';

export interface clienteData {
    id: number
    categoria?: string,
    correo: string
    cliente: string,
    domicilio: string,
    telefono?: string,
    nombreViajante?: string,
    apellidoViajante?: string,
    city?: string,
    idCat_cliente?: number
    idCity?: number
    idViajante?: number
}

interface SidebarProps {
    item: clienteData;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ item, onClose }) => {
    if (!item) return null;

    const { BASE_URL } = useAuth();
    const { deleteDataTable, updateDataTable } = useClient();

    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
    const [isDialogDelete, setIsDialogDelete] = useState<boolean>(false);

    // ------------- OPEN AND CLOSE DIALOG -------------
    // ---- DELETE ---
    const handleOpenDeleteCliente = () => setIsDialogDelete(true);
    const handleCloseDialogDelete = () => setIsDialogDelete(false);
    // ---- UPDATE ---
    const handleDialogUpdateCliente = () => setIsDialogUpdateOpen(true);
    const handleCloseDialog = () => setIsDialogUpdateOpen(false);
    //---------------------------------------------------


    const handleUpdateCliente = (updatedData: clienteData) => {
        axios.defaults.withCredentials = true;

        toast.promise(axios.put(`${BASE_URL}/api/clientes/${item.id}`, {
            nombre: updatedData.cliente,
            domicilio: updatedData.domicilio,
            correo: updatedData.correo,
            telefono: updatedData.telefono,
            idCatCliente: parseInt(updatedData.idCat_cliente),
            idCity: parseInt(updatedData.idCity),
            idViajante: parseInt(updatedData.idViajante)
        }), {
            loading: "Actualizando...",
            success: (result) => {
                updateDataTable(item.id, result.data.payload);
                return "Cliente Actualizado"
            },
            error: "No se Actualizo"
        })
    };
    const handleDeleteCliente = () => {
        axios.defaults.withCredentials = true;

        toast.promise(axios.delete(`${BASE_URL}/api/clientes/${item.id}`,),{
            loading: "Eliminando...",
            success: () => {
                deleteDataTable(item.id)
                return "Cliente Eliminado"
            },
            error: "No se elimino"
        })
    }

    return (
        <div className="fixed z-50 top-0 right-0 w-64 h-full bg-white shadow-lg border-l border-gray-200 p-4">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl"><IoMdClose /></button>
            <h2 className="text-xl font-bold mb-4">Detalles</h2>
            <p><strong>Cliente:</strong> {item.categoria + " " + item.cliente}</p>
            <p><strong>Domicilio:</strong> {item.domicilio}</p>
            <p><strong>Teléfono:</strong> {item.telefono}</p>
            <p><strong>Viajante:</strong> {item.nombreViajante != null ? item.nombreViajante : "" + item.apellidoViajante != null ? item.apellidoViajante : ""}</p>
            <p><strong>Ciudad:</strong> {item.city}</p>
            <div className='w-full flex flex-row justify-between items-center my-4'>
                <span className='text-xl text-blue-200 hover:text-blue-400 cursor-pointer active:scale-[.98] hover:text-2xl active:duration-75 transition-all hover:scale-[1.01] ease-in-out'
                    onClick={handleDialogUpdateCliente}><FaPen /> </span>
                <span className='text-2xl text-red-200 hover:text-red-400 cursor-pointer active:scale-[.98] hover:text-3xl active:duration-75 transition-all hover:scale-[1.01] ease-in-out'
                    onClick={handleOpenDeleteCliente}><MdDelete /></span>
            </div>
            <DialogUpdateCliente
                isOpen={isDialogUpdateOpen}
                onClose={handleCloseDialog}
                onUpdate={handleUpdateCliente}
                initialData={item}
            />
            <DialogDelete
                isOpen={isDialogDelete}
                onClose={handleCloseDialogDelete}
                onDelete={handleDeleteCliente}
                title={`Eliminar ${item.categoria + item.cliente}`}
            />
        </div>
    );
};

export default Sidebar;