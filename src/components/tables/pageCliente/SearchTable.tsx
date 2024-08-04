import { useState } from "react";
import { useClient } from "../../../context/Clientes.context";
import { useNavigate } from "react-router-dom";
import { CiSquarePlus } from "react-icons/ci";

const SearchTable = () => {
    const navegate = useNavigate();
    const { searchByCliente, searchByDomicilio, searchByTelefono, refreshTable } = useClient();

    const [search, setSearch] = useState("");
    const [selectedOption, setSelectedOption] = useState("Cliente");

    const options = [
        { value: 1, label: 'Cliente' },
        { value: 2, label: 'Domicilio' },
        { value: 3, label: 'Teléfono' },
    ];

    const handleChange = (evt) => {
        setSearch("")
        setSelectedOption(evt.target.value);
    };
    
    const handleRedictToNewCliente = (evt) => {
        navegate("/clientes/newClient");
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
                case "Domicilio":
                    searchByDomicilio(search)
                    break;
                case "Teléfono":
                    searchByTelefono(search)
                    break;
            }
        
        setSearch(search);
    }

    return <div className="w-full flex flex-row justify-center items-center gap-2 my-2">
        <select
            id="comboBox"
            name="comboBox"
            value={selectedOption}
            onChange={handleChange}
            className="mt-1 block w-[140px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            {options.map((option) => (
                <option key={option.value} value={option.label}>
                    {option.label}
                </option>
            ))}
        </select>
        <input
            className=" bg-gray-200 w-[190px] appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            type="text"
            placeholder={`Buscar por ${selectedOption}`}
            onChange={handleChangeSeach}
            value={search}
        />
        <span><CiSquarePlus className="block text-2xl w-[30px] cursor-pointer text-indigo-500 hover:text-indigo-700" onClick={handleRedictToNewCliente}/></span>
    </div>
}

export default SearchTable;