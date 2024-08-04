import React, { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useNotaEnvio } from "../../../context/NotaEnvios.context";
import { useAuth } from "../../../context/User.context";

const SearchNotaEnvio = () => {

    const navegate = useNavigate();
    const { searchByCliente, searchByPagados, searchByNotaEnvio, searchByFecha, searchByViajante, searchMesFecha, refreshTable } = useNotaEnvio();
    const { apiViajantes } = useAuth();

    const [search, setSearch] = useState("");
    const [selectedOption, setSelectedOption] = useState("Cliente");

    const [selectOptionPagado, setSelectOptionPagado] = useState(0);
    const [selectOptionViajante, setOptionViajante] = useState(0);
    const [selectOptionMes, setSelectOptionMes] = useState(0);

    const options = [
        { value: 1, label: 'Cliente' },
        { value: 2, label: 'Pagados' },
        { value: 3, label: 'NotaEnvio' },
        { value: 4, label: 'Fecha' },
        { value: 5, label: "Viajante" },
        { value: 6, label: "Fecha Mes" }
    ];

    const handleChange = (evt) => {
        const option = evt.target.value
        switch (option) {
            case "Pagados":
                searchByPagados(selectOptionPagado)
                break;
            case "Viajante":
                searchByViajante(selectOptionViajante)
                break;
            case "Fecha Mes":
                searchMesFecha(selectOptionMes)
                break;
        }
        setSearch("");
        setSelectedOption(option);
    };

    const handleRedictToNewCliente = (evt) => {
        navegate("/notaEnvios/crear");
    }

    const handleChangeSeach = (evt) => {
        const search = evt.target.value

        // SI el search esta Vasio, refrescar la tabla, sino buscar por cada una 
        if (search == "")
            refreshTable()
        else
            switch (selectedOption) {
                case "Cliente":
                    searchByCliente(search)
                    break;
                case "NotaEnvio":
                    searchByNotaEnvio(search)
                    break;
                case "Fecha":
                    searchByFecha(search)
                    break;
            }

        setSearch(search);
    }

    const HandleChangeInput: React.FC = () => {

        const pagados = [{ id: 1, pagado: 0, label: "No Pagado" }, { id: 2, pagado: 1, label: "Pagado" }]
        const meses = [{ mes: "enero", value: 1 },
        { mes: "febrero", value: 2 },
        { mes: "marzo", value: 3 },
        { mes: "abril", value: 4 },
        { mes: "mayo", value: 5 },
        { mes: "junio", value: 6 },
        { mes: "julio", value: 7 },
        { mes: "agosto", value: 8 },
        { mes: "septiembre", value: 9 },
        { mes: "octubre", value: 10 },
        { mes: "noviembre", value: 11 },
        { mes: "diciembre", value: 12 }
        ]

        switch (selectedOption) {
            case "Cliente":
                return <input
                    className=" bg-gray-200 w-[190px] appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder={`Buscar por Cliente`}
                    onChange={handleChangeSeach}
                    value={search}
                />
            case "Pagados":
                return <select
                    id="comboBox"
                    name="comboBox"
                    value={selectOptionPagado}
                    onChange={(evt) => { {searchByPagados(evt.target.value); setSelectOptionPagado(evt.target.value)} }}
                    className="mt-1 block w-[160px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {pagados.map((option) => (
                        <option key={option.id} value={option.pagado}>
                            {option.label}
                        </option>
                    ))}
                </select>
            case "NotaEnvio":
                return <input
                    className=" bg-gray-200 w-[190px] appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="number"
                    placeholder={`Buscar por Nota Envio`}
                    onChange={handleChangeSeach}
                    value={search}
                />
            case "Fecha":
                return <input
                    className=" bg-gray-200 w-[190px] appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="date"
                    placeholder={`Buscar por Fecha`}
                    onChange={handleChangeSeach}
                    value={search}
                />
            case "Fecha Mes":
                return <select
                    id="comboBox"
                    name="comboBox"
                    value={selectOptionMes}
                    onChange={(evt) => { searchMesFecha(evt.target.value); setSelectOptionMes(evt.target.value) }}
                    className="mt-1 block w-[160px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {meses.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.mes}
                        </option>
                    ))}
                </select>
            case "Viajante":
                return <select
                    id="comboBox"
                    name="comboBox"
                    value={selectOptionViajante}
                    onChange={(evt) => { searchByViajante(evt.target.value); setOptionViajante(evt.target.value) }}
                    className="mt-1 block w-[160px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    {apiViajantes.map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.apellido} {" "} {option.nombre}
                        </option>
                    ))}
                </select>
        }
    }

    return <div className="w-full flex flex-row justify-center items-center gap-2 my-2">
        <select
            id="comboBox"
            name="comboBox"
            value={selectedOption}
            onChange={handleChange}
            className="mt-1 block w-[130px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            {options.map((option) => (
                <option className="text-sm" key={option.value} value={option.label}>
                    {option.label}
                </option>
            ))}
        </select>
        <HandleChangeInput />
        
        <span><CiSquarePlus className="block text-2xl w-[30px] cursor-pointer text-indigo-500 hover:text-indigo-700" onClick={handleRedictToNewCliente} /></span>
    </div>
}

export default SearchNotaEnvio;