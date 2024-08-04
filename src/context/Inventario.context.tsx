import axios from 'axios';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from './User.context';

interface InventarioContextProps {
    apiOriginal: Data[],
    tableData: Data[],
    newDataTable: (newData: Data) => void,
    updateDataTable: (id: number, updateData: Data) => void,
    deleteDataTable: (id: number) => void,
    isLoading: boolean,
    error: VoidFunction,
    startPagination: number,
    endPagination: number,
    page: number,
    setPage: Dispatch<SetStateAction<number>>,
    nextPagination: VoidFunction,
    previusPagination: VoidFunction,
    refreshTable: VoidFunction,
    searchByCodigo: (search: string) => void,
    searchByDescripcion: (search: string) => void,
    searchByColor: (search: string) => void,
    searchByTipoProducto: (search: string) => void
}
const InventarioContext = createContext<InventarioContextProps | undefined>(undefined);

interface Data {
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

const fetcher = async (url: string) => {
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data.payload;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

export const InventarioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { BASE_URL } = useAuth();

    // --- PAGINATION ---
    const showRowsTable = 10;
    const [page, setPage] = useState<number>(1)
    const [startPagination, setStartPagination] = useState(0);
    const [endPagination, setEndPagination] = useState(showRowsTable);

    // ---- SHOW TABLE ----
    const [table, setTable] = useState<Data[]>([]);

    //FETCH DATA
    const { data, isLoading, error, mutate } = useSWR<Data[]>(`${BASE_URL}/api/inventario`, fetcher, { onSuccess: (data) => { setTable(data) } });

    useEffect(() => {
        const endValue = showRowsTable * page;
        setStartPagination(endValue - showRowsTable);
        setEndPagination(endValue);
    }, [page])


    const nextPagination = () => {
        setStartPagination(endPagination);
        setEndPagination(endPagination + showRowsTable);
        setPage(page + 1)
    }

    const previusPagination = () => {
        setStartPagination(prevCount => prevCount - showRowsTable);
        setEndPagination(startPagination);
        setPage(page - 1);
    }

    const refreshTable = () => {
        if (data != undefined)
            setTable(data);

    }
    //
    const searchByCodigo = (search: string) => {
        setTable(data.filter(e => { return e.codigo.toLowerCase().includes(search.toLowerCase()) }))
    }

    const searchByDescripcion = (search: string) => {
        setTable(data.filter(e => { return e.descripcion.toLowerCase().includes(search.toLowerCase()) }))
    }

    const searchByColor = (search: string) => {
        const filterNull = data.filter(e => e.color != null )
        setTable(filterNull.filter(e => { return e.color.toLowerCase().includes(search.toLowerCase()) }))
    }

    const searchByTipoProducto = (search: string) => {
        const filterNull = data.filter(e => e.tipo != null )
        setTable(filterNull.filter(e => { return e.tipo.toLowerCase().includes(search.toLowerCase()) }))
    }

    const newDataTable = (newData: Data) => {
        setTable([...data, newData]);
        mutate();
    }
    const updateDataTable = (id: number, updateData: Data) => {
        setTable(data.map(item => (item.id === id ? updateData : item)));
        mutate();
    }
    const deleteDataTable = (id: number) => {
        setTable(data.filter(item => item.id !== id));
        mutate();
    }

    return (
        <InventarioContext.Provider value={{ apiOriginal: data || [], tableData: table, newDataTable, updateDataTable, deleteDataTable, isLoading, error, startPagination, setPage, endPagination, page, nextPagination, previusPagination, refreshTable, searchByCodigo, searchByDescripcion, searchByColor, searchByTipoProducto }}>
            {children}
        </InventarioContext.Provider>
    );
};

export const useInventario = () => {
    const context = useContext(InventarioContext);

    if (context === undefined) {
        throw new Error('useClient must be used within an ClientProvider');
    }

    return context;
};