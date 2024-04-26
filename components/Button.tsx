type Props = {
    title: string;
    handleClick: () => void;
    styles?: string;
    icon?: any;
    closeModalRef?: any;
}

const Button = ({ title, handleClick, icon, styles, closeModalRef }: Props) => {

    if (closeModalRef) {
        return (
            <button
                className={`px-[15px] py-[7px] rounded-full flex justify-center ${styles}`}
                onClick={handleClick}
                ref={closeModalRef}
            >
                {title}
                {icon}
            </button>
        )
    }

    return (
        <button className={`px-[15px] py-[7px] rounded-full flex justify-center ${styles}`} onClick={handleClick}>
            {title}
            {icon}
        </button>
    )
}

export default Button