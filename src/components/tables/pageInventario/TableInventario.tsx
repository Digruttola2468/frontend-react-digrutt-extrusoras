import React from 'react';
import PaginateTable from './PaginateTable';
import SearchTable from './SearchTable';
import { useInventario } from '../../../context/Inventario.context';

interface TableProps {
    onRowClick: (item: any) => void;
}

const TableInventario: React.FC<TableProps> = ({ onRowClick }) => {
    const { tableData, startPagination, endPagination } = useInventario();

    return (
        <>
            <SearchTable />
            <div className="overflow-x-auto">

                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Codigo</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Descripcion</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Precio x mt</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Precio x Caño</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Precio total</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">tipo</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">color</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Caño x mts</th>
                            <th className="py-2 px-4 border-b border-gray-300 text-left">Caños x bolsa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.slice(startPagination, endPagination).map((item) => (
                            <tr key={item.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => onRowClick(item)}>
                                <td className="py-2 px-4 border-b border-gray-300">{item.codigo} </td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.descripcion}</td>
                                <td className="py-2 px-4 border-b border-gray-300">${item.price}ARG</td>
                                <td className="py-2 px-4 border-b border-gray-300">${item.price * item.metros_x_rollo}ARG</td>
                                <td className="py-2 px-4 border-b border-gray-300">${item.price * item.metros_x_rollo * item.rollos_x_bolsas}ARG</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.tipo}</td>
                                <td className="py-2 px-4 border-b border-gray-300 "><div className={`w-4 h-4 border bg-[${item.hexacolor != null ? item.hexacolor.replace(/["']/g, '') : ""}]`}></div></td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.metros_x_rollo}</td>
                                <td className="py-2 px-4 border-b border-gray-300">{item.rollos_x_bolsas}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <PaginateTable />
            </div></>
    );
};

export default TableInventario;