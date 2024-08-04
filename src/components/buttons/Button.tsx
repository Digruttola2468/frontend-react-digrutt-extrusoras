interface buttonInterface {
    handleClick: VoidFunction,
    buttonName: string
}

const Button = (props: buttonInterface) => {
    return <button
        className="w-full active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
        onClick={props.handleClick}>
        {props.buttonName}
    </button>
}

export default Button