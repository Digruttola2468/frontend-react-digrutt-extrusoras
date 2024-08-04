import { useState } from "react";
import axios from "axios";

import logo from "../assets/digrutt_logo_d.png"

import { useAuth } from "../context/User.context";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogIn = () => {
    const { login } = useAuth();
    const navegate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<{ path: string, message: string }[]>([]);

    const handleClickIniciarSession = () => {
        axios.defaults.withCredentials = true;

        axios.post("http://localhost:3000/api/session/login", { email, password }).then(result => {
            toast.success(`Bienvenido ${result.data.user.apellido} ${result.data.user.nombre} `)
            login(result.data.user);
        }).catch(e => {
            const error = e.response.data.errors;
            if (error != null)
                setError(error)
            else {
                setPassword("")
                setError([]);
                toast.error(e.response.data)
            }
        });
    }

    const errorCampu = (field: string) => {
        return error.find(error => error.path === field) ? true : false;
    }
    const getErrorMessages = (field: string) => {
        return error.filter(error => error.path === field).map(error => error.message);
    };

    const handleClickRedictRegister = () => {
        navegate("/register")
    }

    return <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                alt="Digrutt S.R.L"
                src={logo}
                className="mx-auto h-30 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 uppercase">
                DIGRUTT S.R.L
            </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="space-y-6">
                <label className="block mb-2">
                    <span className="text-gray-700 font-semibold">Correo Electronico</span>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block bg-gray-200 appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${errorCampu("email") ? "border-red-300 focus:border-red-500" : "focus:border-purple-500 border-gray-200"} `}
                    />
                    <span className="text-xs p-0 m-0 text-red-400 absolute">{getErrorMessages("email")[0]}</span>
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700 font-semibold">Contraseña</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`block bg-gray-200 appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white ${errorCampu("password") ? "border-red-300 focus:border-red-500" : "focus:border-purple-500 border-gray-200"} `}
                    />
                    <span className="text-xs p-0 m-0 text-red-400 absolute">{getErrorMessages("password")[0]}</span>
                </label>
                <div>
                    <button
                        className="w-full active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
                        onClick={handleClickIniciarSession}>
                        Iniciar Sesion
                    </button>
                </div>
            </div>

            <div className="mt-8 flex justify-center items-center">
                <p className="font-medium text-base">No tenes una cuenta?</p>
                <button
                    className="text-violet-500 text-base font-medium ml-2 hover:text-violet-400"
                    onClick={handleClickRedictRegister}
                >
                    Registrarse
                </button>
            </div>
        </div>
    </div>
}

export default LogIn;