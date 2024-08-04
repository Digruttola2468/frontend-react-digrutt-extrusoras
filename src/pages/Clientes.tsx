import { useState } from "react";
import TableCliente from "../components/tables/pageCliente/TableClientes";
import Sidebar from "../components/tables/pageCliente/SiderBarClientes";
import { ClientProvider } from "../context/Clientes.context";
import { Outlet } from "react-router-dom";

const ClientesPage = () => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleRowClick = (item: any) => {
        setSelectedItem(item);
    };

    const handleCloseSidebar = () => {
        setSelectedItem(null);
    };

    return (
        <ClientProvider>
            <div className="relative min-h-screen  p-4">
                <TableCliente onRowClick={handleRowClick} />
                {selectedItem && (
                    <Sidebar item={selectedItem} onClose={handleCloseSidebar} />
                )}
                <Outlet />
            </div>
        </ClientProvider>
    );
}

export default ClientesPage;