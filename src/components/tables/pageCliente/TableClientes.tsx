import React from 'react';
import { useClient } from '../../../context/Clientes.context';
import PaginateTable from './PaginateTable';
import SearchTable from './SearchTable';

interface TableProps {
    onRowClick: (item: any) => void;
}

const TableCliente: React.FC<TableProps> = ({ onRowClick }) => {
    const { tableData, startPagination, endPagination } = useClient();

    return (
        <>
        <SearchTable/>
        <div className="overflow-x-auto">
            
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Cliente</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Domicilio</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Teléfono</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Viajante</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Ciudad</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.slice(startPagination, endPagination).map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(item)}>
                            <td className="py-2 px-4 border-b border-gray-300">{`${item.categoria}  ${item.cliente}`}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{item.domicilio}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{item.telefono}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{`${item.nombreViajante} ${item.apellidoViajante}`}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{item.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginateTable/>
        </div></>
    );
};

export default TableCliente;