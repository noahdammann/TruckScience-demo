import { Menu } from '@headlessui/react'
import Image from 'next/image'
import React from 'react'
import { IoSettingsSharp } from "react-icons/io5"

type Props = {
    buttonLayout: number,
    setButtonLayout: (num: number) => void,
}

const Navbar = ({ buttonLayout, setButtonLayout }: Props) => {

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
                        <div className={`w-[300px] py-4 px-8 flex flex-col justify-center items-center bg-white absolute shadow-modern top-0 right-0`}>
                            <label className='text-lg font-semibold'>Button Layout:</label>
                            <div className='flex items-center justify-center gap-6'>
                                <label className='flex items-center justify-center gap-2'>
                                    <input
                                        type="radio"
                                        value="style1"
                                        checked={buttonLayout === 1}
                                        onChange={() => setButtonLayout(1)}
                                    />
                                    Layout 1
                                </label>
                                <label className='flex items-center justify-center gap-2'>
                                    <input
                                        type="radio"
                                        value="style2"
                                        checked={buttonLayout === 2}
                                        onChange={() => setButtonLayout(2)}
                                    />
                                    Layout 2
                                </label>
                            </div>
                        </div>
                    </Menu.Items>

                </Menu>
            </div>

        </nav >
    )
}

export default Navbar