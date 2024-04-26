"use client"

type Props = {
    title: string,
    active: string,
    handleClick: (value: string) => void,
    icon: any,
    wide?: boolean,
}

const ImportsMenuItem = ({ title, active, handleClick, icon, wide }: Props) => {

    return (
        <div
            className={`h-[87px] ${wide ? "w-[110px]" : "w-[100px]"} px-2 flex flex-col gap-[1px] justify-center items-center text-center rounded-lg hover:cursor-pointer hover:shadow-menu ${title === active ? "font-semibold tracking-normal bg-gray-200/60 text-gray-900" : "tracking-wide text-gray-600"}`}
            onClick={() => handleClick(title)}
        >
            {icon}
            <h4 className="text-[16px] leading-[19px]">{title}</h4>
        </div>
    )
}

export default ImportsMenuItem