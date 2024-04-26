import { Listbox } from '@headlessui/react'
import React, { MouseEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { MdOutlineCheck } from 'react-icons/md'
import { RiCloseFill } from 'react-icons/ri'

const options = ["Current", "Discontinued", "Special"]

type Props = {
    current: string[],
    setCurrent: (prev: any) => void,
}

const CurrentListbox = ({ current, setCurrent }: Props) => {

    const listboxRef = useRef<any>(null);

    const handleSelect = (input: string) => {
        setCurrent((prev: string[]) => {
            if (prev.includes(input)) {
                return prev.filter((i) => i !== input);
            } else {
                return [...prev, input];
            }
        });
    };

    const handleClear = () => {
        setCurrent([])
        setIsOpen(false)
    }

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listboxRef.current && !listboxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside as any);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside as any);
        };
    }, []);

    options.sort()

    return (
        <Listbox multiple>
            <div ref={listboxRef} className="relative">
                <Listbox.Button
                    className={`w-[145px] text-[15px] flex space-between items-center border border-gray-300 rounded-sm pl-2 pr-1 py-[2.5px] focus:ring-[1.2px] focus:ring-tsgreen focus:outline-none ${current ? "text-gray-600" : "text-gray-400"}`}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    {current.length > 0 ? (
                        `${current[0]} ${current.length > 1 ? `(+${current.length - 1})` : ""}`
                    ) : "Select Status"}
                    <FaChevronDown
                        size={10}
                        className="ml-auto text-gray-600"
                    />
                </Listbox.Button>
                {isOpen && (
                    <Listbox.Options
                        static
                        className="absolute w-full max-h-[350px] overflow-y-auto border border-gray-300 bg-white text-gray-600"
                    >
                        {current && (
                            <div
                                className="relative cursor-pointer pl-7 py-[2px] text-gray-900 hover:font-medium"
                                onClick={() => handleClear()}
                            >
                                <span>Clear</span>
                                <span className="absolute inset-y-0 pl-1 left-0 top-0 flex items-center text-black">
                                    <RiCloseFill size={22} />
                                </span>
                            </div>
                        )}
                        {options.map((o, i) => (
                            <Listbox.Option
                                key={i}
                                className={`relative cursor-default pl-2 py-[2px] hover:bg-lime-200/70 hover:text-lime-900 text-gray-90}`}
                                value={o}
                            >
                                <label
                                    className={`flex items-center space-x-2 py-[2px]`}
                                >
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 bg-white text-lime-600 rounded-sm border focus:ring-0 focus:ring-offset-0 focus:outline-0"
                                        onClick={() => handleSelect(o)}
                                        checked={current.includes(o)}
                                    />
                                    <span className="flex-grow text-[15px]">{o}</span>
                                </label>
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                )}
            </div>
        </Listbox>
    )
}

export default CurrentListbox