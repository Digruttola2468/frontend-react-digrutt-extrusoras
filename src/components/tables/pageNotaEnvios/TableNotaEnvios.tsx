import React from 'react';
import { useNotaEnvio } from '../../../context/NotaEnvios.context';
import moment from 'moment';
import SearchNotaEnvio from './SearchNotaEnvios';
import PaginateTable from './PaginateNotaEnvio';
interface TableProps {
    onRowClick: (item: any) => void;
}

const TableNotaEnvio: React.FC<TableProps> = ({ onRowClick }) => {
    const { tableData, startPagination, endPagination } = useNotaEnvio();
    
    return (
        <>
         <SearchNotaEnvio/>
        <div className="overflow-x-auto">
            
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Nota Envio</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Fecha</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Cliente</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Direccion</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Viajante</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Valor Declarado</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.slice(startPagination, endPagination).map((item) => (
                        <tr key={item.id} className={` cursor-pointer ${item.pagado >= 1 ? "bg-green-300 hover:bg-green-400" : "hover:bg-gray-100"}`} onClick={() => onRowClick(item)}>
                            <td className="py-2 px-4 border-b border-gray-300">{item.num_envio}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{formatDate(item.fecha)}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{item.cliente}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{item.domicilio}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{item.apellidoViajante}</td>
                            <td className="py-2 px-4 border-b border-gray-300">${item.valorDeclarado} {item.descuento_porcentaje != null ? `- ${item.descuento_porcentaje}%` : ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <PaginateTable />
        </div></>
    );
};

const formatDate = (date: Date) => {
    const fecha = new Date(date);

    const fechaMoment = moment(fecha);


    fechaMoment.locale();
    return fechaMoment.format('DD/MM/YYYY');
}

export default TableNotaEnvio;