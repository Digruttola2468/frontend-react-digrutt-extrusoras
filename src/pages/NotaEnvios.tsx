import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NotaEnvioProvider } from "../context/NotaEnvios.context";
import TableNotaEnvio from "../components/tables/pageNotaEnvios/TableNotaEnvios";
import DetailNotaEnvio from "../components/tables/pageNotaEnvios/DetailNotaEnvio";

const NotaEnvios = () => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleRowClick = (item: any) => {
        setSelectedItem(item);
    };

    const handleCloseSidebar = () => {
        setSelectedItem(null);
    };

    return (
        <NotaEnvioProvider>
            <div className="relative min-h-screen  p-4">
                <TableNotaEnvio onRowClick={handleRowClick} />
                {selectedItem && (
                    <DetailNotaEnvio item={selectedItem} onClose={handleCloseSidebar} />
                )}
                <Outlet />
            </div>
        </NotaEnvioProvider>
    );
}

export default NotaEnvios;