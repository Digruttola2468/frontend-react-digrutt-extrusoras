import { useState } from "react";
import { Outlet } from "react-router-dom";
import { InventarioProvider } from "../context/Inventario.context";
import Sidebar from "../components/tables/pageInventario/SiderBarInventario";
import TableInventario from "../components/tables/pageInventario/TableInventario";

const InventarioPage = () => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleRowClick = (item: any) => {
        setSelectedItem(item);
    };

    const handleCloseSidebar = () => {
        setSelectedItem(null);
    };

    return (
        <InventarioProvider>
            <div className="relative min-h-screen  p-4">
                <TableInventario onRowClick={handleRowClick} />
                {selectedItem && (
                    <Sidebar item={selectedItem} onClose={handleCloseSidebar} />
                )}
                <Outlet />
            </div>
        </InventarioProvider>
    );
}

export default InventarioPage;