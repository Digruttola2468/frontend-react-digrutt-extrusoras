import axios from 'axios';
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAuth } from './User.context';
import moment from 'moment';

interface NotaEnviosProps {
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
    searchByFecha: (search: string) => void,
    searchByViajante: (search: number) => void,
    searchByPagados: (search: number) => void,
    searchByNotaEnvio: (search: string) => void,
    searchMesFecha: (search: number) => void,
    getLastNotaEnvio: () => number
}

const NotaEnvioContext = createContext<NotaEnviosProps | undefined>(undefined);

interface NotaEnvioProviderProps {
    children: ReactNode;
}

interface Data {
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
    descuento_porcentaje: number
}

const fetcher = async (url: string) => {
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data.payload;
    } catch (error) {
        throw new Error('Error fetching data');
    }
};

export const NotaEnvioProvider: React.FC<NotaEnvioProviderProps> = ({ children }) => {
    const { BASE_URL } = useAuth();

    // --- PAGINATION ---
    const showRowsTable = 10;
    const [page, setPage] = useState<number>(1)
    const [startPagination, setStartPagination] = useState(0);
    const [endPagination, setEndPagination] = useState(showRowsTable);

    // ---- SHOW TABLE ----
    const [table, setTable] = useState<Data[]>([]);

    //FETCH DATA
    const { data, isLoading, error, mutate } = useSWR<Data[]>(`${BASE_URL}/api/notaEnvio`, fetcher, { onSuccess: (data) => { setTable(data) } });
    
    
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

    const searchByFecha = (search: string) => {
        setTable(data.filter(e => { return moment(e.fecha).isSame(moment(search, 'YYYY-MM-DD')) }))
    }

    const searchMesFecha = (search: number) => {
        // Función para extraer el mes de una fecha
        function extraerMes(fecha: Date) {
            return moment(fecha).month() + 1;  // month() devuelve un índice basado en 0
        }

        setTable(data.filter(e => extraerMes(e.fecha) == search ))
    }

    const searchByViajante = (search: number) => {
        setTable(data.filter(e => { return e.idViajante == search }))
    }

    const searchByPagados = (search: number) => {
        setTable(data.filter(e => { return e.pagado == search }))
    }

    const searchByNotaEnvio = (search: string) => {
        setTable(data.filter(e => { return new String(e.num_envio).includes(search) }))
    }

    const getLastNotaEnvio = () => {
        if (data != null) {
            const mapData = data?.map(e => e.num_envio)
            return Math.max(...mapData) + 1
        } return 0
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
        <NotaEnvioContext.Provider value={{ apiOriginal: data || [], tableData: table, newDataTable, updateDataTable, deleteDataTable, isLoading, error, startPagination, setPage, endPagination, page, nextPagination, previusPagination, refreshTable, searchByCliente,searchMesFecha, searchByFecha, searchByViajante, searchByPagados, searchByNotaEnvio,getLastNotaEnvio  }}>
            {children}
        </NotaEnvioContext.Provider>
    );
};

export const useNotaEnvio = () => {
    const context = useContext(NotaEnvioContext);

    if (context === undefined) {
        throw new Error('useClient must be used within an ClientProvider');
    }

    return context;
};