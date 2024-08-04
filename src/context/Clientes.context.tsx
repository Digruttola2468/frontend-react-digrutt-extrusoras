import axios from 'axios';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from './User.context';

interface ClientContextProps {
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
    searchByCliente: (search: string) => void,
    searchByDomicilio: (search: string) => void,
    searchByTelefono: (search: string) => void
}

const ClienteContext = createContext<ClientContextProps | undefined>(undefined);

interface ClientProviderProps {
    children: ReactNode;
}

interface Data {
    id: number
    cliente: string
    domicilio: string
    cuil?: string
    correo_electronico?: string
    telefono?: string
    idCat_cliente?: number
    idCity?: number
    idViajante?: number
    lat?: number
    lon?: number
    nombreViajante?: string
    apellidoViajante?: string
    telefonoViajante?: string
    categoria?: string
    city?: string
}

const fetcher = async (url: string) => {
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data.payload;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
    const { BASE_URL } = useAuth();

    // --- PAGINATION ---
    const showRowsTable = 10;
    const [page, setPage] = useState<number>(1)
    const [startPagination, setStartPagination] = useState(0);
    const [endPagination, setEndPagination] = useState(showRowsTable);

    // ---- SHOW TABLE ----
    const [table, setTable] = useState<Data[]>([]);

    //FETCH DATA
    const { data, isLoading, error, mutate } = useSWR<Data[]>(`${BASE_URL}/api/clientes`, fetcher, { onSuccess: (data) => { setTable(data) } });

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
        if (data != undefined) {
            setTable(data);
        }
    }

    const searchByCliente = (search: string) => {
        setTable(data.filter(e => { return e.cliente.toLowerCase().includes(search.toLowerCase()) }))
    }

    const searchByDomicilio = (search: string) => {
        setTable(data.filter(e => { return e.domicilio.toLowerCase().includes(search.toLowerCase()) }))
    }

    const searchByTelefono = (search: string) => {
        setTable(data.filter(e => { return e.telefono.toLowerCase().includes(search.toLowerCase()) }))
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
        <ClienteContext.Provider value={{ apiOriginal: data || [], tableData: table, newDataTable, updateDataTable, deleteDataTable, isLoading, error, startPagination, setPage, endPagination, page, nextPagination, previusPagination, refreshTable, searchByCliente, searchByDomicilio, searchByTelefono }}>
            {children}
        </ClienteContext.Provider>
    );
};

export const useClient = () => {
    const context = useContext(ClienteContext);

    if (context === undefined) {
        throw new Error('useClient must be used within an ClientProvider');
    }

    return context;
};