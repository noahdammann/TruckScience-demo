"use client"

import { useState } from "react"
import { LiaShareAltSquareSolid } from "react-icons/lia"

const menu = [
    {
        name: "",
        id: 1,
        icon: <></>,
        description: ""
    },
    {
        name: "",
        id: 2,
        icon: <></>,
        description: ""
    },
    {
        name: "",
        id: 3,
        icon: <></>,
        description: ""
    },
    {
        name: "Import & Sharing",
        id: 4,
        icon: <LiaShareAltSquareSolid size={60} className="mx-auto" />,
        description: "View your products and manage access to them"
    }
]

type SideMenuProps = {
    active: number;
    setActive: (id: number) => void;
}

const SideMenu = ({ active, setActive }: SideMenuProps) => {

    return (
        <div className="h-full w-[200px]">
            {menu.map(item => {
                return (
                    <div
                        key={item.id}
                        className={`h-[130px] w-full relative px-[10px] border-r-[1px] border-b-[1px] flex flex-col items-center justify-center text-center hover:text-[#444444] hover:cursor-pointer ${active === item.id ? "bg-white text-[#444444]" : "text-[#6f8696]"}`}
                        onClick={() => setActive(item.id)}
                    >
                        {item.id === active
                            ? <div className="absolute right-0 top-0 h-full w-[6px] bg-tsgreen"></div>
                            : <></>
                        }
                        {item.icon}
                        <p className="text-xl font-bold my-[2px]">{item.name}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default SideMenu