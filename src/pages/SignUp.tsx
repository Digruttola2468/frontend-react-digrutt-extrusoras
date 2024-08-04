import { useEffect, useState } from "react";
import TextField from "../components/textField/TextFieldUi"
import logo from "../assets/digrutt_logo_d.png"
import Button from "../components/buttons/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/User.context";
import toast from "react-hot-toast";

//nombre, apellido, telefono, gmail, password
const SignUp = () => {
    const navegate = useNavigate();
    const { BASE_URL } = useAuth();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [gmail, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [telefono, setTelefono] = useState("");

    const [error, setError] = useState<{ path: string, message: string }[]>([]);

    const handleClickRegister = () => {
        if (password === repeatPassword) {
            axios.post(`${BASE_URL}/api/session/register`, { nombre, apellido, telefono, password, gmail }).then(result => {
                toast.success("Falta Verificar el correo electronico")
                empty();
            }).catch(e => {
                const error = e.response.data.errors;
                console.log(error);

                if (error != null)
                    setError(error)
                else {
                    setPassword("")
                    setError([]);
                    toast.error(e.response.data)
                }
            })
        } else toast.error("Las contraseñas no son Iguales")

    }

    const errorCampu = (field: string) => {
        return error.find(error => error.path === field) ? true : false;
    }
    const getErrorMessages = (field: string) => {
        return error.filter(error => error.path === field).map(error => error.message);
    };

    const empty = () => {
        setNombre("")
        setApellido("")
        setGmail("")
        setPassword("")
        setRepeatPassword("")
        setTelefono("")
        setError([])
    }

    const handleClickRedictLogin = () => navegate("/login")


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
                <div className="flex flex-row gap-2">
                    <label className="block mb-2 relative">
                        <span className="text-gray-700 font-semibold">Nombre</span>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Nombre"
                            className=" block bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        />
                        <span className="text-xs p-0 m-0 text-red-400 absolute">{getErrorMessages("nombre")[0]}</span>
                    </label>
                    <label className="block mb-2">
                        <span className="text-gray-700 font-semibold">Apellido</span>
                        <input
                            type="text"
                            value={apellido}
                            placeholder="Apellido"
                            onChange={(e) => setApellido(e.target.value)}
                            className="block bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        />
                        <span className="text-xs p-0 m-0 text-red-400 absolute">{getErrorMessages("apellido")[0]}</span>
                    </label>
                </div>
                <label className="block mb-2">
                    <span className="text-gray-700 font-semibold">Telefono</span>
                    <input
                        type="number"
                        value={telefono}
                        placeholder="+54 9 341 000 0000"
                        onChange={(e) => setTelefono(e.target.value)}
                        className="block bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    />
                    <span className="text-xs p-0 m-0 text-gray-400 absolute">Opcional</span>
                </label>
                <div>
                    <label className="block mb-2">
                        <span className="text-gray-700 font-semibold">Correo Electronico</span>
                        <input
                            type="email"
                            placeholder="tucorreoelectronico@gmail.com"
                            value={gmail}
                            onChange={(e) => setGmail(e.target.value)}
                            className="block bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        />
                        <span className="text-xs p-0 m-0 text-red-400 absolute">{getErrorMessages("gmail")[0]}</span>
                    </label>
                </div>
                <div>
                    <label className="block mb-2">
                        <span className="text-gray-700 font-semibold">Contraseña</span>
                        <input
                            type="password"
                            value={password}
                            placeholder="**********************"
                            onChange={(e) => setPassword(e.target.value)}
                            className="block bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        />
                        <span className="text-xs p-0 m-0 text-red-400 absolute">{getErrorMessages("password")[0]}</span>
                    </label>
                </div>
                <div>
                    <label className="block mb-2">
                        <span className="text-gray-700 font-semibold">Repetir Contraseña</span>
                        <input
                            type="password"
                            value={repeatPassword}
                            placeholder="**********************"
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            className="block bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        />
                    </label>
                </div>
                <div>
                    <Button buttonName="Registrarse" handleClick={handleClickRegister} />
                </div>
            </div>

            <div className="mt-8 flex justify-center items-center">
                <p className="font-medium text-base">Ya tenes una cuenta?</p>
                <button
                    className="text-violet-500 text-base font-medium ml-2 hover:text-violet-400"
                    onClick={handleClickRedictLogin}
                >
                    Iniciar Session
                </button>
            </div>
        </div>
    </div>
}

export default SignUp;