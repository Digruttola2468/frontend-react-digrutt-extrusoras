import { FaBars } from "react-icons/fa";
import LogoDigrutt from "./assets/digrutt_logo_d.png";
import { IoMdClose } from "react-icons/io";
import { ReactNode, useState } from "react";
import { useAuth } from "./context/User.context";
import { useNavigate } from "react-router-dom";

interface PrivateRouteProps {
    roles: string[];
}

const MainHeader: React.FC<PrivateRouteProps> = ({ roles }) => {
    const { user } = useAuth();

    const [navClass, setNavClass] = useState(
        "hidden h-full font-bold md:static md:mr-auto md:flex md:flex-row md:gap-4 md:p-0 md:h-auto"
    );

    const handleOpenMenu = () => {
        setNavClass(
            "absolute z-50 top-0 left-0 flex h-full w-4/5 flex-col gap-y-[21px] bg-white p-8 font-bold md:static md:mr-auto md:flex md:flex-row md:gap-4 md:p-0 md:h-auto"
        );
    };
    const handleCloseMenu = () => {
        setNavClass(
            "hidden h-full font-bold md:static md:mr-auto md:flex md:flex-row md:gap-4 md:p-0 md:h-auto"
        );
    };

    return (
        <>
            <header className="container flex items-center mx-auto py-8 px-5 gap-8 md:py-0">
                <button className="md:hidden" onClick={handleOpenMenu}>
                    <FaBars />
                </button>
                <img
                    src={LogoDigrutt}
                    alt="Logo Digrutt SRL"
                    className="mr-auto h-11 mb-1 md:mr-0"
                />
                <nav className={navClass}>
                    <button className="mb-8 md:hidden" onClick={handleCloseMenu}>
                        <IoMdClose />
                    </button>
                    <AuthenticateGeneralRoute>
                        <NavLinkHeader text="Home" to="/" /> 
                        <NavLinkHeader text="Inventario" to="/inventario" />
                        <NavLinkHeader text="Notas Envio" to="/notaEnvios" />
                        <NavLinkHeader text="Clientes" to="/clientes" />
                    </AuthenticateGeneralRoute>
                    <NoAuthenticateRoute>
                        <NavLinkHeader text="Iniciar Sesion" to="/login" />
                        <NavLinkHeader text="Registrarse" to="/register" />
                    </NoAuthenticateRoute>
                </nav>

            </header>
            <span className="container mx-auto hidden md:block h-[2px] w-full bg-gray-500"></span>
        </>
    );
};

const AuthenticateGeneralRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (user) return <>{children}</>;
    else return <></>
}

const NoAuthenticateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    if (!user) return <>{children}</>;
    else return <></>
}

const NavLinkHeader: React.FC<{ text: string, to: string }> = ({ text, to }) => {
    const navegate = useNavigate();
    return (
        <a className="group relative py-3 cursor-pointer" onClick={() => navegate(to)}>
            <span className="group-hover:text-red-300">{text}</span>
            <span className="absolute bottom-2 block w-full h-1 scale-x-0 group-hover:scale-x-100 transition-all duration-300 group-hover:bg-red-500"></span>
        </a>
    );
}

export default MainHeader;