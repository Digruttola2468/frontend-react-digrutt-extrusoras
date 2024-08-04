import axios from 'axios';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

type Role = 'admin' | 'user' | 'oficina' | "encargado" | "extrusora";

interface User {
    correo_electronico: string,
    nombre: string,
    apellido: string,
    telefono?: string,
    role: Role,
    isValidateGmail: number
}

interface AuthContextProps {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    BASE_URL: string,
    apiCiudad: { id: number, city: string }[],
    apiViajantes: { id: number, nombre: string, apellido: string }[]
    apiColores: {id: number,color: string,hexacolor: string  }[]
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// ----- API STRICT -----
const ciudad = [
    {
        id: 1, city: "Rosario",
    },
    {
        id: 2, city: "San Lorenzo",

    }, {
        id: 3, city: "Alvear",

    },
    {
        id: 4, city: "Pueblo Esther",

    }, {
        id: 5, city: "Perez",

    }, 
    {
        id: 6, city: "VGG"
    },
    {
        id: 7, city: "Entre Rios (provincia)"
    }
]

const viajantes = [
    {
        id: 1, nombre: "Richar", apellido: "Nicosia"
    },
    {
        id: 2, nombre: "Sebastian", apellido: "Di Gruttola"
    }
]

const colores = [
    {
        id: 1,
        color: "naranja",
        hexacolor: "#FF6633"
    },
    {
        id: 2,
        color: "verde",
        hexacolor: "#00CC00"
    },
    {
        id: 3,
        color: "azul",
        hexacolor: "#0033FF"
    },
    {
        id: 4,
        color: "blanco",
        hexacolor: "#FFFFFF"
    },
    {
        id: 6,
        color: "gris",
        hexacolor: "#999999"
    },
    {
        id: 7,
        color: "platil",
        hexacolor: "#cccccc"
    },
    {
        id: 8,
        color: "rojo",
        hexacolor: "#FF0000"
    },
    {
        id: 9,
        color: "negro",
        hexacolor: "#000000"
    }
]

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>("user", null);

    const BASE_URL = "http://localhost:3000";

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Realizar una solicitud al backend para verificar la autenticación
                const result = await axios.get('http://localhost:3000/api/session/check-auth', { withCredentials: true });
                console.log(result);
                
            } catch (error) {
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, BASE_URL, apiCiudad: ciudad, apiViajantes: viajantes, apiColores: colores }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};