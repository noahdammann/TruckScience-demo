"use client"

import { useState } from "react";
import { menu } from "@/constants";
import LibraryManager from "@/components/LibraryManager";
import Navbar from "@/components/Navbar";

export default function Home() {

    const [buttonLayout, setButtonLayout] = useState<number>(1)
    const [active, setActive] = useState(4)

    return (
        <>
            <Navbar buttonLayout={buttonLayout} setButtonLayout={setButtonLayout} />

            <main className="h-full flex shadow-outline rounded-sm overflow-y-hidden">

                {/* Left nav */}
                <div className="h-full w-[200px] overflow-y-auto">
                    {menu.map(item => {
                        return (
                            <div
                                key={item.id}
                                className={`h-[120px] relative px-[10px] border-r-[1px] border-b-[1px] flex flex-col items-center justify-center text-center hover:text-[#444444] hover:cursor-pointer ${active === item.id ? "bg-white text-[#444444]" : "text-[#6f8696]"}`}
                                onClick={() => setActive(item.id)}
                            >
                                {item.id === active
                                    ? <div className="absolute right-0 top-0 h-full w-[5px] bg-tsgreen"></div>
                                    : <></>
                                }
                                {item.icon}
                                <p className="text-xl font-bold my-[2px]">{item.name}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Right content */}
                <div className="h-full grow bg-white p-4">
                    {
                        active === 1 ? <></> :
                            active === 2 ? <></> :
                                active === 3 ? <></> :
                                    active === 4 ? <LibraryManager buttonLayout={buttonLayout} /> :
                                        <></>
                    }
                </div>

            </main>
        </>
    )
}

