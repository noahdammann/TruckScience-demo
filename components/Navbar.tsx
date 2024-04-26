import { Menu, Switch } from '@headlessui/react'
import Image from 'next/image'
import React from 'react'
import { IoSettingsSharp } from "react-icons/io5"

type Props = {
    preData: boolean,
    setPreData: (input: boolean) => void,
    sideNavigationStyle: boolean,
    setSideNavigationStyle: (input: boolean) => void,
}

const Navbar = ({ preData, setPreData, sideNavigationStyle, setSideNavigationStyle }: Props) => {

    return (
        <nav className="flex flex-row ml-[-2px]">

            {/* Truck Science logo */}
            <Image src="/truckscience-logo.png" priority height={46} width={168} alt="Truck Science" className="object-contain pb-2 pt-[6px]" />

            {/* Nav items container */}
            <div className="h-full ml-auto relative flex items-center">

                <Menu as="div" className="h-full">

                    <Menu.Button className={`flex justify-center items-center h-full w-16 hover:bg-gray-200/60`} >
                        <IoSettingsSharp size={28} />
                    </Menu.Button>

                    <Menu.Items
                        className="relative"
                    >
                        <div className={`w-[300px] z-50 py-4 px-8 gap-4 flex flex-col justify-center items-center bg-white absolute shadow-modern top-0 right-0`}>

                            <div className='flex items-center justify-center flex-col gap-1'>
                                <label className='text-lg font-semibold'>Pre-populated data:</label>
                                <div className='flex items-center justify-center gap-4'>
                                    <Switch
                                        checked={preData}
                                        onChange={setPreData}
                                        className={`${preData ? 'bg-tsgreen' : 'bg-gray-400'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span
                                            className={`${preData ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                </div>
                            </div>

                            <div className='flex items-center justify-center flex-col'>
                                <label className='text-lg font-semibold'>Text menu:</label>
                                <div className='flex items-center justify-center gap-4'>
                                    <Switch
                                        checked={sideNavigationStyle}
                                        onChange={setSideNavigationStyle}
                                        className={`${sideNavigationStyle ? 'bg-tsgreen' : 'bg-gray-400'
                                            } relative inline-flex h-6 w-11 items-center rounded-full`}
                                    >
                                        <span
                                            className={`${sideNavigationStyle ? 'translate-x-6' : 'translate-x-1'
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                </div>
                            </div>

                        </div>
                    </Menu.Items>

                </Menu>
            </div>

        </nav >
    )
}

export default Navbar