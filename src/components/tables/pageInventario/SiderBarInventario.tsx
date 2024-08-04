import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import DialogDelete from '../../dialog/DialogDelete';
import axios from 'axios';
import { useAuth } from '../../../context/User.context';
import toast from 'react-hot-toast';
import DialogUpdateInventario from './DialogUpdateInventario';
import { useInventario } from '../../../context/Inventario.context';

export interface inventarioData {
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
    tipo: string
    hexacolor: string
}

interface SidebarProps {
    item: inventarioData;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ item, onClose }) => {
    if (!item) return null;

    const { BASE_URL } = useAuth();
    const { deleteDataTable, updateDataTable } = useInventario();

    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState<boolean>(false);
    const [isDialogDelete, setIsDialogDelete] = useState<boolean>(false);

    // ------------- OPEN AND CLOSE DIALOG -------------
    // ---- DELETE ---
    const handleOpenDeleteCliente = () => setIsDialogDelete(true);
    const handleCloseDialogDelete = () => setIsDialogDelete(false);
    // ---- UPDATE ---
    const handleUpdateCliente = () => setIsDialogUpdateOpen(true);
    const handleCloseDialog = () => setIsDialogUpdateOpen(false);
    //---------------------------------------------------

    const handleUpdateUser = (updatedData: inventarioData) => {
        console.log(updatedData);

        axios.defaults.withCredentials = true;

        toast.promise(axios.put(`${BASE_URL}/api/inventario/${item.id}`,
            {
                codigo: updatedData.codigo,
                stock_mts: updatedData.stock_mts,
                descripcion: updatedData.descripcion,
                price: updatedData.price,
                idColor: updatedData.idColor,
                idTipoProducto: updatedData.idTipoProducto,
                rollos_x_bolsas: updatedData.rollos_x_bolsas,
                metros_x_rollo: updatedData.metros_x_rollo
            }
        ), {
            loading: "Actualizando Producto...",
            success: (result) => {
                updateDataTable(item.id, result.data.payload);
                return "Producto Actualizado"
            },
            error: "No se Actualizo"
        })
    };
    const handleDeleteCliente = () => {

        axios.defaults.withCredentials = true;

        toast.promise(axios.delete(`${BASE_URL}/api/inventario/${item.id}`), {
            loading: "Eliminando Producto...",
            success: () => {
                deleteDataTable(item.id);
                return "Producto Eliminado"
            },
            error: "No se Elimino"
        })
    }

    return (
        <div className="fixed z-50 top-0 right-0 w-64 h-full bg-white shadow-lg border-l border-gray-200 p-4">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl"><IoMdClose /></button>
            <div className='flex flex-row justify-between px-1 items-center my-2'>
                <span className="text-xl font-bold">{item.codigo}</span>
                <span className={`w-5 h-5 border bg-[${item.hexacolor != null ? item.hexacolor.replace(/["']/g, '') : ""}]`}></span>
            </div>
            <p className='text-sm text-gray-400 font-semibold'>{item.descripcion}</p>
            <p className='text-sm text-gray-400'>{item.tipo}</p>
            <p><strong>$</strong> {item.price}</p>
            <p><strong>Stock en mts:</strong> {item.stock_mts}</p>
            <p><strong>Caño x mts:</strong> {item.metros_x_rollo}</p>
            <p><strong>Caño x bolsa:</strong> {item.rollos_x_bolsas}</p>
            <div className='w-full flex flex-row justify-between items-center my-4'>
                <span className='text-xl text-blue-200 hover:text-blue-400 cursor-pointer active:scale-[.98] hover:text-2xl active:duration-75 transition-all hover:scale-[1.01] ease-in-out'
                    onClick={handleUpdateCliente}><FaPen /> </span>
                <span className='text-2xl text-red-200 hover:text-red-400 cursor-pointer active:scale-[.98] hover:text-3xl active:duration-75 transition-all hover:scale-[1.01] ease-in-out'
                    onClick={handleOpenDeleteCliente}><MdDelete /></span>
            </div>
            <DialogUpdateInventario
                isOpen={isDialogUpdateOpen}
                onClose={handleCloseDialog}
                onUpdate={handleUpdateUser}
                initialData={item}
            />
            <DialogDelete
                isOpen={isDialogDelete}
                onClose={handleCloseDialogDelete}
                onDelete={handleDeleteCliente}
                title={`Eliminar ${item.descripcion}`}
            />
        </div>
    );
};

export default Sidebar;