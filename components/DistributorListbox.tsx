import { Product } from '@/constants'
import { Listbox } from '@headlessui/react'
import React, { MouseEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineCheck } from 'react-icons/md'
import { RiCloseFill } from 'react-icons/ri'

type Props = {
    selectedDistributor: string,
    setSelectedDistributor: (prev: any) => void,
}

const distributors = ["Companies", "Users"]

const DistributorListbox = ({ selectedDistributor, setSelectedDistributor }: Props) => {

    distributors.sort()

    return (
        <Listbox value={selectedDistributor} onChange={setSelectedDistributor}>
            <div className="relative">
                <Listbox.Button
                    className={`w-28 text-[15px] flex items-center border border-gray-300 rounded-sm pl-2 pr-1 py-[2.5px] focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none ${selectedDistributor ? "text-gray-600" : "text-gray-400"}`}
                >
                    {selectedDistributor}
                    <FaChevronDown
                        size={10}
                        className="ml-auto text-gray-600"
                    />
                </Listbox.Button>
                <Listbox.Options
                    className="absolute z-10 w-full max-h-[350px] overflow-y-auto border border-gray-300 bg-white text-gray-600"
                >
                    {distributors.map((d, i) => (
                        <Listbox.Option
                            key={i}
                            className={`relative cursor-default pl-2 py-[2px] hover:bg-lime-200/70 hover:text-lime-900 text-gray-900}`}
                            value={d}
                        >
                            <span className="flex-grow text-[15px]">{d}</span>
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </div>
        </Listbox>
    )
}

export default DistributorListbox