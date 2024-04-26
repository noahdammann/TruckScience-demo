"use client"

import { useEffect, useState } from "react";
import { Product, dummyPersonalLibrary, dummyTeamLibrary, menu } from "@/constants";
import TeamLibraryManager from "@/components/TeamLibraryManager";
import Navbar from "@/components/Navbar";
import DistributionManager from "@/components/DistributionManager";
const { loadIntercom, initIntercomWindow } = require("next-intercom");

loadIntercom({
    appId: "tq5umqtf", // default : ''
    email: "noahmdammann@gmail.com", //default: ''
    name: "Noah Dammann", //default: RandomName
    ssr: false, // default: false
    initWindow: true, // default: true
    delay: 0, // default: 0  - usefull for mobile devices to prevent blocking the main thread
});

export default function Home() {

    const [active, setActive] = useState(4)

    const [storagePersonal, setStoragePersonal] = useState<Product[]>([])
    const [storageTeam, setStorageTeam] = useState<Product[]>([])

    const [sideNavigationStyle, setSideNavigationStyle] = useState(false)
    const [preData, setPreData] = useState(false)

    const [personalLibrary, setPersonalLibrary] = useState<Product[]>([])
    const [teamLibrary, setTeamLibrary] = useState<Product[]>([])

    useEffect(() => {
        if (preData) {
            setStoragePersonal(personalLibrary)
            setStorageTeam(teamLibrary)

            setPersonalLibrary(dummyPersonalLibrary)
            setTeamLibrary(dummyTeamLibrary)
        } else {
            setPersonalLibrary(storagePersonal)
            setTeamLibrary(storageTeam)
        }
    }, [preData])

    return (
        <>
            <Navbar
                preData={preData}
                setPreData={setPreData}
                sideNavigationStyle={sideNavigationStyle}
                setSideNavigationStyle={setSideNavigationStyle}
            />

            <main className="h-full flex shadow-outline rounded-sm overflow-y-hidden">

                {/* Left nav */}
                {sideNavigationStyle && <div className="h-full w-[250px] overflow-y-auto">
                    {menu.map(item => {
                        return (
                            <div
                                key={item.id}
                                className={`h-[53px] relative px-[10px] border-r-[1px] border-b-[1px] flex flex-col pl-4 justify-center hover:text-[#444444] hover:cursor-pointer ${active === item.id ? "bg-white text-[#444444] shadow-outline-sm" : "text-[#6f8696]"}`}
                                onClick={() => setActive(item.id)}
                            >
                                {item.id === active
                                    ? <div className="absolute right-0 top-0 h-full w-[4px] bg-tsgreen"></div>
                                    : <></>
                                }
                                <p className="text-md font-bold">{item.name}</p>
                            </div>
                        )
                    })}
                </div>}

                {!sideNavigationStyle && <div className="h-full w-[200px] overflow-y-auto">
                    {menu.map(item => {
                        return (
                            <div
                                key={item.id}
                                className={`h-[100px] relative px-[10px] border-r-[1px] border-b-[1px] flex flex-col items-center justify-center text-center hover:text-[#444444] hover:cursor-pointer ${active === item.id ? "bg-white text-[#444444]  shadow-outline-sm" : "text-[#6f8696]"}`}
                                onClick={() => setActive(item.id)}
                            >
                                {item.id === active
                                    ? <div className="absolute right-0 top-0 h-full w-[5px] bg-tsgreen"></div>
                                    : <></>
                                }
                                {item.icon}
                                <p className="text-md font-bold">{item.name}</p>
                            </div>
                        )
                    })}
                </div>
                }

                {/* Right content */}
                <div className="h-full grow bg-white px-5 py-3">
                    {
                        active === 1 ? <></> :
                            active === 2 ? <></> :
                                active === 3 ? <></> :
                                    active === 4 ?
                                        <TeamLibraryManager
                                            personalLibrary={personalLibrary}
                                            teamLibrary={teamLibrary}
                                            setPersonalLibrary={setPersonalLibrary}
                                            setTeamLibrary={setTeamLibrary}
                                        /> :
                                        active === 5 ?
                                            <DistributionManager
                                                personalLibrary={personalLibrary}
                                                setPersonalLibrary={setPersonalLibrary}
                                                teamLibrary={teamLibrary}
                                                setTeamLibrary={setTeamLibrary}
                                                preData={preData}
                                            /> :
                                            active === 6 ? <></> :
                                                <></>
                    }
                </div>

            </main>
        </>
    )
}