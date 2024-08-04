import { ChangeEventHandler } from "react"

type flow = "row" | "col"

interface textFieldInterface {
    type?: string,
    required?: boolean,
    placeholder?: string,
    label: string,
    onChange: ChangeEventHandler,
    valueText: string,
}

const TextField = (props: textFieldInterface) => {
    return <div>
        <label className="block text-sm font-medium leading-6 text-gray-900">
            {props.label}
        </label>
        <div className="w-full">
            <input 
                className=" bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" 
                type={props?.type ?? "text"}
                required={props?.required ?? false}
                placeholder={props.placeholder}
                onChange={props.onChange}
                value={props.valueText}
                />
        </div>
    </div>
}

export default TextField